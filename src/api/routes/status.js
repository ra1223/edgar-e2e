const { Router } = require('express');

const route = Router();

module.exports = (app) => {
  app.use('/status', route);

  route.get('/check', (req, res) => {
    console.log('Inside /api/status/check');
    return res.status(201).json({ message: 'ok' });
  });
}