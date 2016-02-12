
import bodyParser from 'body-parser';
import express from 'express';
import Joi from 'joi';
import supertest from 'supertest-as-promised';
import validate from '../index';
import {expect} from 'chai';
import * as web from 'express-decorators';

@web.controller('/test')
class TestController {

  @web.post('/')
  @validate(Joi.object().keys({
    name: Joi.string().required(),
    birthdate: Joi.date().iso()
  }))
  indexAction(request, response) {
    expect(request.data.name).to.equal('bob');
    expect(request.data.birthdate).to.be.instanceof(Date);
    response.send();
  }

  @web.put('/')
  @validate(Joi.object().keys({
    name: Joi.string().required()
  }))
  errorAction(request, response) {
    throw new Error('shouldn\'t have run');
  }
}


describe('express-decorators-joi', function () {
  let app;

  beforeEach(function () {
    app = express();
    app.use(bodyParser.json());

    let controller = new TestController();
    controller.register(app);

    // register a quieter error handler
    app.use(function (err, request, response, next) {
      response.status(parseInt(err.status) || 500);
      //console.log(err.stack);
      response.send('error');
    });
  });


  it('should put the converted object into request.data', async function () {
    let response = await supertest(app)
      .post('/test')
      .send({
        name: 'bob',
        birthdate: '1989-01-01'
      })
      .expect(200);
  });


  it('should quit with an error on validation failure', async function () {
    let response = await supertest(app)
      .put('/test')
      .expect(400);

    expect(response.text).to.equal('error');
  });
});
