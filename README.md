# Edgar E2E

## Start App

1. Clone the repo:

```shell
git clone https://github.com/Raul-Alvarez/edgar-e2e.git
```

2. Install the `npm` packages:

```shell
npm install
```

3. Run the app:

```shell
npm start
```

## REST APIs

* Get All Fillings of Company `GET /api/filings`

Request:

```json
{
  "company_symbol": "goog"
}
```

Response

```json
{
    "company_symbol": "goog",
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

* Get Company Information `GET /api/filings`

Request:

```json
{
  "company_symbol": "goog"
}
```

Response

```json
{
    "company_name": "Alphabet Inc.",
    "company_symbol": "goog",
    "company_address": "1600 AMPHITHEATRE PARKWAY, MOUNTAIN VIEW CA 94043",
    "company_phone_number": "650-253-0000"
}
```

* Get Company Information `GET /api/health`

Response

```json
{
    "message": "ok"
}
```