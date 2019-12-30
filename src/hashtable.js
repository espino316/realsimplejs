RS.KeyValuePair = function (key, value) {
  var self = this;
  self.key = key;
  self.value = value;
} // end function KeyValuePair

RS.Hashtable = function() {
  var self = this;
  var table = [];

  var hashFunction = function(key) {
    var len = key.length;
    var chars = key.split("");
    var number = 0;
    chars.forEach(
      function(c) {
        number += c.charCodeAt(0);
      } // end anonymous function
    ); // end chars for each

    number = Math.ceil(number/len);
    return number;
  }; // end function hashFunction

  self.insert = function( key, value ) {
    var hash = hashFunction(key);
    table.push(hash);
  }; // end function insert
} // end function Hashtable
