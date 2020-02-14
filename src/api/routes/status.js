const { Router } = require('express');

const route = Router();

module.exports = (app) => {
  app.use(route);

  route.get('/health', (req, res) => {
    console.log('Inside /api/status/check');
    return res.status(201).json({ message: 'ok' });
  });
}