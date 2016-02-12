
var Joi = require('joi');
var middleware = require('express-decorators').middleware;


function validate(schema) {
  return middleware(function validateMiddleware (request, response, next) {
    let validation = Joi.validate(request.body, schema);

    if (validation.error) {
      validation.error.status = "400"
      next(validation.error);
    } else {
      request.data = validation.value;
      next();
    }
  });
}


module.exports = validate;
