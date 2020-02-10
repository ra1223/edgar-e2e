const dotenv = require('dotenv');

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000
}