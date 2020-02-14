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
      [Segments.BODY]: Joi.object({
        company_symbol: Joi.string().empty().length(4).required()
        .messages({
          'string.empty': `company_symbol can't be empty`,
          'string.length': 'company_symbol must be of length 4',
          'any.required': 'company_symbol is required'
        })
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