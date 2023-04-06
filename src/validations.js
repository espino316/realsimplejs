/**
 * Validations functions
 */
RS.Validations = () => {

  let self = this;

  /**
   * Validates a type
   *
   * @param {var} value The value to validate
   * @param {var} type The type to validate
   * @param {number} i The index, optional.
   *
   * @return {undefined}
   */
  const validateType = (value, type, i = -1) => {

    if (type === null && value !== null) {
      throw new Exception(`Argument ${i} is of a different type. It can be null.`, "validateArguentTypes");
    }
    
    const { constructor } = value;

    if ((typeof type === "function" || typeof type === "object") && (constructor !== type)) {      
      throw new Exception(`Different constructor at index position ${i}`, "validateArgumentsTypes");
    }
  
    const { typeof: valueType } = value;
    if (valueType !== type) {
      throw new Exception(`Different type at index position ${i}`, "validateArgumentsTypes");
    }
  };

  /**
   * Validates arguments types, comparing the type of the argument
   * with one pre-established array
   *
   * @param {array} argumentsToValidate The arguments to validate
   * @param {array} types A list with the types for the arguments.
   *                      must be the same length and corresponding indexes
   *                      to args.
   *
   * @return {bool}
   */
  const validateArgumentsTypes = (argumentsToValidate, types) => {

    if (argumentsToValidate.length != types.length) {
      throw new Exception('Different lenghts for arguments and types');
    } // end if different lenghts

    // loop the entries
    for (let [i, value] of argumentsToValidate.entries()) {
      const type = types[i];

      if (!type) {
        throw new Error(`No type specified for argument at index ${i}.`);
      }

      if (Array.isArray(type)) {
        let exception = null;

        //  here we have an array of types
        //  to fail, every element in the array must be invalid        
        const atLeastOneValid = type.some((item) => {
          try {
            validateType(value, item, i);
            return true;
          } catch (ex) {
            exception = ex;
            return false;
          } // end try
        }); // end type some

        if (!atLeastOneValid) {
          throw exception || new Exception(`Different type at index position ${i}`, "validateArgumentsTypes");
        } // end if not is valid
      } else {
        validateType(value, type, i);
      } // end if is array
    } // end for each entry

    // if we reach here, everything is fine
    return true;
  }; // end validateArgumentsTypes function

  /**
   * Function to validate the quantity of arguments
   *
   * @param {array} argumentsToValidate The arguments in the function
   * @param {int} quantity The quantity of arguments expected
   *
   * @return {undefined}
   */
  const validateArgumentsNumber = (argumentsToValidate, quantity) => {
    if (argumentsToValidate.length !== quantity) {
      throw new Error(`Expected ${quantity} arguments, but got ${argumentsToValidate.length}.`);
    }
  };

  /**
   * Validates arguments number and types
   *
   * @param {array} argumentsToValidate The arguments to validate
   * @param {number} number The number of arguments
   * @param {array} types The types to validate against _args
   *
   * @return {undefined}
   */
  const args = (argumentsToValidate, number, types) => {
    validateArgumentsNumber(argumentsToValidate, number);
    validateArgumentsTypes(argumentsToValidate, types);
  }; // end function args

  /**
   * The validations queue
   */
  let queue = [];

  /**
   * Adds an object and its rules to the validations queue
   *
   * @param {object} obj The object to validate
   * @param {array} rules The rules to apply
   * @param {string} message The error message to display
   *
   * @return {Validations}
   */
  const add = (obj, options, message) => {
    queue.push([obj, options, message]);
    return self;
  }; // end function add

  /**
   * Returns true if fn is a function
   *
   * @param {object} fn The object to validate if it's a function
   *
   * @return {bool}
   */
  const isFunction = fn => typeof fn === "function";

  /**
   * Execute all validations in the queue
   *
   * @return {bool}
   */
  const executeValidations = () => {
    if (queue.length === 0) {
      return true;
    } // end if queue count 0

    // loop the queue
    queue.forEach(item => {
        
        const [val, rules, message] = item;

        if (isFunction(rules)) {
          rules = [rules];
        } // end if isFunction

        rules.forEach(rule => rule(val, message));
      } // end forEach anonymous function
    ); // end forEach

    queue = [];
    return true;
  }; // end function validate

  const isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return !emailRegex.test(email);
  }

  const REQUIRED = (obj, message) => {
    if (obj === null || typeof obj == "undefined") {
      queue = [];

      if (typeof message == "undefined") {
        message = String(obj) + " is required";
      } // end if message

      throw new Exception(message, "Validations.REQUIRED");
    } // end if null

    return true;
  };

  const NONEMPTY = (obj, message) => {
    if (obj == "" || obj === null || typeof obj == "undefined" ) {
      queue = [];

      if (typeof message == "undefined") {
        message = String(obj) + " is empty";
      } // end if message

      throw new Exception(message, "Validations.NONEMPTY");
    } // end if empty
    return true;
  }; // end function NONEMPTY

  const NUMERIC = (obj, message) => {
    if (!Math.isNumeric(obj)) {
      queue = [];

      if (typeof message == "undefined") {
        message = String(obj) + " is not numeric";
      } // end if message

      throw new Exception(message, "Validations.NUMERIC");
    } // end if not numeric
    return true;
  }; // end function NUMERIC

  const INTEGER = (obj, message) => {
    if (!Number.isInteger(obj)) {
      queue = [];

      if (typeof message == "undefined") {
        message = String(obj) + " is not integer";
      } // end if message

      throw new Exception(message, "Validations.INTEGER");
    } // end if not numeric
    return true;
  }; // end function INTEGER

  const EMAIL = (obj, message) => {
    
    if (RS.Validations.isValidEmail(email)) {
      return true;
    }
  
    // Clear the validations queue
    queue = [];
  
    // in case we do not provide a message
    if (typeof message == "undefined") {
      message = `${obj} is not a valid email address`;
    }
  
    //  throw the exception
    throw new RS.Exception(message, "Validations.EMAIL");
  }; // end email function

  const IS_DATE = (obj, message) => {
    if (!(obj instanceof Date)) {
      queue = [];

      if (typeof message == "undefined") {
        message = String(obj) + " is not a date";
      } // end if message

      throw new Exception(message, "Validations.IS_DATE");
    } // end if not numeric
    return true;
  }; // end function IS_DATE

  //  return the public functions
  return {
    args, add, isFunction, executeValidations, isValidEmail,
    RULES_FUNCTIONS: {
      REQUIRED, NONEMPTY, NUMERIC, INTEGER, EMAIL, IS_DATE
    } // end return RULES_FUNCTIONS
  } // end return
} // end function RS.Validations

