const puppeteer = require('puppeteer');

const htmlPattern = RegExp('/^(.*\.(?!(htm|html|class|js)$))?[^.]*');

const { SEC_GOV_BASE_URL, SEC_GOV_COMPANY_URL } = require('../common/constants');
const { CompanyNotFoundError } = require('../common/errors/CompanyNotFoundError');

const getAllFilings = async (companySymbol = '') => {
  if (companySymbol == '') {
    throw new CompanyNotFoundError('Empty or null company_symbol');
  }

  let browser;
  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto(SEC_GOV_COMPANY_URL + companySymbol);

    const documentLinks = await page.evaluate((SEC_GOV_BASE_URL) => {
      const documentButtons = Array.from(document.querySelectorAll('#documentsbutton'));
      return documentButtons.map((documentButton) => SEC_GOV_BASE_URL + documentButton.getAttribute('href'));
    }, SEC_GOV_BASE_URL);

    if (documentLinks === null || documentLinks.length === 0) {
      throw new CompanyNotFoundError('Invalid company input');
    }

    let filings = [];

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
