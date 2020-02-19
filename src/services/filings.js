// Business logic for all filings.

const puppeteer = require('puppeteer');

const { SEC_GOV_BASE_URL, SEC_GOV_COMPANY_URL } = require('../common/constants');
const { CompanyNotFoundError, FilingNotFound } = require('../common/errors/CompanyNotFoundError');

/**
 * 
 * @param {string} companySymbol - company symbol is a unique series of letters assigned to a 
 * security for trading purposes. New York Stock Exchange (NYSE) and American Stock Exchange 
 * (AMEX) listed stocks have three characters or less. Nasdaq-listed securities have four or 
 * five characters.
 * @param {string} filing_type - type of filing requested.
 * @param {string: date format('YYYY-MM-DD')} filed_prior_to - date where filings were filed.
 * 
 * Buisness logic to handle GET /api/filings
 * 
 * There are three phases in the function:
 * 
 * 1. Setting up the puppeteer browser and adding additional attributes where required and 
 * optional (i.e. company_symbol is required, filed_prior is optional) and go to the web page.
 * 
 * 2. Gather all links to access the filings of a company by evaluating the web page. If the 
 * company symbol, can't be found, throw a CompanyNotFoundError.
 * 
 * 3. If the company_symbol can be found, gather the filing numbers, links, and dates filed, 
 * and return all of them in an array.
 * 
 */
const getAllFilings = async (companySymbol, filing_type, filed_prior_to) => {
  let browser;

  try {
    // Phase 1
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const secLink = SEC_GOV_COMPANY_URL + 
                  companySymbol + 
                  (filing_type ? `&type=${filing_type}`: '') +
                  (filed_prior_to ? `&dateb=${filed_prior_to.replace(/-/g, '')}` : '');

    await page.goto(secLink);

    // Phase 2
    const documentLinks = await page.evaluate((SEC_GOV_BASE_URL) => {
      const notFoundTag = document.querySelector('body > div > center > h1');

      if (notFoundTag && notFoundTag.innerText === 'No matching Ticker Symbol.') {
        return null;
      }

      const documentButtons = Array.from(document.querySelectorAll('#documentsbutton'));

      return documentButtons.map((documentButton) => SEC_GOV_BASE_URL + documentButton.getAttribute('href'));
    }, SEC_GOV_BASE_URL);

    if (documentLinks === null) {
      throw new CompanyNotFoundError('No company found.');
    }

    if (documentLinks.length == 0) {
      throw new FilingNotFound('No filings found.')
    }

    // Phase 3
    const filings = [];

    for (documentLink of documentLinks) {
      await page.goto(documentLink);
      await page.waitForSelector('#formDiv > div > table > tbody > tr:nth-child(2)');

      const { number, link, date } = await page.evaluate((SEC_GOV_BASE_URL) => {
        return {
          number: document.querySelector('#formDiv > div > table > tbody > tr:nth-child(2) > td:nth-child(4)').innerText,
          link: SEC_GOV_BASE_URL + document.querySelector('#formDiv > div > table > tbody > tr:nth-child(2) > td:nth-child(3) > a').getAttribute('href'),
          date: document.querySelector('#formDiv > div.formContent > div.formGrouping > div:nth-child(2)').innerText
        }
      }, SEC_GOV_BASE_URL);

      filings.push({
        number,
        link,
        date        
      });
    }

    return filings;
  } catch (e) {
    console.log(e.toString());
    throw e;
  } finally {
    await browser.close();
  }
};

module.exports = {
  getAllFilings
};
