export class MethodNotImplementedError extends Error {
  constructor(message) {
    super(message);
    let methodName = this.stack.match(/(at )(\w+)/)
    this.message = `The method "${methodName}" must be implemented in the subclass`;
    this.name = 'MethodNotImplementedError';
  }
}
