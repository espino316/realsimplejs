'use strict';

test(
  'HTML test',
  function () {
    document.body.innerHTML = '<div><span id="testSpan" /></div>';
    document.getElementById("testSpan").innerText = "My Name";
    expect(document.getElementById("testSpan").innerText).toEqual("My Name");
  } // end anomymous function
); // end test
