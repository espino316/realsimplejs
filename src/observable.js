/**
 * This function will instantiate an Observable object
 *
 * @param subscribe It's a function that subscribes to the observable
 *
 * @return null
 */
RS.Observable = function ( subscribe ) {

  //  A variable to represent the object across the function
  var self = this;

  //  Here we store the subscribable function in the object
  self._subscribe = subscribe;

  // Here we expose the 'subscribe' function

  /**
   * Receives an observable set of functions || object
   */
  self.subscribe = function(
    next,
    error = null,
    complete = null
  ) {

    // Here we create and observer
    var observer = new Observer(next, error, complete);

    // Here's the magic:
    // The _unsubscribe function of the observer
    // will be the initial, for implementing, subscribe function,
    // that receives the very same observer as an argument
    observer._unsubscribe = self._subscribe(observer);

    // Return and object with an unsubscribe function
    // that calls the unsubscribe from the observer
    return ({
      unsubscribe: function() {
        observer.unsubscribe();
      } // end unsubscribe
    }); // end return
  }; // end function subscribe

  /**
   * Applies a transform function to any item in the observable source
   *
   * @param transformaFunction The function transformation to apply to the values
   *
   * @return Observable
   */
  self.map = function (transformFunction) {

    //  Return an Observable
    return new Observable(

      //  Here we declare an anomymous function
      function (observer) {

        //  Here we create a subscriptor
        var sub = self.subscribe(

          //  Here we define the handler to apply the transformation
          function (value) {
            observer.next(
              transformFunction (value)
            ); // end function observer.next
          }, // end next
          //  Here we setup the error handler, relying to Biology awards
          function (err) {
            observer.error(err);
          }, // end error
          //  Here we trigger the complete function
          function () {
            observer.complete();
          } // end complete
        ); // end function self.subscribe

        return sub.unsubscribe;
      } // end anonymous subscribe function
    ); // end function Observable
  }; // end function map

} // end function

//  Here we declare an static 'of' function

RS.Observable.of = function () {

  var args = arguments;

  return new Observable(
    function (observer) {

      // Loop through the arguments
      for (let arg of args) {

        //  Call the next function
        observer.next(arg);
      } // end for each argument

      //  Call complete
      observer.complete();

      //  Return a function, the unsubscribe return a function
      return function() {
        console.log( 'Observable from: unsubscribe' );
      }; // end return function on unsubscribe
    } // end anonymous subscribe function
  ); // end return new observable
}; // end static function of

//  Here we declare an static 'from' function

/**
 * Takes an array of object to emit
 *
 * @param values The array of values
 *
 * @return Observable
 */
RS.Observable.from = function (values) {

  //  The observable takes a subscribable function
  //  that receives and observer
  return new Observable(function (observer) {

    //  Loop through the values
    for (let value of values) {

      //  Call next function
      observer.next(value);
    } // end for each

    //  Call complete function
    observer.complete();

    //  The anonymous subcribe frunction returns a function with a message
    return function() {
      console.log( 'Observable from: unsubscribed' );
    }; // end return
  }); // end return
}; // end function from


/**
 * Creates an observable for a element event
 *
 * @param element The element to listen
 * @param eventName The name of the event to listen
 *
 * @return Observable
 */
RS.Observable.fromEvent = function ( element, eventName ) {

  //  return a new observable
  return new Observable(

    // subscribe function
    function ( observer ) {

      //  This is the function to handle the event
      //  when receiving it from the element
      var eventHandler = function ( event ) {

        // The only thing we do is to call next, with the event
        // as value
        observer.next( event );
      }; // end function even handler

      // Here we listen to the element event
      element.addEventListener(
        eventName,
        eventHandler,
        false
      ); // end add event listener

      // Then, return a function that removes the event listener
      return function() {
        element.removeEventListener(
          eventName,
          eventHandler,
          false
        ); // end function remove event listener

        console.log('Observable.fromEvent: Unsubscribe');
      } // end return function
    } // end subscribe function
  ); // end return new observable
}; // end function from event
