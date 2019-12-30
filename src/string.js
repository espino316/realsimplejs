RS.String = function() {

  var self = this;

  //  Needed for escaping HTML
  var hiddenEscapeTextArea = document.createElement("textarea");

  self.UUID = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }; // end function UUID
}

String.prototype.escapeHTML = function() {
  var self = this;
  if (typeof hiddenEscapeTextArea == "undefined") {
    var hiddenEscapeTextArea = document.createElement("textarea");
  }
  hiddenEscapeTextArea.textContent = self;
  return hiddenEscapeTextArea.innerHTML;
}; // end function escapeHTML

String.prototype.unescapeHTML = function() {
  var self = this;
  if (typeof hiddenEscapeTextArea == "undefined") {
    var hiddenEscapeTextArea = document.createElement("textarea");
  }
  hiddenEscapeTextArea.innerHTML = self;
  return hiddenEscapeTextArea.textContent;
}; // end function unescapeHTML

/**
 * Encodifica en formato uri la cadena
 * Uso:
 *  var str = "Esta es una cadena";
 *  str = str.encodeUri();
 *  console.log( str );
 *  // Outputs "Esta%20es%20una%20cadena"
 */
String.prototype.encodeUri = function() {
  return encodeURIComponent(this);
}; // end encodeUri

/**
 * Decodifica la cadena a partir del formato uri
 * Uso:
 *  var str = "Esta%20es%20una%20cadena";
 *  str = str.decodeUri();
 *  console.log( str );
 *  // Outputs "Esta es una cadena";
 */
String.prototype.decodeUri = function() {
  return decodeURIComponent(this);
}; // end decodeUri

String.prototype.base64Encode = function() {
  var self = this;
  self = self.encodeUri();

  var fnReplace = function(match, p1) {
    return String.fromCharCode("0x" + p1);
  };
  self = self.replace(/%([0-9A-F]{2})/g, fnReplace);

  return btoa(self);
}; // end base64Encode

String.prototype.base64Decode = function() {
  var self = this;
  try {
    self = atob(self);
  } catch (ex) {
    console.error("No base 64 data");
    return;
  }

  var fnMap = function(item) {
    return "%" + ("00" + item.charCodeAt(0).toString(16)).slice(-2);
  };

  self = Array.prototype.map.call(self, fnMap);

  self = self.join("");
  self = self.decodeUri();
  return self;
}; // end base64Encode

/**
 * Crea una cadena de expresión regular a partir de la cadena,
 * anteponiendo "\" a los caracteres especiales, "escapando"
 * la cadena
 * Uso:
 *  var str = "Hola!";
 *  str = str.escapeRegExp();
 *  console.log( str );
 *  // Outputs: "Hola\!"
 */
String.prototype.escapeRegExp = function() {
  return this.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}; // end function escapeRegExp

/**
 * Reemplaza todas las instancias de "find" por "replace"
 * en la cadena
 * Uso:
 *  str = "Hola me llamo $nombre, $nombre es mi nombre";
 *  str = str.replaceAll( "$nombre", "Luis" );
 *  console.log( str );
 *  // Outputs: "Hola me llamo Luis, Luis es mi nombre"
 */
String.prototype.replaceAll = function(find, replace) {
  return this.replace(new RegExp(find.escapeRegExp(), "g"), replace);
}; // end function replaceAll

/**
 * Regresa "n" caracteres a la izquierda de la cadena
 * Uso:
 *  var str = "ABCDE";
 *  str = str.left(3);
 *  console.log( str );
 *  // Outputs: "ABC"
 */
String.prototype.left = function(n) {
  if (n <= 0) {
    return "";
  } else if (n > this.length) {
    return this;
  } else {
    return this.substring(0, n);
  }
}; // end function left

/**
 * Devuelve "n" caracteres a la derecha de la cadena
 * Uso:
 *  var str = "ABCDE";
 *  str = str.right(3);
 *  console.log( str );
 *  // Outputs: "CDE"
 */
String.prototype.right = function(n) {
  if (n <= 0) {
    return "";
  } else if (n > this.length) {
    return this;
  } else {
    var iLen = this.length;
    return this.substring(iLen, iLen - n);
  }
}; // end function right

/**
 * Devuelve verdadero si la cadena contiene a "str"
 * Uso:
 *  var str = "Hola mundo!";
 *  var lookFor = "mundo";
 *  var inString = str.contrains(lookFor);
 *  console.log(inString);
 *  // Outputs: true
 */
String.prototype.contains = function(str) {
  return this.indexOf(str) > -1;
}; // end function contains

/**
 * Transforms the string into hexadecimal value
 *
 * @return {String}
 */
String.prototype.toHex = function() {
  var hex = "0x";
  var i;
  for (i = 0; i < this.length; i++) {
    hex += "" + this.charCodeAt(i).toString(16);
  }
  return hex;
}; // end to Hex

/**
 * Convert a hexadecimal to string
 *
 * @return {String}
 */
String.prototype.fromHex = function(hex) {
  hex = hex.toString();
  var str = "";
  var i;
  for (i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  } // end for
  return str;
}; // end from Hex
