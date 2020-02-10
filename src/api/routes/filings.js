const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');

const { getAllFilings } = require('../../services/filings');

const { CompanyNotFoundError } =  require('../../common/errors/CompanyNotFoundError');

const route = Router();

module.exports = (app) => {
  app.use('/', route);

  route.get('/status', (req, res) => res.status(201).json({ message: 'ok' }));

  route.get(
    '/filings',
    celebrate({
      body: Joi.object({
        company_symbol: Joi.string().required()
      })
    }),
    async (req, res) => {
      try {
        const { company_symbol } = req.body;

        const filings = await getAllFilings(company_symbol);

        return res.status(200).json({ company_symbol, filings });
      } catch (e) {
        if (e instanceof CompanyNotFoundError) {
          return res.status(e.status).json({ message: e.message });
        } 
        
        return res.status(500).json({ message: e.message });
      }
    }
  )
}