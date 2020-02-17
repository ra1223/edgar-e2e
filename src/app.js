// Starting point of the app.

const express = require('express');

const config = require('./config');

const startServer = async () => {
  const app = express();

  await require('./loaders')(app);

  app.listen(config.port, (err) => {
    if (err) {
      console.err(`Error: ${err}`);
      return;
    }

    console.log(`Listening on http://localhost:${config.port}`);
  })
};

startServer();