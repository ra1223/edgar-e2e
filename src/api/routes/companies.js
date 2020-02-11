const { Router } = require('express');
const { celebrate, Joi, Segments, errors } = require('celebrate');

const { getCompanyData } = require('../../services/companies');
const { CompanyNotFoundError } = require('../../common/errors/CompanyNotFoundError');

const route = Router();

module.exports = (app) => {
  app.use('/', route);

  route.get(
    '/company',
    celebrate({
      [Segments.BODY]: Joi.object({
        company_symbol: Joi.string().length(4).required()
      })
    }),
    async (req, res) => {
      try {
        const { company_symbol } = req.body;

        const { company_name, company_address, company_phone_number } = await getCompanyData(company_symbol);

        return res.status(200).json({ company_name, company_symbol, company_address, company_phone_number });
      } catch (e) {
        if (e instanceof CompanyNotFoundError) {
          return res.status(400).json({ message: e.message });
        }

        return res.status(500).json({ message: e.message });
      }
    }
  )

  route.use(errors());
};