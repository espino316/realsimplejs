/**
 * Validations functions
 */
function Validations() {
  var self = this;

  /**
   * Validates a type
   *
   * @param {var} value The value to validate
   * @param {var} type The type to validate
   * @param {number} i The index, optional.
   *
   * @return {undefined}
   */
  var validateType = function(value, type, i) {
    if (typeof i == "undefined") {
      i = -1;
    } // end if i undefined

    if (type === null) {
      if (value !== null) {
        throw new Exception(
          "Argument " + i + " different type. It can be null also",
          "validateArguentTypes"
        ); // end throw
      } // end if args not null
      return;
    } // end if type = null

    //  If any type is object or function, we check type and constructor
    if (typeof type == "function" || typeof type == "object") {
      //  Check constructor
      if (value.constructor != type) {
        throw new Exception(
          "Different constructor at index position " + i,
          " validateArgumentsTypes"
        );
      } // end if differents constructors
      return;
    } // end if string

    if (typeof value != type) {
      throw new Exception(
        "Different type at index position " + i,
        " validateArgumentsTypes"
      );
    } // end if
  }; // end function validateType

  /**
   * Validates arguments types, comparing the type of the argument
   * with one pre-established array
   *
   * @param {array} args The arguments to validate
   * @param {array} types A list with the types for the arguments.
   *                      must be the same length and corresponding indexes
   *                      to args.
   *
   * @return {bool}
   */
  var validateArgumentsTypes = function(args, types) {
    //  For each argument, we validate againts the type
    var i = 0;
    for (i = 0; i < args.length; i++) {
      var type = types[i];
      var value = args[i];

      if (Object.prototype.toString.call(type) === "[object Array]") {
        var count = 0;
        var exception = null;
        type.forEach(
          function(item, index) {
            try {
              self.validateType(value, item, i);
            } catch (ex) {
              if (ex instanceof Exception) {
                exception = ex;
                count++;
                return;
              } // end if Exception
              console.error(ex);
            } // end try catch
          } // end anonymous forEach item
        ); // end forEach

        // If len == count, then is error
        if (type.length == count) {
          throw exception;
        } // end if len = count
        continue;
      } // end if type array

      validateType(value, type, i);
    } // end for

    return true;
  }; // end function validateArgumentTypes

  /**
   * Function to validate the quantity of arguments
   *
   * @param {array} args The arguments in the function
   * @param {int} quantity The quantity of arguments expected
   *
   * @return {undefined}
   */
  var validateArgumentsNumber = function(args, quantity) {
    if (args.length != quantity) {
      throw new Exception("Must set " + quantity + " arguments", this); // end throw
    } // end if all arguments present
  }; // end self validateArgumentsQuantity

  /**
   * Validates arguments number and types
   *
   * @param {array} _args The arguments to validate
   * @param {number} number The number of arguments
   * @param {array} types The types to validate against _args
   *
   * @return {undefined}
   */
  self.args = function(_args, number, types) {
    validateArgumentsNumber(_args, number);
    validateArgumentsTypes(_args, types);
  }; // end function args

  /**
   * The validations queue
   */
  var queue = [];

  /**
   * Adds an object and it's rules to the validations queue
   *
   * @param {object} obj The object to validate
   * @param {array} The rules to apply
   *
   * @return {Validations}
   */
  self.add = function(obj, options, message) {
    queue.push([obj, options, message]);
    return self;
  }; // end function add

  /**
   * Checks if an object is an array
   *
   * @param {object} obj The object to check
   *
   * @return {bool}
   */
  self.isArray = function(obj) {
    if (Object.prototype.toString.call(obj) === "[object Array]") {
      return true;
    }
    return false;
  }; // end prototype

  /**
   * Returns true if fn is a function
   *
   * @param {object} fn The object to validate if it's a function
   *
   * @return {bool}
   */
  self.isFunction = function(fn) {
    return fn && Object.prototype.toString.call(fn) === "[object Function]";
  }; // end self isFunction

  /**
   * Set of rules for validation
   */
  self.rules = {
    REQUIRED: function(obj, message) {
      if (obj === null || typeof obj == "undefined") {
        queue = [];

        if (typeof message == "undefined") {
          message = String(obj) + " is required";
        } // end if message

        throw new Exception(message, "Validations.REQUIRED");
      } // end if null
      return true;
    },
    NONEMPTY: function(obj, message) {
      if (obj == "" || obj === null || typeof obj == "undefined" ) {
        queue = [];

        if (typeof message == "undefined") {
          message = String(obj) + " is empty";
        } // end if message

        throw new Exception(message, "Validations.NONEMPTY");
      } // end if empty
      return true;
    },
    NUMERIC: function(obj, message) {
      if (!Math.isNumeric(obj)) {
        queue = [];

        if (typeof message == "undefined") {
          message = String(obj) + " is not numeric";
        } // end if message

        throw new Exception(message, "Validations.NUMERIC");
      } // end if not numeric
      return true;
    },
    INTEGER: function(obj, message) {
      if (!Number.isInteger(obj)) {
        queue = [];

        if (typeof message == "undefined") {
          message = String(obj) + " is not integer";
        } // end if message

        throw new Exception(message, "Validations.INTEGER");
      } // end if not numeric
      return true;
    },
    EMAIL: function(obj, message) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!re.test(obj)) {
        queue = [];

        if (typeof message == "undefined") {
          message = String(obj) + " is not EMAIL";
        } // end if message

        throw new Exception(message, "Validations.EMAIL");
      } // end if not numeric
      return true;
    } // end email function
  }; // end object rules

  /**
   * Execute all validations in the queue
   *
   * @return {bool}
   */
  self.validate = function() {
    if (queue.length === 0) {
      return true;
    } // end if queue count 0

    queue.forEach(
      function(item, index) {
        if (!self.isArray(item)) {
          queue = [];
          throw new Exception(
            "Item is not an array",
            "Validations.validate.isArray"
          ); // end Exception
        } // end if not array

        if (item.length != 3) {
          queue = [];
          throw new Exception(
            "The rule has more or less than three arguments. Only a value, a name and a set of rules are necessary",
            "Validations.validate"
          ); // end throw
        } // end if item length

        var val = item[0];
        var message = item[2];
        var rules = item[1];

        if (self.isFunction(rules)) {
          rules = [rules];
        } // end if isFunction

        if (!self.isArray(rules)) {
          throw new Exception(
            "Rules is not an array",
            "Validations.validate.Rules.isArray"
          ); // end Exception
        } // end if not array

        rules.forEach(
          function(rule) {
            rule(val, message);
          } // end anonymous forEach
        ); // end rules forEach
      } // end forEach anonymous function
    ); // end forEach

    queue = [];
    return true;
  }; // end function validate
} // end function validations

var validations = new Validations();
var VALIDATION_RULES = validations.rules;
