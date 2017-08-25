requirejs.config(
  {
    baseUrl: "../src"
  }
);

requirejs(
  ["http"],
  function ( Http ) {
    console.log( Http );

    var http = new Http();
    http.get( "http://jsonplaceholder.typicode.com/posts/1" ).then(
      function( response ) {
        console.log( response.data.title );
      } // end function onResponse
    ); // end then
  } // end anonymous requirejs function
); // end requirejs
