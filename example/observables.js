
var s = new RS.Subject();
s.subscribe(
  v => {
    console.log(v);
  },
  e => {
    console.error(e);
  },
  () => {
    console.log("completed 1");
  }
);
s.subscribe(
  v => {
    console.log(v);
  },
  e => {
    console.error(e);
  },
  () => {
    console.log("completed 2");
  }
);

s.next("some");
s.next("dude");
s.complete();

var clicks$ = RS.Observable.fromEvent(button, 'click');
var subscription = clicks$.subscribe({
  next(value) { console.log('clicked'); },
  error(err) { console.error(err); },
  complete() { console.info('done'); }
});
setTimeout(subscription.unsubscribe, 1500);

var numbers = RS.Observable.from([1,2,3,4]);
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
