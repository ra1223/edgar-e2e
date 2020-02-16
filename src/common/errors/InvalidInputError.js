class InvalidInputError extends Error {
  constructor(message = '', ...args) {
    super(message);
    this.name = 'InvalidInputError';
    this.status = 400;
  }
}

module.exports = {
  InvalidInputError
}