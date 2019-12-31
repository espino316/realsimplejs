RS.BreakException = {};

/**
 * Exception class
 *
 * @return {undefined}
 */
RS.Exception = function(message, reference) {
  this.message = message;
  this.reference = reference;
}; // end class Exception
