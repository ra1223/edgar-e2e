const bodyParser = require('body-parser');

const routes = require('../api');
const { InvalidInputError } = require('../common/errors/InvalidInputError');

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use('/api', routes());
  
  /**
   * Error middleware for unrecognized endpoints.
   * 
   * ex: {base url}/api/endpoint-that-doesnt-exist-in-app
   */
  app.use((req, res, next) => {
    const error = new Error('Endpoint not found');
    error.status = 404;
    return next(error);
  });

  /**
   * Error middleware that responds to a failed request.
   */
  app.use((err, req, res, next) => {
    if (err.joi) {
      err = new InvalidInputError(err.message);
    }

    console.debug(err.status + ' ' + err.name + ' ' + err.message);

    return res.status(err.status || 500).json({
      error: {
        status: err.status,
        type: err.name,
        message: err.message,
      }
    });
  });
};