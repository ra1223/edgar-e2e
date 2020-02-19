// All routes for the status of the app.

const { Router } = require('express');

const route = Router();

module.exports = (app) => {
  app.use(route);

  route.get('/health', (req, res) => {
    return res.status(200).json({ message: 'ok' });
  });
}