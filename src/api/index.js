// Load all routes for express.

const { Router } = require('express');

const status = require('./routes/status');
const filings = require('./routes/filings');
const companies = require('./routes/companies');

module.exports = () => {
  const app = Router();

  status(app);
  filings(app);
  companies(app);

  return app;
};