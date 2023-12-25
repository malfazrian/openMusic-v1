const ClientError = require('./ClientError')

class PayloadTooLargeError extends ClientError {
  constructor (message) {
    super(message, 413)
    this.name = 'PayloadTooLargeError'
  }
}

module.exports = PayloadTooLargeError
