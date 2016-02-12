# express-decorators-joi

Defines a middleware function for [express-decorators](https://www.npmjs.com/package/express-decorators) that validates request data using [Joi](https://www.npmjs.com/package/joi).

## Installation

    $ npm install --save express-decorators-joi


## Usage

```js
import * as web from 'express-decorators';
import validate from 'express-decorators-joi';

@web.controller('/')
class TestController {

  @web.get('/test')
  @validate(Joi.object().keys({
    name: Joi.string().required(),
    birthdate: Joi.date().iso()
  }))
  testAction(request, response) {
    // request.data contains the validated (and converted) data
  }
}
```

It validates `request.body`, so you'll need [body-parser](https://www.npmjs.com/package/body-parser) installed and `use`d.  If the validation fails, the middleware calls `next` with a Joi `ValidationError`.  You should probably trap this error and return an HTTP 400, e.g.:

```js
app.use(function (err, request, response, next) {
  if (err.name === 'ValidationError') {
    response.status(400).json({error: err.message});
  }
});
```

That's about it.


## Licence etc

ISC, do what you want.  All bug reports, issues, comments, suggestions and pull requests welcome.
