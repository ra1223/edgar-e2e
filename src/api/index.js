// Load routes to app
const { Router } = require('express');
const status = require('./routes/status');
const filings = require('./routes/filings');

module.exports = () => {
  const app = Router();

  status(app);
  filings(app);

  return app;
};