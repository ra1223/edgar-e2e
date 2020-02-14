const puppeteer = require('puppeteer');

const { SEC_GOV_COMPANY_URL }  = require('../common/constants')
const { CompanyNotFoundError } = require('../common/errors/CompanyNotFoundError');

const getCompanyData = async (company_symbol = '') => {
  if (company_symbol == '') {
    throw new CompanyNotFoundError('Empty or null company_symbol');
  }

  let browser;
  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto(SEC_GOV_COMPANY_URL + company_symbol);

    const companyData = await page.evaluate(() => {
      const notFoundTag = document.querySelector('body > div > center > h1');

      if (notFoundTag && notFoundTag.innerText === 'No matching Ticker Symbol.') {
        return null;
      }

      return { 
        company_name: document.querySelector('#contentDiv > div:nth-child(1) > div.companyInfo > span').innerText.split('CIK#:')[0].trim(),
        company_address: document.querySelector('#contentDiv > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)').innerText + ', ' +
          document.querySelector('#contentDiv > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)').innerText.trim(),
        company_phone_number: document.querySelector('#contentDiv > div:nth-child(1) > div:nth-child(2) > span:nth-child(3)').innerText
      }
    });

    if (companyData === null) {
      throw new CompanyNotFoundError('No company found.');
    }

    return companyData;
  } catch (e) {
    throw e;
  } finally {
    await browser.close();
  }
};

module.exports = {
  getCompanyData
}; 