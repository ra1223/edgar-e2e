class FilingNotFound extends Error {
  constructor(message = '', ...args) {
    super(message);
    this.name = 'FilingNotFound'
    this.status = 404;
  }
}

module.exports = {
  FilingNotFound
};
