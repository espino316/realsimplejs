RS.Subject = function () {

  var self = this;

  self.subscriptions = [];
  self.isCompleted = false;

  self.subscribe = function (
    next,
    error,
    complete
  ) {

    if (typeof error == 'undefined') { error = null }
    if (typeof complete == 'undefined') { complete = null }

    self.subscriptions.push({
      next: next, error: error, complete: complete
    });
  }; // end subscribe

  self.next = function (value) {

    if (self.isCompleted) {
      return;
    } // end if self is completed

    RS.forEach(
      self.subscriptions,
      function (subscription) {
        try {
          subscription.next(value);
        } catch (err) {
          subscription.error(err);
        } // end try catch
      } // end anonymous subscriptions
    ); // end for each
  }; // end self.next

  self.complete = function() {

    RS.forEach(
      self.subscriptions,
      function ( subscription ) {
        try {
          if (subscription.complete) {
            subscription.complete();
          } // end if subscription.complete
        } catch (err) {
          subscription.error(err);
        } // end try catch
      } // end anonymous function
    ); // end for each

    self.isCompleted = true;
  }; // end function complete
} // end function RS.Subject
