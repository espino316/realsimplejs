var assert = buster.referee.assert;
var refute = buster.referee.refute;

buster.testCase(
  "String.escapesHTML",
  {
    "Escapes HTML from string":
      function() {
        var s = "<a href='#'>Eso es</a>";
        var t = ( s.escapeHTML() == "&lt;a href='#'&gt;Eso es&lt;/a&gt;" );
        assert( t ) ;
      }
  }
);

buster.testCase(
  "String.unescapesHTML",
  {
    "Unescapes HTML from string":
      function() {
        var s = "&lt;a href='#'&gt;Eso es&lt;/a&gt;";
        var t = ( s.unescapeHTML() == "<a href='#'>Eso es</a>" );
        assert( t ) ;
      }
  }
);

buster.testCase(
  "String.encodeUri",
  {
    "URI Encode a string":
      function() {
        var s = "Esta es una cadena";
        var t = ( s.encodeUri() == "Esta%20es%20una%20cadena" );
        assert( t ) ;
      }
  }
);

buster.testCase(
  "String.decodeUri",
  {
    "URI decode a string":
      function() {
        var s = "Esta%20es%20una%20cadena";
        var t = ( s.decodeUri() == "Esta es una cadena" );
        assert( t ) ;
      }
  }
);

buster.testCase(
  "String.base64Encode",
  {
    "Encode string into base64":
      function() {
        var s = "Esta es una cadena";
        var t = ( s.base64Encode() == "RXN0YSBlcyB1bmEgY2FkZW5h" );
        assert( t ) ;
      }
  }
);

buster.testCase(
  "String.base64Decode",
  {
    "Decode a string from base64":
      function() {
        var s = "RXN0YSBlcyB1bmEgY2FkZW5h";
        var t = ( s.base64Decode() == "Esta es una cadena" );
        assert( t ) ;
      }
  }
);
