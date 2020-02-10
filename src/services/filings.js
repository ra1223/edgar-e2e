const puppeteer = require('puppeteer');

const htmlPattern = RegExp('/^(.*\.(?!(htm|html|class|js)$))?[^.]*');

// let browser;
// const launchBrowser = async () => {
//   console.log('Lauched browser');
//   browser = await puppeteer.launch();
// };

// launchBrowser();

const { CompanyNotFoundError } = require('../common/errors/CompanyNotFoundError');

const getAllFilings = async (companySymbol = '') => {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${companySymbol}&owner=exclude&action=getcompany`);

    const documentLinks = await page.evaluate(() => {
      const documentButtons = Array.from(document.querySelectorAll('#documentsbutton'));
      return documentButtons.map((documentButton) => 'https://sec.gov' + documentButton.getAttribute('href'));
    });

    if (documentLinks === null || documentLinks.length === 0) {
      throw new CompanyNotFoundError('Invalid company input');
    }

    let filings = [];

    for (documentLink of documentLinks) {
      await page.goto(documentLink);
      await page.waitForSelector('#formDiv > div > table > tbody > tr:nth-child(2)');

      const { number, link, date } = await page.evaluate(() => {
        return {
          number: document.querySelector('#formDiv > div > table > tbody > tr:nth-child(2) > td:nth-child(4)').innerText,
          link: 'https://sec.gov' + document.querySelector('#formDiv > div > table > tbody > tr:nth-child(2) > td:nth-child(3) > a').getAttribute('href'),
          date: document.querySelector('#formDiv > div.formContent > div.formGrouping > div:nth-child(2)').innerText
        }
      });

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
