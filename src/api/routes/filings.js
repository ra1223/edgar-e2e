// Routes for filings

const { Router } = require('express');
const { celebrate, Segments, errors } = require('celebrate');
const Joi = require('@hapi/joi')
    .extend(require('@hapi/joi-date'));

const { getAllFilings } = require('../../services/filings');

const route = Router();

module.exports = (app) => {
  app.use(route);

  route.get(
    '/filings',
    celebrate({
      query: Joi.object({
        company_symbol: Joi.string().min(1).max(5).required(),
        filing_type: Joi.string(),
        filed_prior_to: Joi.date().format('YYYY-MM-DD').raw()
      })
    }),
    async (req, res, next) => {
      try {
        const { 
          company_symbol,
          filing_type,
          filed_prior_to
        } = req.query;

        const filings = await getAllFilings(
          company_symbol,
          filing_type,
          filed_prior_to
        );

        return res.status(200).json({ company_symbol, filings });
      } catch (e) {
        return next(e);
      }
    }
  )
}