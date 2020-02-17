// Loads everything necessary to get the app started.

const expressLoader = require('./express');

module.exports = async (app) => {
  await expressLoader(app);
  console.log('Connected Express');
};