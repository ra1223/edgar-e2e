# Edgar E2E

## Description

This is a Node.js REST application that'll scrape data from the [SEC Edgar webpages](https://www.sec.gov/edgar/searchedgar/companysearch.html).

## Project Structure

```text
+-- README.md
+-- package.json
+-- package-lock.json
+-- .gitignore
+-- src/
   +-- app.js
   +-- api/
      +-- index.js
      +-- routes/
          +-- companies.js
          +-- filings.js
          +-- status.js
    +-- common/
        +-- constants.js
        +-- errors/
            +-- CompanyNotFoundError.js
            +-- InvalidInputError.js
    +-- config/
        +-- index.js
    +-- loaders/
        +-- express.js
        +-- index.js
    +-- services/
        +-- companies.js
        +-- filings.js
```

## Start App

1. Clone the repo:

```shell
git clone https://github.com/Raul-Alvarez/edgar-e2e.git
```

2. Install the `npm` packages:

```shell
npm install
```

3a. Run the app:

```shell
npm start
```

3b. To run with `nodemon`, invoke:

```shell
npm run dev
```


## Deployment

The app is currently live on Heroku. The base url is: `https://lit-garden-30494.herokuapp.com`

## REST APIs

### Get Fillings of Company

- **URL:**

`/api/filings/`

- **Method:**

`GET`

- **Query Parameters:**

**Required:**

`company_symbol=[string]`: min length = 2, max length = 5. i.e `GOOG`, `AAPL`

**Optional**

`filing_type=[string]` i.e `4`, `3`

`filing_prior_type=[string format('YYYY-MM-DD')]` i.e. `2020-01-15`

- **Body Params:**

None

- **Success Response:**

Status: 200

```json
{
  "company_symbol": "GOOG",
  "filings": [
    {
      "number": "SC 13G/A",
      "link": "https://sec.gov/Archives/edgar/data/1242463/000119312520035882/d812296dsc13ga.htm",
      "date": "2020-02-14"
    },
    {
      ...
    }
  ]
}
```

- **Failed Response:**

Status: 404

```json
{
  "error": {
    "status": 404,
    "type": "CompanyNotFoundError",
    "message": "No company found."
  }
}
```

Status: 400

```json
{
  "error": {
    "status": 400,
    "type": "InvalidInputError",
    "message": "\"company_symbol\" length must be less than or equal to 5 characters long"
  }
}
```

### Get Company Info

- **URL:**

`/api/company/`

- **Method:**

`GET`

- **Query Parameters:**

**Required:**

`company_symbol=[string]`: min length = 2, max length = 5. i.e `GOOG`, `AAPL`

**Optional**

None

- **Body Params:**

None

- **Success Response:**

Status: 200

```json
{
  "company_name": "Alphabet Inc.",
  "company_symbol": "GOOG",
  "company_address": "1600 AMPHITHEATRE PARKWAY, MOUNTAIN VIEW CA 94043",
  "company_phone_number": "650-253-0000"
}
```

- **Failed Response:**

Status: 404

```json
{
  "error": {
    "status": 404,
    "type": "CompanyNotFoundError",
    "message": "No company found."
  }
}
```

Status: 400

```json
{
  "error": {
    "status": 400,
    "type": "InvalidInputError",
    "message": "\"company_symbol\" length must be less than or equal to 5 characters long"
  }
}
```

### Health Check

- **URL:**

`/api/health/`

- **Method:**

`GET`

- **Successful Response:**

Status: 200

```json
{
  "message": "ok"
}
```

## Learnings / Findings

- [Structuring Node.js code base](https://softwareontheroad.com/ideal-nodejs-project-structure/)

In my previous role, I had a template code base to clone from so I usually never questioned how to structure my Node.js projects. I decided to research online and found a solid structure where everything is well organized and easily changable without having to fix code in several files.

- [Working with a validator (Joi/celebrate)](https://github.com/arb/celebrate)

I've previously worked such as [Lodash](https://lodash.com/) before but I did build my own middleware for validating requests. I realized that such a library existed such as `celebrate` which leverages `Joi` that makes life much simpler. 

- [Parsing html](https://github.com/puppeteer/puppeteer)

I never tried out parsing html before so I had to get accustomed to puppeteer which I believe is a great library. 

- [Getting puppeteer to work on Heroku](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-heroku). 

Previously, I deployed the app and was getting `500` errors with `page`, `page.close()`, etc not being recognize. It turned out that the Heroku app instances don't natively support puppteer so the puppeteer community created a webpack as a fix.
