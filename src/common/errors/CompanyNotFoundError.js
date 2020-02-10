class CompanyNotFoundError extends Error {
  constructor(message = '', ...args) {
    super(message);
    this.name = 'CompanyNotFoundError'
    this.status = 400;
  }
}

module.exports = {
  CompanyNotFoundError
};
