class ValidationError extends Error {
  constructor(messages) {
    super('Validation Error: ', messages);
    this.name = 'Validation Error';
    this.messages = messages;
  }
}

export default ValidationError;
