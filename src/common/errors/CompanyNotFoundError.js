class CompanyNotFoundError extends Error {
  constructor(message = '', ...args) {
    super(message);
    this.name = 'CompanyNotFoundError'
    this.status = 404;
  }
}

module.exports = {
  CompanyNotFoundError
};
