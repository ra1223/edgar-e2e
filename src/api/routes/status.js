const { Router } = require('express');

const route = Router();

module.exports = (app) => {
  app.use(route);

  route.get('/health', (req, res) => {
    return res.status(201).json({ message: 'ok' });
  });
}