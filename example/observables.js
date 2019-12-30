const clicks$ = Observable.fromEvent(button, 'click');
const subscription = clicks$.subscribe({
  next(value) { console.log('clicked'); },
  error(err) { console.error(err); },
  complete() { console.info('done'); }
});
setTimeout(subscription.unsubscribe, 1500);

var numbers = Observable.from([1,2,3,4]);
var subscription
  = numbers.subscribe(
    value => { console.log( value ); },
    err => { console.error( err ); },
    () => { console.info( 'Donezo' ); }
  ); // end subscribe

// At 500 ms, unsubscribe
setTimeout(
  subscription.unsubscribe,
  500
); // end setTimeout
