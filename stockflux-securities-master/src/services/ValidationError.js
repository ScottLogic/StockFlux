class ValidationError extends Error {
  constructor(messages) {
    super("Validation failed");
    this.messages = messages;
  }
}

export default ValidationError;
