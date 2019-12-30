/**
 * This function observs an object
 * and react accordingly
 *
 * @param next The function to trigger on detecting a value
 * @param error The function to trigger on error
 * @param complete The function to trigger on completion
 *
 * @return null
 **/
RS.Observer = function (
  next,
  error = null,
  complete = null
) {

  var self = this;

  self.isCompleted = false;
  self.isSubscribed = true;

  if (!next) {
    throw new Exception('RealSimpleJS.Observer: First argument must be present');
  } // end if not next

  if (typeof next === 'object') {
    if (
      next.hasOwnProperty("next") &&
      next.hasOwnProperty("error") &&
      next.hasOwnProperty("complete")
    ) {
      error = next.error;
      complete = next.complete;
      next = next.next;
    } // end if object and has properties
  } // end if next if object

  /**
   * Triggers the function that handles the result
   *
   * @param value The value to pass to the 'next' function
   *
   * @return null
   */
  self.next = function (value) {

    if (self.isCompleted) {
      console.info('INFO: RealSimpleJS.Observer: Observable already completed');
      return;
    } // end if is completed

    if (!self.isSubscribed) {
      console.info('INFO: RealSimpleJS.Observer: Not subscribed anymore');
      return;
    } // end if is completed

    // triggers the next function
    next(value);

  }; // end function next

  /**
   * Validates states and trigger error
   * Then, unsubscribes the observer
   *
   * @param err The error to show
   *
   * @return null
   */
  self.error = function(err) {

    if (self.isCompleted) {
      console.info('INFO: RealSimpleJS.Observer: Observable already completed');
      return;
    } // end if is completed

    if (!self.isSubscribed) {
      console.info('INFO: RealSimpleJS.Observer: Not subscribed anymore');
      return;
    } // end if is completed

    if (error) {
      error(err);
      self.unsubscribe();
    } // end if error
  }; // end function error

  /**
   * Validates states and trigger on complete function, if exists
   * Then, unsubscribes the observer
   *
   * @return null
   */
  self.complete = function() {

    if (self.isCompleted) {
      console.info('INFO: RealSimpleJS.Observer: Observable already completed');
      return;
    } // end if is completed

    if (!self.isSubscribed) {
      console.info('INFO: RealSimpleJS.Observer: Not subscribed anymore');
      return;
    } // end if is completed

    if (complete) {

      //  Calls complete function
      complete();

      //  Mark this as completed
      self.isCompleted = true;

      //  Calls unsubscribe
      self.unsubscribe();
    } // end if error
  }; // end function error

  /**
   * Unsubscribes from the observer
   *
   * @return null
   */
  self.unsubscribe = function () {

    //  Mark this as unsubscribed
    self.isSubscribed = false;

    // Here's the observer pattern magic
    // If there's a function entitled '_unsubscribe', call it
    if (self._unsubscribe) {

      //  We havent defined this function, is dynamic
      //  Observable implementation will handle this
      //  This is the function that will initialize the Observable
      //  receives an observer as argument, so the observable can be,
      //  well, observable

      //  Call _unsubscribe
      self._unsubscribe();
    } // end if the observer has a _unsubscribe function
  }; // end function unsubscribe
} // end function observer
