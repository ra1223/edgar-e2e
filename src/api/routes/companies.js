const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');

const { getCompanyData } = require('../../services/companies');
const { CompanyNotFoundError } = require('../../common/errors/CompanyNotFoundError');

const route = Router();

module.exports = (app) => {
  app.use(route);

  route.get(
    '/company',
    celebrate({
      query: {
        company_symbol: Joi.string().min(1).max(5).required()
      }
    }),
    async (req, res, next) => {
      try {
        const { company_symbol } = req.query;
        console.log(company_symbol);

        const { company_name, company_address, company_phone_number } = await getCompanyData(company_symbol);

        return res.status(200).json({ company_name, company_symbol, company_address, company_phone_number });
      } catch (e) {
        return next(e);
      }
    }
  )
};