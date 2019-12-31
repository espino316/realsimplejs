(function() {
  //  The possible states of the promise
  var States = {
    PENDING: "pending",
    FULLFILED: "fullfiled",
    REJECTED: "rejected",
    validate: function( state ) {
      return (
        state == "pending" ||
        state == "fullfiled" ||
        state == "rejected"
      );
    } // end isValid
  }; // end States

  /**
   * Return true if obj is RSPromise
   *
   * @param {mixed} obj The object to check
   *
   * @return {bool}
   */
  var isRSPromise = function( obj ) {
    if ( typeof obj == "undefined" ) {
      return false;
    } // end if undefined
    return ( obj.constructor === self.constructor );
  }; // end function

  /**
   * Executes asynchronously
   *
   * @param {function} fn The function to execute
   *
   * @return {undefined}
   */
  var setImmediate = function( fn ) {
    setTimeout( fn, 0 );
  }; // end async

  /**
   * Sets a state for a promise
   *
   * @param {RSPromise} promise The promise to set the state for
   * @param {State} state The state to set for the promise
   * @param {mixed} val The value to set up
   *
   * @return {undefined}
   */
  var setState = function( promise, state, val ) {

    if ( promise.state !== States.PENDING  ) {
      return;
    } // end if PENDING

    if ( promise.state === state ) {
      return;
    } // end same state

    if ( ! States.validate( state ) ) {
      return;
    } // end if valid

    promise.state = state;
    promise.value = val;

    if ( promise.state === States.REJECTED ) {
      console.error( promise.value );
    } // end if rejected
    promise.processQueue();
  }; // end function setState

  /**
   * Promise A+ implementation
   *
   * @param {function} functionPromise The promise function
   *
   * @return {undefined}
   */
  RS.Promise = function( functionPromise ) {
    // To self reference
    var self = this;

    //  The promise queue
    self.promiseQueue = [];

    //  Function to perform on fullfiled
    self.onFullfilled = null;

    //  Function to perform on rejected
    self.onRejected = null;

    //  PENDING by default
    self.state = States.PENDING;

    //  Initialize value in null
    self.value = null;

    /**
     * Creates and return a promise
     *
     * @param {function} onFullfiled The function to run on fullfiled
     * @param {function} onReject The function to run on rejected
     *
     * @return {RSPromise}
     */
    self.then = function( onFullfilled, onRejected ) {
      var promiseToQueue
        = new RSPromise();

      if ( typeof onFullfilled != "undefined" ) {
        promiseToQueue.onFullfilled = onFullfilled;
      } // end if onFullfiled defined

      if ( typeof onReject != "undefined" ) {
        promiseToQueue.onRejected = onRejected;
      } // end if onFullfiled defined

      self.promiseQueue.push( promiseToQueue );
      self.processQueue();
      return promiseToQueue;
    }; // end function then

    //  The backfall functions
    //
    //  Backfall for fullfilled
    var fulfillBackfall = function( val ) {
      return val;
    }; // enf function fulfillBackfall

    //  Backfall for rejection
    var rejectBackfall = function ( err ) {
      throw err;
    };

    /**
     * Loops through the queue processing the promises
     */
    var loopQueue = function () {
      while( self.promiseQueue.length > 0 ) {
        var currentPromise = self.promiseQueue.shift();
        var promiseHandler = fulfillBackfall;

        if ( self.state == States.FULLFILED ) {
          if ( currentPromise.onFulfilled !== null ) {
            promiseHandler = currentPromise.onFullfilled;
          } // end if onFullfill not null
        } // end if State is FULLFILLED

        if ( self.state == States.REJECTED ) {
          promiseHandler = rejectBackfall;
          if ( currentPromise.onRejected !== null ) {
            promiseHandler = currentPromise.onRejected;
          } // end if onRejected not null
        } // end if REJECTED

        //  The value to process the function resolve
        var returnedValue = null;

        try {
          returnedValue = promiseHandler( self.value );
        } catch ( ex ) {
          setState( currentPromise, States.Rejected, ex );
          continue;
        } // end try catch

        resolve( currentPromise, returnedValue );

      } // end while
    }; // end function loopQueue

    /**
     * Process the queue of promises
     */
    self.processQueue = function() {
      // Still PENDING, do nothing
      if ( self.state == States.PENDING ) {
        return;
      } // end if pending

      //  Set asynchronous immediate execution of loopQueue
      setImmediate( loopQueue );
    }; // end function processQueue

    /**
     * This will resolve a promise
     *
     * @param {RSPromise} promise The promise to resolve
     * @param {mixed} value The value to resolve the promise
     *
     * @return {undefined}
     */
    var resolve = function( promise, value ) {
      if ( promise === value ) {
        setState( promise, States.REJECTED, new TypeError( "Promise and value are the same" ) );
        return;
      } // end if promise is value

      if ( isRSPromise( value ) ) {
        if ( value.state === States.PENDING ) {
          value.then(
            function( val ) {
              resolve( promise, val );
            }, // end onFullfiled
            function ( err ) {
              setState( promise, States.REJECTED, err );
            } // end onRejected
          ); // end then
          return;
        } // end if PENDING

        //  If Promise and not PENDING
        setState( promise, value.state, value.value );
        return;
      } // end if value isRSPromise

      //  If object or function but not thenable
      if ( typeof value == "object" || typeof value == "function" ) {
        var thenHandler = null;
        try {
          thenHandler = value.then;
        } catch ( ex ) {
          setState( promise, States.REJECTED, ex );
        } // end try catch

        // if value.then is function
        if ( typeof thenHandler == "function" ) {
          var isCalled = false;
          try {
            value.then.call(
              value,
              function ( y ) {
                if ( ! isCalled ) {
                  resolve( promise, y );
                  isCalled = true;
                } // end if not called
              }, // end onFulfilled
              function ( r ) {
                if ( ! isCalled ) {
                  setState( promise, States.REJECTED, r );
                  isCalled = true;
                } // end if not is called
              } // end onRejected
            ); // end value then call
          } catch ( ex ) {
            if ( ! isCalled ) {
              setState( promise, States.REJECT, ex );
            } // end if not isCalled
          } // end try catch
          return;
        } // end if thenHandler is function

        //  Fullfil the promise
        setState( promise, States.FULLFILED, value );
        return;
      } // end if value object or function

      //  Fullfil the promise
      setState( promise, States.FULLFILED, value );
      return;
    }; // end function resolve

    //  If argument is defined
    if ( functionPromise ) {
      functionPromise(
        function( value ) {
          resolve( self, value );
        }, // end onResolve
        function( error ) {
          setState( self, States.REJECTED, error );
        } // end onError
      ); // end functionPromise call
    } // end if functionPromise
  } // end RSPromise
})();
