const bodyParser = require('body-parser');

const routes = require('../api');

module.exports = (app) => {
  app.use(bodyParser.json());

  app.use('/api', routes());
};