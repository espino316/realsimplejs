RS.Subject = function () {

  var self = this;

  self.subscriptions = [];
  self.isCompleted = false;

  self.subscribe = function (
    next,
    error = null,
    complete = null
  ) {
    self.subscriptions.push({
      next, error, complete
    });
  }; // end subscribe

  self.next = function (value) {

    if (self.isCompleted) {
      return;
    } // end if self is completed

    for (let subscription of self.subscriptions) {
      try {
        subscription.next(value);
      } catch (err) {
        subscription.error(err);
      } // end try catch
    } // end for each subscription
  }; // end self.next

  self.complete = function() {
    for (let subscription of self.subscriptions) {
      try {
        if (subscription.complete) {
          subscription.complete();
        } // end if subscription.complete
      } catch (err) {
        subscription.error(err);
      } // end try catch
    } // end for each subscription

    self.isCompleted = true;
  }; // end function complete
} // end function RSSubject

function RsObservable(observer) {

  var self = this;
  self.suscriptions = [];

  self.subscribe = function(
    next,
    error = null,
    completed = null
  ) {
    self.subscriptions.push({
      next, error, completed
    });
  }; // end subscribe

} // end RSObserbable

