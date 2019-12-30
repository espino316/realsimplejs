require('../../release/realsimple.js');

test(
  "String.escapesHTML",
  function() {
    var s = "<a href='#'>Eso es</a>";
    var t = ( s.escapeHTML() == "&lt;a href='#'&gt;Eso es&lt;/a&gt;" );
    expect( t ).toBeTruthy();
  }
);

test(
  "String.unescapesHTML",
  function() {
    var s = "&lt;a href='#'&gt;Eso es&lt;/a&gt;";
    var t = ( s.unescapeHTML() == "<a href='#'>Eso es</a>" );
    expect( t ).toBeTruthy();
  }
);

test(
  "String.encodeUri",
  function() {
    var s = "Esta es una cadena";
    var t = ( s.encodeUri() == "Esta%20es%20una%20cadena" );
    expect( t ).toBeTruthy();
  }
);

test(
  "String.decodeUri",
  function() {
    var s = "Esta%20es%20una%20cadena";
    var t = ( s.decodeUri() == "Esta es una cadena" );
    expect( t ).toBeTruthy();
  }
);

test(
  "String.base64Encode",
  function() {
    var s = "Esta es una cadena";
    var t = ( s.base64Encode() == "RXN0YSBlcyB1bmEgY2FkZW5h" );
    expect( t ).toBeTruthy();
  }
);

test(
  "String.base64Decode",
    function() {
      var s = "RXN0YSBlcyB1bmEgY2FkZW5h";
      var t = ( s.base64Decode() == "Esta es una cadena" );
      expect( t ).toBeTruthy();
    }
);
