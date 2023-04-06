RS.BreakException = {};

/**
 * Exception class
 *
 * @return {undefined}
 */
RS.Exception = (message, reference) => {
  this.message = message;
  this.reference = reference;
}; // end class Exception
