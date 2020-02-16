const { Router } = require('express');
const { celebrate, Joi, Segments, errors } = require('celebrate');

const { getAllFilings } = require('../../services/filings');

const { CompanyNotFoundError } =  require('../../common/errors/CompanyNotFoundError');

const route = Router();

module.exports = (app) => {
  app.use(route);

  route.get(
    '/filings',
    celebrate({
      query: {
        company_symbol: Joi.string().min(1).max(5).required()
      }
    }),
    async (req, res, next) => {
      try {
        const { company_symbol } = req.body;

        const filings = await getAllFilings(company_symbol);

        return res.status(200).json({ company_symbol, filings });
      } catch (e) {
        return next(e);
      }
    }
  )
}