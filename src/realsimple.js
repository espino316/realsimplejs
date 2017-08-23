(function() {
  "use strict";
  function CssRule(ruleName) {
    this.ruleName = ruleName;
    this.properties = {};
  }

  CssRule.prototype.ruleName = "";

  CssRule.prototype.addProperty = function(propertyName, propertyValue) {
    var self = this;
    self.properties[propertyName] = propertyValue;
  };

  CssRule.prototype.toString = function() {
    var css = "." + this.ruleName + " {\n";
    var keys = Object.keys(this.properties);
    var len = keys.length;
    var i = 0;
    for (i = 0; i < len; i++) {
      css += keys[i] + ": " + this.properties[keys[i]] + ";";
      css += "\n";
    }
    css += "}";
    return css;
  };

  function CssAnimation(name) {
    this.name = name;
    this.from = new CssRule("from");
    this.to = new CssRule("to");
  }

  CssAnimation.prototype.name = "";
  CssAnimation.prototype.from = null;
  CssAnimation.prototype.to = null;

  CssAnimation.prototype.toString = function() {
    var css = "@keyframes " + this.name + " {\n@from\n@to\n}";
    var cssFrom = this.from.toString();
    var cssTo = this.to.toString();
    cssFrom = cssFrom.replace(".from", "from");
    cssTo = cssTo.replace(".to", "to");
    css = css.replace("@from", cssFrom);
    css = css.replace("@to", cssTo);

    var wkcss = "@-webkit-keyframes " + this.name + " {\n@from\n@to\n}";
    wkcss = wkcss.replace("@from", cssFrom);
    wkcss = wkcss.replace("@to", cssTo);

    return css + "\n" + wkcss;
  };

  function CssStyle() {}

  CssStyle.prototype.classes = [];
  CssStyle.prototype.addClass = function(cssClass) {
    this.classes.push(cssClass);
  };
  CssStyle.prototype.toString = function() {
    var len = this.classes.length;
    var i;
    var css = "";
    for (i = 0; i < len; i++) {
      css += this.classes[i].toString() + "\n\n";
    }
    return css;
  };

  CssStyle.prototype.setStyle = function() {
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = this.toString();
    document.getElementsByTagName("head")[0].appendChild(style);
  };

  /* Overrides */
  /*
(function(){
    var oldLog = console.log;
    console.log = function (message) {
        // DO MESSAGE HERE.
        oldLog.apply(console, arguments);
    };
})();
*/

  if (!Date.now) {
    Date.now = function() {
      return new Date().getTime();
    };
  }

  JSON.tryParse = function(str, out) {
    try {
      out.data = JSON.parse(str);
      return true;
    } catch (ex) {
      return false;
    } // end try catch
  }; // end JSON.tryParse

  //  Needed for escaping HTML
  var hiddenEscapeTextArea = document.createElement("textarea");

  String.prototype.UUID = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }; // end function UUID

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

  HTMLElement.prototype.hide = function() {
    this.style.display = "none";
  }; // end HTML element hide

  HTMLElement.prototype.show = function() {
    this.style.display = "block";
  }; // end HTML element hide

  HTMLElement.prototype.hasClass = function(className) {
    var rgx = new RegExp("(\\s|^)" + className + "(\\s|$)");
    var match = this.className.match(rgx);
    return match !== null;
  };

  HTMLElement.prototype.addClass = function(className) {
    if (!this.hasClass(className)) {
      this.className += " " + className;
    }
  };

  HTMLElement.prototype.removeClass = function(className) {
    if (this.hasClass(className)) {
      var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
      this.className = this.className.replace(reg, " ");
    }
  };

  HTMLElement.prototype.addText = function(text) {
    var t = document.createTextNode(text); // Create a text node
    this.appendChild(t);
  }; // end function addText

  HTMLElement.prototype.clear = function() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }; // end function clear

  HTMLElement.prototype.animate = function(options) {
    var element = this;
    var style = new CssStyle();
    var animateClass = new CssRule("animateclass" + options.name);
    animateClass.addProperty("-webkit-animation-name", options.name);
    animateClass.addProperty("-webkit-animation-duration", options.duration);
    animateClass.addProperty("animation-name", options.name);
    animateClass.addProperty("animation-duration", options.duration);
    animateClass.addProperty("animation-fill-mode", "forwards");
    animateClass.addProperty("-webkit-animation-fill-mode", "forwards");
    style.addClass(animateClass);
    var animateFrames = new CssAnimation(options.name);
    var keys = Object.keys(options.from);
    var i = 0;
    for (i = 0; i < keys.length; i++) {
      animateFrames.from.addProperty(keys[i], options.from[keys[i]]);
    } // end for
    keys = Object.keys(options.to);
    i = 0;
    for (i = 0; i < keys.length; i++) {
      animateFrames.to.addProperty(keys[i], options.to[keys[i]]);
    } // end for
    style.addClass(animateFrames);
    style.setStyle();
    element.removeClass(animateClass.className);
    void element.offsetWidth;
    element.addClass(animateClass.className);
  }; // end animate

  Math.isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }; // end function isNumeric

  Array.prototype.getUnique = function() {
    var u = {}, a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
      if (u.hasOwnProperty(this[i])) {
        continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
    }
    return a;
  };

  Array.prototype.encodeUri = function() {
    var str = JSON.stringify(this);
    return encodeURIComponent(str);
  }; // end Object encodeUri

  Array.prototype.where = function(item, value) {
    var self = this;
    var result = [];
    var fn = function(obj, index, arr) {
      if (obj[item] == value) {
        result.push(obj);
      } // end if value
    }; // end function fn

    self.forEach(fn);
    return result;
  }; // end function where

  Array.prototype.andWhere = function(item, value) {
    var self = this;
    var result = [];
    var fn = function(obj, index, arr) {
      if (obj[item] == value) {
        result.push(obj);
      } // end if value
    }; // end function fn

    self.forEach(fn);
    return result;
  }; // end function where

  Array.prototype.first = function() {
    return this[0];
  }; // end function first

  Array.prototype.like = function(item, value) {
    var self = this;
    var result = [];
    var fn = function(obj, index, arr) {
      if (String(obj[item]).contains(value)) {
        result.push(obj);
      } // end if value
    }; // end function fn

    self.forEach(fn);
    return result;
  }; // end function where

  Array.prototype.andLike = function(item, value) {
    var self = this;
    var result = [];
    var fn = function(obj, index, arr) {
      if (String(obj[item]).contains(value)) {
        result.push(obj);
      } // end if value
    }; // end function fn

    self.forEach(fn);
    return result;
  }; // end function where

  Array.prototype.indexOf = function(item, value) {
    var self = this;
    var result = -1;
    var fn = function(elem, index, arr) {
      if (elem[item] == value) {
        result = index;
      } // end if value
    }; // end function fn

    self.forEach(fn);
    return result;
  }; // end function where

  Array.prototype.contains = function(value) {
    var self = this;
    var result = false;
    var fn = function(elem, index, self) {
      if (elem == value) {
        result = true;
      } // end if value
    }; // end function fn

    self.forEach(fn);
    return result;
  }; // end function where

  /**
 * The function expects parameters index and value
 * Usage:
	 var arr = ["a", "b", "c"];
	 var fn = function ( i, val ) {
		 console.log(i + " => " + val);
	 };
	 arr.forEach( fn );
 */
  if (typeof Array.prototype.forEach == "undefined") {
    var self = this;
    Array.prototype.forEach = function(fn) {
      var i;
      var len;
      len = self.length;

      for (i = 0; i < len; i++) {
        fn(self[i], i, self);
      } // end for
    }; // end Array.forEach
  } // end if Array forEach undefined

  /**
   * Sorts an array of objects by propery, ascending
   *
   * @param {String} property
   *
   * @return Array
   */
  Array.prototype.sortAsc = function(property) {
    var self = this;

    if (self.length === 0) {
      console.warn("No data to sort", self, property);
      return;
    } // end if length 0

    var row = self[0];

    if (typeof row[property] == "undefined") {
      console.error(property + " no part of object.", self);
    } // end if property undefined

    //  Stores the filter in a global variable
    window.__tempFilter = property;

    /**
     * Gets the value, if is numeric, return number data
     */
    var getValue = function(v) {
      if (Math.isNumeric(v)) {
        return v * 1;
      } // end if isNumeric
      return v;
    }; // end function getValue

    var compareAscNumber = function(a, b) {
      var filter = window.__tempFilter;
      var _a = a[filter];
      var _b = b[filter];
      var _c = getValue(_a) - getValue(_b);
      return _c;
    }; // end function compareAscNumber

    var compareAsc = function(a, b) {
      var filter = window.__tempFilter;
      var _a = a[filter];
      var _b = b[filter];
      var _c = _a.localeCompare(_b);
      return _c;
    }; // end function compareAsc

    //  If not numeric, sort by key
    if (Math.isNumeric(row[property])) {
      return self.sort(compareAscNumber);
    } else {
      return self.sort(compareAsc);
    } // end if not is numeric
  }; // end function Array Sort Asc

  /**
   * Sorts an array of objects by propery, descending
   *
   * @param {String} property
   *
   * @return Array
   */
  Array.prototype.sortDesc = function(property) {
    var self = this;

    if (self.length === 0) {
      console.warn("No data to sort", self, property);
      return;
    } // end if length 0

    var row = self[0];

    if (typeof row[property] == "undefined") {
      console.error(property + " no part of object.", self);
    } // end if property undefined

    window.__tempFilter = property;

    var getValue = function(v) {
      if (Math.isNumeric(v)) {
        return v * 1;
      }
      return v;
    }; // end function getValue

    var compareDescNumber = function(a, b) {
      var filter = window.__tempFilter;
      var _a = a[filter];
      var _b = b[filter];
      var _c = getValue(_b) - getValue(_a);
      return _c;
    }; // end function compareDesc

    var compareDesc = function(a, b) {
      var filter = window.__tempFilter;
      var _a = a[filter];
      var _b = b[filter];
      var _c = _b.localeCompare(_a);
      return _c;
    }; // end function compareAsc

    //  If not numeric, sort by key
    if (Math.isNumeric(row[property])) {
      return self.sort(compareDescNumber);
    } else {
      return self.sort(compareDesc);
    } // end if not is numeric
  }; // end function Array Sort Desc

  window.BreakException = {};
  Array.prototype.each = function( fn ) {
    var self = this;
    try {
      var i;
      var len;
      len = self.length;
      for (i = 0; i < len; i++) {
        fn(self[i], i, self);
      } // end for
    } catch (e) {
      if (e !== BreakException) throw e;
    } // end catch
  }; // end forEach

  //*** END PROTOTYPES ***///

  //** PRIVATE VARIABLES *//

  var arrowUp = " " + "&#8679;".unescapeHTML();
  var arrowDown = " " + "&#8681;".unescapeHTML();
  //arrowUp = "";
  //arrowDown = "";

  //** END PRIVATE VARIABLES *//

  function RSObject(obj) {
    if (obj === null) {
      obj = {};
    } // end if obj is null

    var self = this;
    var keys = {};
    var fnEach = function(elem, index, arr) {
      self[elem] = obj[elem];
    };

    if (typeof obj != "undefined") {
      keys = Object.keys(obj);
      keys.forEach(fnEach);
    }

    self.clone = function(from, to) {
      var keys = {};
      var fnEach = function(elem, index, arr) {
        if (typeof from[elem] == "object") {
          to[elem] = {};
          self.clone(from[elem], to[elem]);
        } else {
          to[elem] = from[elem];
        } // end if object
      };
      keys = Object.keys(from);
      keys.forEach(fnEach);
    }; // end function clone

    self.copy = function(to) {
      var keys = {};
      var fnEach = function(elem, index, arr) {
        to[elem] = self[elem];
      };
      keys = Object.keys(self);
      keys.forEach(fnEach);
    }; // end function clone

    self.clear = function() {
      var fnEach = function(value, key, obj) {
        self[key] = null;
      }; // end fnEach

      self.forEach(fnEach);
    };
  } // end function RSObject

  /**
  * The function expects parameters key and value
  * Usage:
 		var fn = function ( k, v ) {
 		 console.log( k + " => " + v );
 		};
 		var obj={"a":"A","b":"B","c":"C"};
 		obj.forEach( fn );
  */
  RSObject.prototype.forEach = function(fn) {
    var self = this;
    var keys = Object.keys(self);
    var i;
    var len = keys.length;

    for (i = 0; i < len; i++) {
      var type = typeof self[keys[i]];
      if (type != "function" && type != "undefined") {
        fn(self[keys[i]], keys[i], self);
      } // end if not function
    } // end for
  }; // end function Object.forEach

  RSObject.prototype.encodeUri = function() {
    var str = JSON.stringify(this);
    return encodeURIComponent(str);
  }; // end Object encodeUri

  RSObject.prototype.decodeUri = function() {
    var str = JSON.stringify(this);
    return decodeURIComponent(str);
  }; // end Object encodeUri

  RSObject.prototype.exists = function(obj) {
    var result = true;
    result = typeof obj != "undefined";
    return result;
  }; // end exists

  RSObject.prototype.isNull = function(obj) {
    return obj === null;
  }; // end is null

  RSObject.prototype.isSet = function isSet(obj) {
    var result = false;
    if (obj) {
      result = true;
      var toStr = Object.prototype.toString.call(obj);
      toStr = toStr.replace("[object ", "");
      toStr = toStr.replace("]", "");
      var len = 1;
      if (toStr == "Object") {
        len = Object.keys(obj).length;
      } else if (toStr == "Array") {
        len = obj.length;
      }
      if (len > 0) {
        result = true;
      } else {
        result = false;
      }
    }
    return result;
  };

  RSObject.prototype.addProperty = function(obj, name, onChange) {
    Object.defineProperty(
      obj,
      name,
      {
        _x: null,
        get: function() {
          return _x;
        }, // end get
        set: function(value) {
          _x = value;
          if (typeof onChange != "undefined") {
            onChange(obj);
          }
        } // end set
      } // end getter setter
    ); // end defineProperty
  }; // end function getProperty

  RSObject.prototype.serialize = function() {
    var result = [];
    var current = "";
    var fn = function(value, key, obj) {
      if (typeof value == "function") {
        return;
      } else if (typeof value == "object") {
        current = key;
        var tmp = new RSObject(value);
        tmp.forEach(fn);
        current = "";
      } else {
        if (current !== "") {
          var item = current + "[" + key + "]=" + value;
          result.push(item);
        } else {
          result.push(key + "=" + value);
        }
      } // end if value is object
    }; // end fn

    this.forEach(fn);
    return result.join("&");
  }; // end function serialize

  function RS() {
    var self = this;
    this.config = null;
    var locationHashBusy = false;
    var storedHash = window.location.hash;

    /**
     * Function assignValue
     * @param bindable The string of the bindable object
     * @param value The value to assign
     */
    this.assignValue = function(bindable, value) {
      if (bindable === null || value === null) {
        return;
      } // end if null

      if (typeof value == "string" && value != "{}" && value != "null") {
        value = "'" + value + "'";
      } // end if string

      var parts = bindable.split(".");
      var code = "";
      if (parts.length > 1) {
        code = "window";
        var fnEach = function(item, index, collection) {
          code += "['" + item + "']";
        }; // end fnEach

        parts.forEach(fnEach);

        code += " = " + value + ";";
      } else {
        code = bindable + " = " + value + ";";
      } // end if parts > 1
      var f = new Function(code);
      f();
    }; // end function assignValue

    /**
     * Returns the value for a expression
     * @param bindable The expression to evaluate
     */
    this.returnValue = function(bindable) {
      var self = this;
      var parts = bindable.split(".");

      if (parts.length > 0) {
        if (self.evalUndefined(parts[0])) {
          return null;
        } else if (self.evalUndefined(bindable)) {
          return null;
        } else {
          var code = "return " + bindable + ";";
          var f = new Function(code);
          return f();
        } // end if then else
      } else if (self.evalUndefined(bindable)) {
        return null;
      } // else if not > 0
    }; // end function returnValue

    /**
     * Evaluates if an expression is undefined
     * @param bindable The expression to evaluate
     */
    this.evalUndefined = function(bindable) {
      var code = "return ( typeof " + bindable + " == 'undefined' );";
      var f = new Function(code);
      return f();
    }; // end function evalUndefined;

    this.defineGetter = function(obj, propName, fnGet) {
      var parts = obj.split(".");
      var code = "";
      if (parts.length > 1) {
        code = "window";
        var fnEach = function(item, index, collection) {
          code += "['" + item + "']";
        }; // end fnEach

        parts.forEach(fnEach);

        code += ".__defineGetter__( propName, fnGet );";
      } else {
        code += "window['" + obj + "'].__defineGetter__( propName, fnGet );";
      } // end if parts > 1
      var f = new Function("propName", "fnGet", code);
      f(propName, fnGet);
    };

    this.defineSetter = function(obj, propName, fnSet) {
      var parts = obj.split(".");
      var code = "";

      if (parts.length > 1) {
        code = "window";
        var fnEach = function(item, index, collection) {
          code += "['" + item + "']";
        }; // end fnEach

        parts.forEach(fnEach);

        code += ".__defineSetter__( propName, fnSet );";
      } else {
        code += "window['" + obj + "'].__defineSetter__( propName, fnSet );";
      } // end if parts > 1
      var f = new Function("propName", "fnSet", code);

      f(propName, fnSet);
    };

    /**
     * Applies foreach to a object or array
     */
    self.forEach = function(obj, fn) {
      var type = typeof obj;
      switch (type) {
        case "object":
          if (typeof obj.length == "number") {
            var i;
            var arr = [];
            for (i = 0; i < obj.length; i++) {
              arr.push(obj[i]);
            } // end for
            arr.forEach(fn);
          } else {
            obj = new RSObject(obj);
            obj.forEach(fn);
          } // end if then else has length
          break;
        case "array":
          obj.forEach(fn);
          break;
        default:
          return null;
      } // end switch
    }; // end function forEach

    self.onReady = function(fn) {
      document.addEventListener(
        "DOMContentLoaded",
        function(event) {
          fn();
        } // end function
      ); // end addEventListener
    }; // end function onReady

    self.removeHash = function() {
      window.location.hash = "";
    }; // end function removeHash

    var manageRoutes = function(locationHash) {
      if (locationHash == "#" || locationHash === "") {
        return;
      } // end if #
      locationHashBusy = true;
      if (self.config.routes !== "undefined" && self.config.routes !== null) {
        locationHash = String(locationHash);
        locationHash = locationHash.replace("#", "");

        var expression = ":[a-zA-Z0-9]+";
        var regParam = new RegExp(expression, "gi");
        var params = null;

        var urlFormat = null;
        var url = null;
        var newUrl = null;

        var fnEach = function(item, key, collection) {
          var tmp = key;
          params = key.match(regParam);
          var fnEachParam = function(str, idx, collection) {
            key = key.replace(str, "[a-zA-Z0-9]+");
          }; // end function fnEachParam

          if (params !== null) {
            params.forEach(fnEachParam);
            var reg = new RegExp(key, "i");
            var match = reg.exec(locationHash);
            if (match !== null) {
              urlFormat = tmp;
              url = locationHash;
              newUrl = item;
              return;
            } // end if
          } else if (key == locationHash) {
            urlFormat = key;
            url = locationHash;
            newUrl = item;
            return;
          } // end if params
        }; // end function fnEach

        var routes = new RSObject(self.config.routes);
        routes.forEach(fnEach);

        if (urlFormat !== null) {
          var segmentsUrlFormat = urlFormat.split("/");
          var segmentsUrl = url.split("/");

          var map = {};
          var fnEach = function(item, index, collection) {
            map[item] = segmentsUrl[index];
          }; // end fnEach

          segmentsUrlFormat.forEach(fnEach);

          fnEach = function(item, index, collection) {
            newUrl = newUrl.replaceAll(item, map[item]);
          }; // end function fnEach

          params = urlFormat.match(regParam);
          if (params !== null) {
            params.forEach(fnEach);
          } // end is params not null
        } else {
          console.warn(locationHash + " no route found.");
          newUrl = locationHash;
        } // end if urlFormat

        //  do route
        var args = newUrl.split("/");
        if (args.length >= 2) {
          var controller = args[0];
          var action = args[1];
          args.splice(0, 2);
          if (typeof window[controller] == "undefined") {
            console.error("Controlador no definido [" + controller + "]");
            locationHashBusy = false;
            return;
          } else if (typeof window[controller][action] == "undefined") {
            console.error(
              "Funcion no definida [" + controller + "." + action + "]"
            );
            locationHashBusy = false;
            return;
          } else {
            window[controller][action].apply(this, args);
            locationHashBusy = false;
            return;
          }
          console.error(
            "La ruta o ubicacion debe tener al menos controlador/funcion"
          );
        } else {
        } // end if then else args len >= 2
      } // end if config.routes
      locationHashBusy = false;
    }; // end function manageRoutes

    var hashChanged = function(locationHash) {
      if (locationHashBusy === false) {
        //  Here goes the routehandler
        manageRoutes(locationHash);
      } // end if not busy
    }; // end function hashChanged

    var hashChangedTick = function() {
      if (window.location.hash != storedHash) {
        storedHash = window.location.hash;
        hashChanged(storedHash);
      } // end if has != storedHash
    }; // end function hashChangedTick

    var setOnHashChange = function() {
      window.setInterval(hashChangedTick, 300);
    }; // end function setOnHashChange

    // loads config.json into config
    this.readConfig = function(configUrl) {
      if (typeof http == "undefined") {
        var http = new Http();
      } // end if http is undefined

      var onSuccess = function(res) {
        var response = res.data;
        if (typeof response == "object") {
          self.config = response;
        } else {
          try {
            var jsonResponse = JSON.parse(response);
            response = jsonResponse;
            self.config = jsonResponse;
          } catch (ex) {
            console.error("Config is not json or is unavailable");
            console.error(response);
            return;
          } // end try catch
        } // end if then else response is object

        //  Set the onhashchange function, if configured
        if (typeof self.config != "undefined") {
          if (typeof self.config.options.useRouting != "undefined") {
            if (self.config.options.useRouting) {
              setOnHashChange();
            } // end if routing
          } // end if useRouting
          if (typeof self.config.options.useMVC != "undefined") {
            if (self.config.options.useMVC) {
              self.bindData();
            } // end is useMVC
          } // end if useMVC undefined
        } // end if self.config undefined
      }; // end onSuccess

      var onError = function(statusText) {
        console.error(statusText);
        alert(statusText);
      }; // end onError

      if (typeof configUrl != "undefined") {
        http.get(configUrl, null, onSuccess, onError);
      } else {
        console.error("Configuration file undefined");
      } // end if configUrl undefined
    }; // end function readConfig
  } // end class rs

  var rs = new RS();
  rs.object = new RSObject();

  /**
   * Watch variables and report changes
   */
  function Watcher() {
    var self = this;
    this.collection = [];

    this.add = function(name, fn) {
      var item = {};
      item.name = name;
      item.currentValue = rs.returnValue(name);
      item.function = fn;
      this.collection.push(item);
    }; // end function add

    // The tick event
    var fn = function() {
      var fnEach = function(item, index, arr) {
        var val = rs.returnValue(item.name);

        if (val != item.currentValue) {
          // And here we reverse dom
          item.function(item.name);
          item.currentValue = val;
        }
      }; // end fnEach
      self.collection.forEach(fnEach);
    }; // end fn

    setInterval(fn, 200);
  } // end function watcher

  // The global variable
  var watcher = new Watcher();

  /*
	::Dialog.js::
	Functions for modal dialogs
	Dependencies
		Cordova
   */
  function Dialog() {
    this.showAlert = function(msg, title, buttonText) {
      if (typeof navigator.notification == "undefined") {
        alert(msg);
      } else {
        navigator.notification.alert(
          msg, // message
          null, // callback: Do nothing, just message
          title, // title
          buttonText // buttonName
        );
      }
    };

    this.showConfirm = function(msg, onConfirm) {
      if (navigator.notification === null) {
        var result = confirm(msg);
        if (result) {
          onConfirm(1);
        } else {
          onConfirm(2);
        }
      } else {
        navigator.notification.confirm(
          msg, // message
          onConfirm, // callback to invoke with index of button pressed
          "Confirmar", // title
          ["Si", "No"] // buttonLabels
        );
      }
    };
  } // end function Dialog

  //	Global instance
  var dlg = new Dialog();

  /*::End::*/

  /**
   * Handles the dom
   */
  function Dom() {
    var self = this;

    var getInput = function(name, value) {
      var input = dom.create("input");
      input.setAttribute( "name", name );
      input.setAttribute( "value", value );
      return input;
    }; // end function getInput

    self.submitForm = function( url, data ) {
      var form = dom.create("form");
      var keys = Object.keys( data );
      keys.forEach(
        function( item, index, collection ) {
          var input = getInput( item, data[item] );
          form.appendChild( input );
        } // end anonymous forEach
      ); // end forEach

      form.setAttribute( "method", "post" );
      form.setAttribute( "action", url );
      document.body.appendChild( form );
      form.submit();
      document.body.removeChild( form );
    }; // end function getForm

    /**
     * Sets an on enter to a element
     *
     * @param {HTMLElement} element The element to add the behavior
     * @param {Function} callback The function to call on enter
     *
     * @return undefined
     */
    self.onEnter = function(element, callback) {
      element.onkeyup = function() {
        var e = event;
        if (e.keyCode == 13) {
          callback();
        } // end if enter
      }; // end onkeyup
    }; // end function onEnter

    self.get = function(selector) {
      var items = document.querySelectorAll(selector);
      if (items.length == 1) {
        return items[0];
      } // end if length 1
      return items;
    };

    self.getAll = function(selector) {
      var items = document.querySelectorAll(selector);
      return items;
    };

    self.getById = function(id) {
      return document.getElementById(id);
    };

    /**
     * Sets the file from computer
     */
    self.getFile = function(input, fn) {
      var result = null;
      if (input.files && input.files[0]) {
        result = {};
        result.name = input.files[0].name;
        result.type = input.files[0].type;
        result.size = input.files[0].size;
        result.inputName = input.name;
        result.data = null;
        var reader = new FileReader();
        reader.onload = function(e) {
          result.data = e.target.result;
          if (typeof fn != "undefined") {
            fn(result);
          } // end if fn not undefined
        };
        reader.readAsDataURL(input.files[0]);
      } // end if inputfiles
      return result;
    }; // end function getFile

    self.getInputsValues = function() {
      var allInputs = document.getElementsByTagName("input");
      var allSelects = document.getElementsByTagName("select");
      var result = {};

      var fn = function(val, i, arr) {
        result[val.id] = val.value;
      };

      var fnSelects = function(val, i, arr) {
        var selectedValue = val.options[val.options.selectedIndex].value;
        result[val.id] = selectedValue;
      };

      allInputs.forEach(fn);
      allSelects.forEach(fn);
      return result;
    };

    self.validateInputs = function() {
      var inputs = self.get("input");
      var isValid = true;
      var msg = "";

      var forEachInput = function(value, index, arr) {
        isValid = isValid && value.checkValidity();
        if (value.checkValidity() === false) {
          var title = value.getAttribute("title");
          if (title !== null) {
            msg += title + "\r\n";
          }
        }
      };

      Array.prototype.forEach.call(inputs, forEachInput);

      if (!isValid) {
        dlg.showAlert(msg, "Error", "Ok");
      } // end if isNotValid
      return isValid;
    }; // end function validateInputs

    self.getSelect = function(name, data, val, text) {
      var sel = document.createElement("select");
      sel.id = name;
      sel.name = name;

      var fn = function(v, i, a) {
        var opt = document.createElement("option");
        opt.value = v[val];
        opt.innerHTML = v[text];
        sel.appendChild(opt);
      };

      data.forEach(fn);
      return sel;
    };

    self.populateSelect = function(select, data, valueField, textField, value) {
      var forEachItem = function(item, key, arr) {
        var option = self.create("option");
        option.value = item[valueField];
        option.innerHTML = item[textField];
        if (
          typeof value != "undefined" &&
            value !== null &&
            value === item[valueField]
        ) {
          option.selected = true;
        } // end if value defined
        select.appendChild(option);
      };

      data.forEach(forEachItem);
    }; // end function populateSelect

    self.create = function(nodeName) {
      var element = document.createElement(nodeName);

      if (typeof rs.config != "undefined" && rs.config !== null) {
        if (typeof rs.config.options.useMVC != "undefined") {
          if (rs.config.options.useMVC) {
            self.setMVCListener(element);
          } // end if useMVC true
        } // end if useMVC defined
      } // end if self.config

      return element;
    }; // end create

    /**
     * This function will set a listener onchange of the value for the input
     */
    self.setMVCListener = function(input) {
      var setTwoWaysBinding = function(element, bindable) {
        // hacer otra funcion para los setters and getters
        var parts = bindable.split(".");
        if (parts.length > 1) {
          var propName = parts[parts.length - 1];
          parts.pop();
          var obj = parts.join(".");
          if (rs.evalUndefined(obj)) {
            rs.assignValue(obj, "{}");
          } // end if obj undefined

          var privateName = "_" + propName;
          rs.assignValue(obj + "." + privateName, null);
          var fnGet = function() {
            return this[privateName];
          };
          var fnSet = function(value) {
            this[privateName] = value;
            var nodeName = element.nodeName.toLowerCase();
            if (nodeName == "img") {
              element.src = value;
            } else {
              if (element != document.activeElement) {
                element.value = value;
              } // end if not activeElement
            } // end if nodeName is img
          }; // end fnSet

          rs.defineSetter(obj, propName, fnSet);
          rs.defineGetter(obj, propName, fnGet);
        } // if parts
      }; // end function setTwoWaysBinding

      /**
       * This function will be set to inputs
       */
      var onChange = function() {
        var self = this;
        var bindable = self.getAttribute("data-bind");
        if (bindable !== null) {
          var nodeName = self.nodeName.toLowerCase();
          var type = self.getAttribute("type");
          var val = null;
          if (nodeName == "input" && type == "checkbox") {
            val = self.checked;
          } else if (nodeName == "select") {
            val = self.value;
          } else {
            val = self.value;
          } // end if nodename

          var current = rs.returnValue(bindable);
          if (current != val) {
            rs.assignValue(bindable, val);
            var bindedElements = document.querySelectorAll(
              "[data-bind='" + bindable + "']"
            );
            var len = bindedElements.length;
            var i;
            var property;

            var forEachBinded = function(element, key, arr) {
              nodeName = element.nodeName.toLowerCase();
              if (nodeName == "select") {
                element.value = rs.returnValue(bindable);
              } else {
                element.innerHTML = rs.returnValue(bindable);
              } // end if nodeName select
            }; // end forEachBinded

            Array.prototype.forEach.call(bindedElements, forEachBinded);
          } // end if current != val
        } // end if bindable
      }; // end onChange

      switch (input.nodeName.toLowerCase()) {
        case "input":
          var type = input.getAttribute("type");
          switch (type) {
            case "text":
              input.addEventListener("keyup", onChange);
              input.addEventListener("blur", onChange);
              break;
            case "email":
              input.addEventListener("keyup", onChange);
              input.addEventListener("blur", onChange);
              break;
            case "password":
              input.addEventListener("keyup", onChange);
              input.addEventListener("blur", onChange);
              break;
            case "date":
              input.addEventListener("change", onChange);
              input.addEventListener("blur", onChange);
              break;
            case "time":
              input.addEventListener("change", onChange);
              input.addEventListener("blur", onChange);
              break;
            case "checkbox":
              input.addEventListener("change", onChange);
              break;
            case "radio":
              input.addEventListener("change", onChange);
              break;
            default:
          } // end switch
          break;
        case "textarea":
          input.addEventListener("keyup", onChange);
          input.addEventListener("blur", onChange);
          break;
        case "select":
          input.addEventListener("change", onChange);
          break;
        default:
        // No input
      } // end switch

      var bindable = input.getAttribute("data-bind");
      var twoways = input.getAttribute("data-bind-mode");

      if (twoways !== null) {
        setTwoWaysBinding(input, bindable);
      }
      rs.assignValue(bindable, null);
    }; // end end setMVCListener

    self.bindData = function() {
      var self = this;
      var forEachInput = function(input, key, arr) {
        self.setMVCListener(input);
      }; // end function forEachInput

      var inputs = document.querySelectorAll("input, textarea, select, img");

      Array.prototype.forEach.call(inputs, forEachInput);

      var selectElements = document.querySelectorAll("select[data-source]");

      var forEachSelect = function(select, key, arr) {
        var valueField = select.getAttribute("data-value-field");
        var textField = select.getAttribute("data-display-field");
        var dataSource = select.getAttribute("data-source");
        var dataBind = select.getAttribute("data-bind");

        dataSource = rs.returnValue(dataSource);
        var selectValue = rs.returnValue(dataBind);
        self.populateSelect(
          select,
          dataSource,
          valueField,
          textField,
          selectValue
        );
      }; // end forEachSelect

      Array.prototype.forEach.call(selectElements, forEachSelect);

      var bindedElements = document.querySelectorAll(
        "[data-bind],[data-source]"
      );

      var len = bindedElements.length;
      var i;
      var property;

      var forEachBinded = function(element, key, arr) {
        var nodeName = element.nodeName.toLowerCase();
        var bindable = element.getAttribute("data-bind");

        if (
          nodeName == "select" || nodeName == "input" || nodeName == "textarea"
        ) {
          if (!rs.evalUndefined(bindable)) {
            element.value = rs.returnValue(bindable);
          } // end if bindable
        } else if (nodeName == "img") {
          element.src = rs.returnValue(bindable);
        } else if (nodeName == "table") {
          bindable = element.getAttribute("data-source");
          if (!rs.evalUndefined(bindable)) {
            // Here we parse the table
            var ths = element.querySelectorAll("tr > th");
            var options = {};
            var columns = [];
            var column = {};

            if (element.getAttribute("class") !== null) {
              options.class = element.getAttribute("class");
            } // end if class

            // for each th search data-field, just like RsPhp
            var fnEachTh = function(th, i, ths) {
              column = {};
              var type = th.getAttribute("data-field-type");
              column.type = type;
              switch (type) {
                case "text":
                  column.name = th.getAttribute("data-field");
                  column.header = th.getAttribute("data-header");
                  columns.push(column);
                  break;
                case "textbox":
                  column.name = th.getAttribute("data-field");
                  column.header = th.getAttribute("data-header");
                  columns.push(column);
                  break;
                case "select":
                  column.name = th.getAttribute("data-field");
                  column.header = th.getAttribute("data-header");
                  column.source = th.getAttribute("data-source");
                  column.valueField = th.getAttribute("data-value-field");
                  column.displayField = th.getAttribute("data-display-field");
                  columns.push(column);
                  break;
                case "hyperlink":
                  column.name = th.getAttribute("data-field");
                  column.header = th.getAttribute("data-header");
                  column.urlFormatFields = th.getAttribute("data-url-fields");
                  column.text = th.getAttribute("data-text");
                  column.urlFormat = th.getAttribute("data-url-format");
                  column.onclickFormatFields = th.getAttribute(
                    "data-onclick-fields"
                  );
                  column.onclickFormat = th.getAttribute("data-onclick-format");

                  if (column.onclickFormatFields !== null) {
                    column.onclickFormatFields = column.onclickFormatFields.split(
                      ","
                    );
                  }

                  if (column.urlFormatFields !== null) {
                    column.urlFormatFields = column.urlFormatFields.split(",");
                  }

                  columns.push(column);
                  break;
                default:
              }
            }; // end function fnEachTh

            ths.forEach(fnEachTh);
            element.clear();
            var data = rs.returnValue(bindable);
            options.columns = columns;
            var newTable = self.getTableFromData(data, options);
            self.replaceTable(element, newTable);
          } // end if bindable
        } else {
          element.innerHTML = rs.returnValue(bindable);
        } // end if nodeName
      }; // end forEachBinded

      Array.prototype.forEach.call(bindedElements, forEachBinded);
    }; // end function bindData

    self.replaceTable = function(table, newTable) {
      table.parentNode.replaceChild(newTable, table);
    }; // end function replaceTable

    self.bind = function(variableName) {
      var bindedElements = document.querySelectorAll("[data-bind]");
      var len = bindedElements.length;
      var i;
      var property;

      var forEachBinded = function(element, key, arr) {
        var nodeName = element.nodeName.toLowerCase();
        var bindable = element.getAttribute("data-bind");
        if (bindable == variableName) {
          if (!rs.evalUndefined(bindable)) {
            if (
              nodeName == "select" ||
                nodeName == "input" ||
                nodeName == "textarea"
            ) {
              element.value = rs.returnValue(bindable);
            } else {
              element.innerHTML = rs.returnValue(bindable);
            } // end if nodeName select
          } // end if not undefined
        } // end if bindable = variableName
      }; // end forEachBinded

      Array.prototype.forEach.call(bindedElements, forEachBinded);
    }; // end function bind

    /**
     * Adds a model to the current memory stack
     */
    self.addModel = function(name, data) {
      var fn = function(name) {
        console.log(name + " has changed");
        // self.bind( name );
        // here we look for data-bind and changed them
      }; // end fn
      if (data.constructor != "RSObject") {
        data = new RSObject(data);
      } // end if
      var fnEach = function(value, key, obj) {
        watcher.add(name + "." + key, fn);
      }; // end fnEach
      data.forEach(fnEach);
      window[name] = data;
    }; // end function addModel

    /**
     * Gets a table element from a json data
     *
     * @param {Array} data An array of json objects
     * @param {Object} options An object with key value pair options for the table
     *
     * @return {HTMLElement}
     */
    self.getTableFromData = function(data, options) {
      /**
       * Gets the rows checked, in a table with checkboxes
       *
       * @param {String} table The table's id
       *
       * @return {Array}
       */
      var _checkedRows = function() {
        var self = this;
        var rows = [];
        self.forEachRow(
          function(row, index, arr) {
            row.forEachCell(
              function(cell, cellIndex, cellArray) {
                cell.childNodes.forEach(
                  function(node, nodeIndex, nodeArray) {
                    if (node.type == "checkbox") {
                      if (node.checked) {
                        rows.push(row);
                      } // end if checked
                    } // end if checkbox
                  } // end function anonymous foreach node
                ); // end foreach childNode
              } // end function anonymour foreach cell
            ); // end forEachCell
          } // end function anonymous foreach
        ); // end forEachRow

        return rows;
      }; // end function getCheckedRows

      /**
       * Applies for each to cells in a row
       *
       * @param fn {Function} The function foreach
       *
       * @return {Function}
       */
      var _forEachCell = function(fn) {
        var self = this;
        var item = null;
        var arr = self.cells;
        var i = 0;

        for (i = 0; i < arr.length; i++) {
          item = arr[i];
          fn(item, i, arr);
        } // end for
      }; // end forEachCell

      /**
       * Applies for each to rows in a table
       *
       * @param fn {Function} The function foreach
       *
       * @return {Function}
       */
      var _forEachRow = function(fn) {
        var self = this;
        var item = null;
        var arr = self.rows;
        var i = 0;

        for (i = 0; i < arr.length; i++) {
          item = arr[i];
          fn(item, i, arr);
        } // end for
      }; // end function forEachRow

      if (typeof data == "undefined") {
        console.error("Table data is undefined");
        dlg.showAlert("Los datos no estan definidos", "Error", "Ok");
        return;
      } // end if

      if (data.length == 0) {
        return dom.create("table");
      } // end if data len = 0

      var table = self.create("table");
      table.forEachRow = _forEachRow;
      table.checkedRows = _checkedRows;
      table.sort = function(property, ascDesc) {
        if (typeof ascDesc == "undefined") {
          ascDesc = "asc";
        } // end if ascDesc is undefined
      }; // end function table.sort

      if (typeof options != "undefined") {
        if (typeof options.class != "undefined") {
          table.addClass(options.class);
        } // if class not undefined

        if (typeof options.id != "undefined") {
          table.id = options.id;
        } // end if id defined
      } // end if options not undefined

      var firstRow = data[0];
      var keys = Object.keys(firstRow);
      var th = null;

      var clearRows = function() {
        var len = table.rows.length;
        while (table.rows.length > 1) {
          table.deleteRow(1);
        } // end while rows
      }; // end function clearRows

      var fnEachColumn = function(item, index, array) {
        th = self.create("th");
        th.setAttribute("data-sort", "asc");
        th.style.cursor = "pointer";

        var text = item + arrowUp;

        if (typeof item.name != "undefined") {
          text = item.name + arrowUp;
        } // end if name

        if (typeof item.header != "undefined") {
          text = item.header + arrowUp;
        } // end if item header

        th.addText(text);

        var sortClick = function() {
          var self = this;
          var sort = self.getAttribute("data-sort");
          var arrow = "";
          var sortColumn = item;

          if (typeof item.name != "undefined") {
            sortColumn = item.name;
          } // end if name defined

          if (sort == "asc") {
            sort = "desc";
            arrow = arrowDown;
            data.sortDesc(sortColumn);
          } else {
            sort = "asc";
            arrow = arrowUp;
            data.sortAsc(sortColumn);
          } // end if as

          self.setAttribute("data-sort", sort);

          sortColumn += arrow;

          if (typeof item.header != "undefined") {
            sortColumn = item.header + arrow;
          }

          // Set header text
          self.innerText = sortColumn;
          // Clear rows
          clearRows();
          // Add rows again
          data.forEach(fnEachRow);
        }; // end sortClick function

        th.addEventListener("click", sortClick);
        tr.appendChild(th);
      }; //end fnEachColumn

      var fnEachRow = function(obj, i, arr) {
        var fnEach = function(item, index, array) {
          var td = self.create("td");
          td.addText(obj[item]);
          tr.appendChild(td);
        }; // end function fnEach

        var fnEachColumn = function(item, index, array) {
          var row = obj;
          var td = self.create("td");

          switch (item.type) {
            case "checkbox":
              var checkbox = self.create("input");
              checkbox.type = "checkbox";
              checkbox.id = item.name + "_" + i;
              checkbox.value = row[item.name];
              td.appendChild(checkbox);
              break;

            case "text":
              if (
                typeof item.transform != "undefined" &&
                  typeof item.transform == "function"
              ) {
                td.addText(item.transform(row[item.name]));
              } else if (typeof options.isNull != "undefined") {
                if (row[item.name] === null) {
                  td.addText(options.isNull);
                } // end if null
              } else {
                td.addText(row[item.name]);
              } // end if item.coalesce
              break;

            case "textbox":
              var textbox = self.create("input");
              textbox.type = "text";
              textbox.value = row[item.name];
              td.appendChild(textbox);

              break;
            case "select":
              break;
            case "hyperlink":
              var hyperlink = self.create("a");
              var dataTextFormat = item.dataTextFormat;
              var dataTextFormatFields = item.dataTextFormatFields;
              var linkText = item.text;

              if (typeof item.text == "undefined") {
                if (
                  dataTextFormat !== null &&
                    typeof dataTextFormat != "undefined"
                ) {
                  if (
                    dataTextFormatFields !== null &&
                      typeof dataTextFormatFields != "undefined"
                  ) {
                    var fnEach = function(fieldName, index, fields) {
                      var toFind = "@" + fieldName;
                      dataTextFormat = dataTextFormat.replace(
                        toFind,
                        row[fieldName]
                      );
                    }; // end fnEach
                    dataTextFormatFields.forEach(fnEach);
                    linkText = dataTextFormat;
                  } else {
                    linkText = dataTextFormat;
                  } // end if url fields
                } // end if urlFormat
              }
              hyperlink.appendChild(document.createTextNode(linkText));

              var urlFormat = item.urlFormat;
              var urlFormatFields = item.urlFormatFields;
              var url = "#";
              if (urlFormat !== null && typeof urlFormat != "undefined") {
                if (
                  urlFormatFields !== null &&
                    typeof urlFormatFields != "undefined"
                ) {
                  var fnEach = function(fieldName, index, fields) {
                    var toFind = "@" + fieldName;
                    urlFormat = urlFormat.replace(toFind, row[fieldName]);
                  }; // end fnEach
                  urlFormatFields.forEach(fnEach);
                  url = urlFormat;
                } else {
                  url = urlFormat;
                } // end if url fields
              } // end if urlFormat
              hyperlink.href = url;

              var onclickFormat = item.onclickFormat;
              var onclickFormatFields = item.onclickFormatFields;
              var onclick = "";
              if (
                onclickFormat !== null && typeof onclickFormat != "undefined"
              ) {
                if (
                  onclickFormatFields !== null &&
                    typeof onclickFormatFields != "undefined"
                ) {
                  var fnEach = function(fieldName, index, fields) {
                    var toFind = "@" + fieldName;
                    onclickFormat = onclickFormat.replace(
                      toFind,
                      row[fieldName]
                    );
                  }; // end fnEach
                  onclickFormatFields.forEach(fnEach);
                  onclick = onclickFormat;
                } else {
                  onclick = onclickFormat;
                } // end if url fields
              } // end if urlFormat

              hyperlink.setAttribute("onclick", onclick);
              td.appendChild(hyperlink);

              break;
            case "hidden":
              var hidden = self.create("input");
              hidden.type = "hidden";
              hidden.value = row[item.name];
              td.appendChild(hidden);
              break;

            case "textarea":
              var textarea = self.create("textarea");
              textarea.value = row[item.name];
              td.appendChild(textarea);
              break;

            case "image":
              var img = self.create("img");
              urlFormat = item.urlFormat;
              urlFormatFields = item.urlFormatFields;
              url = "#";
              if (urlFormat !== null) {
                if (urlFormatFields !== null) {
                  var fnEach = function(fieldName, index, fields) {
                    var toFind = "@" + fieldName;
                    urlFormat = urlFormat.replace(toFind, row[fieldName]);
                  }; // end fnEach

                  urlFormatFields.forEach(fnEach);
                  url = urlFormat;
                } else {
                  url = urlFormat;
                } // end if url fields
              } // end if urlFormat

              img.src = url;
              img.style.height = item.height;
              img.style.width = item.width;
              td.appendChild(img);
              break;

          } // end switch

          tr.appendChild(td);
        }; // end function fnEach

        tr = self.create("tr");
        tr.forEachCell = _forEachCell;
        tr.data = obj;

        if (typeof options != "undefined") {
          if (typeof options.onclick != "undefined") {
            var caller = function() {
              options.onclick(obj);
            }; // end caller
            tr.addEventListener("click", caller);
          } // end if onclick
        } // end if options

        if (typeof options != "undefined") {
          if (typeof options.columns != "undefined") {
            options.columns.forEach(fnEachColumn);
          } else {
            keys.forEach(fnEach);
          } // end if then else columns
        } else {
          keys.forEach(fnEach);
        } // end if then else options

        if (typeof options != "undefined") {
          if (typeof options.backgroundColorField != "undefined") {
            tr.style.backgroundColor = obj[options.backgroundColorField];
          } // end if bgColorField
        } // end if options undefined

        table.appendChild(tr);
      }; // end function fnEachRow

      var tr = self.create("tr");
      tr.setAttribute("data-rowheader", true);
      tr.forEachCell = _forEachCell;
      tr.data = keys;

      if (typeof options != "undefined") {
        if (typeof options.columns != "undefined") {
          options.columns.forEach(fnEachColumn);
        } else {
          keys.forEach(fnEachColumn);
        } // end if then else columns
      } else {
        keys.forEach(fnEachColumn);
      } // end if then else options

      table.appendChild(tr);

      data.forEach(fnEachRow);
      return table;
    }; // end function getTableFromData

    /**
     * Creates a table in element id
     * @param id The id for the element
     * @param data The data to create the table
     * @param options The options of the table
     */
  self.setDataTable = function(id, data, options) {
    var tableParent = dom.getById(id);
    if ( tableParent == null ) {
      console.error( tableParent + " do not exists" );
    } // end oif tableParent null

    var table = self.getTableFromData(data, options);
    tableParent.clear();
    table.addClass("table table-hover");
    tableParent.appendChild(table);
    return table;
  }; // end function getDOMTable

    /**
     * Represents a data table
     *
     * @param {String} container The id for the container
     * @param {Array} data The data, and array or objects
     * @param {Object} options The data structure and table options
     *
     * @return {HTMLElement}
     */
    self.DataTable = function(containerId, data, options) {
      var me = this;
      me = self.setDataTable(containerId, data, options);
      return me;
    }; // end function DataTable
  } // end function Dom

  var dom = new Dom();

  /*
   *  Controller
   */
  function Controller() {} // end function controller

  /*
	::Local.js::
	Do Local Storage
	Dependencies
		None
*/
  function Local() {
    this.set = function(itemKey, itemValue) {
      if (typeof itemValue == "object") {
        itemValue = JSON.stringify(itemValue);
      } // end if itemValue object
      window.localStorage.setItem(itemKey, itemValue);
    };

    this.remove = function(itemKey) {
      window.localStorage.removeItem(itemKey);
    };

    var getAll = function() {
      var i = 0;
      var len = localStorage.length;
      var params = {};

      for (i = 0; i < len; ++i) {
        var itemValue = localStorage.getItem(localStorage.key(i));
        var output = {};
        if (JSON.tryParse(itemValue, output)) {
          params[localStorage.key(i)] = output;
        } else {
          params[localStorage.key(i)] = itemValue;
        } // end if tryParse
      } // end for

      return params;
    }; // end getAll

    this.get = function(itemKey) {
      if (typeof itemKey == "undefined") {
        return getAll();
      } // end if itemKey undefined
      if (window.localStorage.getItem(itemKey) === null) {
        console.warn("Item " + itemKey + " do not exists");
        return null;
      }

      var output = {};
      var itemValue = window.localStorage.getItem(itemKey);
      if (JSON.tryParse(itemValue, output)) {
        return output.data;
      } else {
        return itemValue;
      } // end if then else JSON.tryParse
    };

    this.exists = function(itemKey) {
      return window.localStorage.getItem(itemKey) !== null;
    };
  } // end Local

  var local = new Local();

  /*::End::*/

  /*
	::Geo.js::
	This script manages GeoPosition
	Dependencies
		Google maps api
		Dialog
		Local
*/

  /*	Class for Geo Position */
  /*
	This contains the structure data
*/
  function GeoPosition() {
    this.Lat = 0;
    this.Lng = 0;
    this.LatLng = null;
    this.Geocode = [];
    this.StreetNumber = "";
    this.Route = "";
    this.SubLocality = "";
    this.City = "";
    this.State = "";
    this.Country = "";
    this.PostalCode = "";
    this.Address = "";
  } // end class GeoPosition

  function Geo() {
    var fn = null;
    this.onError = function(error) {
      dlg.showAlert("Hubo problemas obteniendo la posicion");
    };

    this.onSuccessGetPosition = function(position) {
      local.remove("currentGeoPosition");
      var geoPos = new GeoPosition();

      geoPos.Lat = parseFloat(position.coords.latitude);
      geoPos.Lng = parseFloat(position.coords.longitude);
      geoPos.LatLng = new google.maps.LatLng(geoPos.Lat, geoPos.Lng);

      this.coder = new google.maps.Geocoder();
      this.coder.geocode(
        {
          latLng: geoPos.LatLng
        },
        function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              var arrAddress = results[0].address_components;
              var i = 0;
              for (i = 0; i < arrAddress.length; i++) {
                switch (arrAddress[i].types[0]) {
                  case "street_number":
                    geoPos.StreetNumber = arrAddress[i].long_name;
                    break;
                  case "route":
                    geoPos.Route = arrAddress[i].long_name;
                    break;
                  case "sublocality_level_1":
                    geoPos.SubLocality = arrAddress[i].long_name;
                    break;
                  case "locality":
                    geoPos.City = arrAddress[i].long_name;
                    break;
                  case "administrative_area_level_1":
                    geoPos.State = arrAddress[i].long_name;
                    break;
                  case "country":
                    geoPos.Country = arrAddress[i].long_name;
                    break;
                  case "postal_code":
                    geoPos.PostalCode = arrAddress[i].long_name;
                    break;
                }
              }

              geoPos.Address = geoPos.Route +
                ", " +
                geoPos.StreetNumber +
                ", " +
                geoPos.SubLocality +
                ", " +
                geoPos.City +
                ", " +
                geoPos.State +
                ", " +
                geoPos.Country;

              local.set("currentGeoPosition", JSON.stringify(geoPos));

              fn(geoPos);
            } else {
              dlg.showAlert("No results found", "Error", "Ok");
            }
          } else {
            dlg.showAlert("Geocoder failed due to: " + status, "Error", "Ok");
          }
        }
      );
    };

    this.getPositionAddress = function(callBack) {
      fn = callBack;
      //var options = { maximumAge: 0, timeout: 10000, enableHighAccuracy:true };
      navigator.geolocation.getCurrentPosition(
        this.onSuccessGetPosition,
        this.onError
      );
    };
  } // end clas Geo

  //	Global instance
  window.geo = new Geo();

  function Http() {
    var self = this;

    var headers = new RSObject();

    this.setHeader = function(key, value) {
      headers[key] = value;
    }; // end function setHeader

    this.getHeaders = function() {
      return headers;
    }; // end function getHeaders

    this.clearHeaders = function() {
      headers = {};
    }; // end function clearHeaders

    this.get = function(url, data, onSuccess, onError) {
      self.request("GET", url, data, onSuccess, onError);
    }; // end function post

    this.post = function(url, data, onSuccess, onError) {
      self.request("POST", url, data, onSuccess, onError);
    }; // end function post

    this.put = function(url, data, onSuccess, onError) {
      self.request("PUT", url, data, onSuccess, onError);
    }; // end function post

    this.delete = function(url, data, onSuccess, onError) {
      self.request("DELETE", url, data, onSuccess, onError);
    }; // end function post

    this.head = function(url, data, onSuccess, onError) {
      self.request("HEAD", url, data, onSuccess, onError);
    }; // end function post

    this.postMultiPart = function(form, onSuccess) {
      var xhttp = new XMLHttpRequest();

      xhttp.open("post", form.action, true);

      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          var res = {};
          res.headers = {};
          var headers = xhttp.getAllResponseHeaders();
          headers = headers.split("\n");
          var fnEach = function(item, index, collection) {
            if (item !== "") {
              var parts = item.split(": ");
              var tmp = {};
              res.headers[parts[0].trim()] = parts[1].trim();
            } // end if item != ''
          }; // end fnEach
          headers.forEach(fnEach);
          res.status = xhttp.status;
          if (res.headers["Content-Type"] == "application/json") {
            res.data = JSON.parse(xhttp.response);
          } else {
            res.data = xhttp.response;
          } // end if json
          onSuccess(res);
        }
      };

      var formData = new FormData(form);
      xhttp.send(formData);
    }; // end function postMultiPart

    this.request = function(method, url, data, onSuccess, onError) {
      //  Manage onError absence if any
      var localOnError = null;
      if (typeof onError == "undefined") {
        localOnError = function(statusText) {
          console.error(statusText);
        }; // end function localOnError
      } else {
        localOnError = onError;
      } // end if then else undefined onError

      //  Function on statechange
      var fnStateChange = function() {
        if (xhttp.readyState == 4) {
          if (xhttp.status == 200) {
            var res = {};
            res.headers = {};
            var headers = xhttp.getAllResponseHeaders();
            headers = headers.split("\n");
            var fnEach = function(item, index, collection) {
              if (item !== "") {
                var parts = item.split(": ");
                var tmp = {};
                res.headers[parts[0].trim().toLowerCase()] = parts[1].trim();
              } // end if item != ''
            }; // end fnEach
            headers.forEach(fnEach);
            res.status = xhttp.status;
            if (res.headers["content-type"] == "application/json") {
              res.data = JSON.parse(xhttp.response);
            } else {
              res.data = xhttp.response;
            } // end if json
            onSuccess(res);
          } else {
            localOnError(xhttp);
          } // end if then else status 200
        } // end if readyState 4
      }; // enf function onreadystatechange

      //  The actual request
      var xhttp = new XMLHttpRequest();
      //  Set the function
      xhttp.onreadystatechange = fnStateChange;

      // The headers
      var setHeaders = function() {
        var fnEach = function(value, key, obj) {
          xhttp.setRequestHeader(key, value);
        }; // end function fn
        headers.forEach(fnEach);
      }; // end function setHeaders

      // Vars to post
      var toPost = null;
      var isBinary = false;
      if (typeof data != "undefined") {
        if (data !== null) {
          if (String(data.constructor).contains("function File()")) {
            toPost = data;
            isBinary = true;
          } else {
            data = new RSObject(data);
            toPost = data.serialize();
          } // end if constructor is formdata
        } // end if data is null
      } // end function is undefined data

      // setup method & url
      if (method == "GET") {
        if (toPost !== "") {
          url = url + "?" + toPost;
        } // end function toPost
        xhttp.open(method, url, true);
        setHeaders();
        xhttp.send();
      } else {
        xhttp.open(method, url, true);
        if (isBinary) {
          setHeaders();
          xhttp.setRequestHeader(
            "Content-type",
            "multipart/form-data; boundary=blob"
          );
          xhttp.send(toPost);
        } else {
          xhttp.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          setHeaders();
          xhttp.send(toPost);
        } // end if isBinary
      } // end if method = get
    }; // end function request

    // Download a file submiting a form
    self.downloadFile = dom.submitForm;
  } // end class Http

  var http = new Http();

  /**
   *  Holds the function for Restful calls
   */
  function Restful(resourceUrl) {
    //  Reference to itself
    var self = this;

    //  This variable will hold the handler for get requests
    var responseHandler = null;

    //  To get the name of the function
    //  var myName = arguments.callee.toString().match(/function ([^\(]+)/)[1];

    //  The RegEx to identify parameters in the url
    //  We expect only one parameter in the format :id
    var uriParamRegex = /:\b[a-z]+/g;
    var match = uriParamRegex.exec(resourceUrl);

    //  If any parameter
    if (typeof match != "undefined") {
      //  If any parameter
      if (match.length > 0) {
        //  Get the name of the parameter
        match = match[0];
        //  Strip the escape char
        var key = match.replace(":", "");
        //  If the property is set in the object
        if (typeof self[key] != "undefined") {
          //  Replace in the url
          resourceUrl = resourceUrl.replace(match, self[key]);
        } else {
          //  If not, strip from the url
          resourceUrl = resourceUrl.replace(match, "");
        } // end if then else key is defined
      } // end if match len > 0
    } // end if matchUndefined

    //  This private function will search the object
    //  Restful itself and returns their public properties
    //  ( no functions, only data )
    var setData = function() {
      var data = {};
      var fnEach = function(key, index, arr) {
        var value = self[key];
        if (typeof value != "function") {
          data[key] = value;
        } // end if not function
      }; // end fnEach

      var keys = Object.keys(self);
      keys.forEach(fnEach);
      return data;
    }; // end function setData

    //  This private function will create a collection
    //  of restful objects
    var createCollection = function(response) {
      var result = [];
      var fnEach = function(item, index, arr) {
        //  replace with window["Restful"](resourceUrl)
        var r = new window["Restful"](resourceUrl);
        //var toEval = "var x = new " + myName + "(\"" + resourceUrl + "\");";
        var fnEachItem = function(value, key, obj) {
          //toEval += "x." + key + " = \"" + value + "\"; ";
          r[key] = value;
        };
        item.forEach(fnEachItem);
        //toEval += " result.push(x);";
        //eval(toEval);
        result.push(r);
      };

      response.forEach(fnEach);

      return result;
    }; // end function createCollection

    //  This private function will update the object itself
    //  from a http response properties
    var updateModel = function(model) {
      var fnEach = function(value, key, obj) {
        self[key] = value;
      }; // end function fnEach
      model.forEach(fnEach);
    }; // end function updateModel

    //  This is the function to trigger on GET requests
    //  It will handle the response, accordingly.
    //  We expect an array for getAll or query (no id specified)
    //  and an object for an id specified request
    var onGet = function(response) {
      if (typeof response == "object") {
        if (response instanceof Array) {
          if (typeof responseHandler != "undefined") {
            var collection = createCollection(response);
            responseHandler(collection);
            responseHandler = null;
          } // end if not responseHandler undefined
        } else {
          updateModel(response);
        } // end if response is array
      } else {
        console.error("Response is neither Array nor Object.");
      } // end if response is object
    }; // end function onSuccess

    /** Begin Public methods **/

    //  Perform a GET request
    this.get = function(fnResponse) {
      if (typeof fnResponse != "undefined") {
        responseHandler = fnResponse;
      } // end if fnOnResponse undefined
      //  Data not necesary for get
      http.get(resourceUrl, null, onGet);
    }; // end function get

    //  Perform a POST request
    this.post = function() {
      var data = setData();
      http.post(resourceUrl, data, onRequest);
    };

    //  Perform a PUT request
    this.put = function() {
      var data = setData();
      http.put(resourceUrl, data, onRequest);
    };

    //  Perform a DELETE request
    this.delete = function() {
      var data = setData();
      http.delete(resourceUrl, data, onRequest);
    };

    //  Perform a HEAD request
    this.head = function() {
      var data = setData();
      http.head(resourceUrl, data, onRequest);
    };
  } // end class restful

  /**
   * Handles load content into HTMLElements
   */
  function View(id) {
    var self = this;
    self.contentId = id;
    self.content = dom.getById(self.contentId);
    self.httpR = null;

    self.setHttp = function() {
      if (this.httpR === null) {
        if (typeof http != "undefined") {
          this.httpR = http;
        } else {
          this.httpR = new Http();
        } // end if then else is undefined http
      } // end if httpR undefined
    }; // end setHttp;

    self.setHttp();

    self.setContent = function() {
      self.content = dom.getById(self.contentId);
    }; // end self.setContent

    self.loadUrl = function(url, data, fn) {
      self.setContent();
      if (data === null) {
        data = new RSObject( data );
      } else if ( data.constructor.toString().contains("Object") ) {
        data = new RSObject( data );
      }  // end if data = object

      //url = url + "?" + String((Math.random() * 10000000000000000) + 1);
      var onSuccess = function(response) {
        var template = String(response.data);
        template = self.populateTemplate(template, data);
        self.content.innerHTML = template;
        dom.bindData();

        if (typeof fn != "undefined") {
          fn();
        } // end if fn
      }; // end function fn

      this.httpR.post(url, null, onSuccess);
    }; // end function load

    self.loadTemplate = function(id, data) {
      if (data === null) {
        data = new RSObject( data );
      } else if ( data.constructor.toString().contains("Object") ) {
        data = new RSObject( data );
      }  // end if data = object

      var html = dom.getById(id).innerHTML;
      self.loadHTML(html, data);
      dom.bindData();
    }; // end function loadTemplate

    self.loadHTML = function(html, data) {
      self.setContent();
      html = self.populateTemplate(html, data);
      self.content.innerHTML = html;
      dom.bindData();
    }; // end function load

    self.populateTemplate = function(template, data) {
      if (typeof data != "undefined" && data !== null) {
        if (typeof data.length != "undefined") {
          var result = "";
          var fEach = function(item, index, collection) {
            result += self.populateTemplate(template, item);
          }; // end fEach
          data.forEach(fEach);
          return result;
        } else {
          if (data !== null) {
            data = new RSObject(data);
            var jsonString = JSON.stringify(data);
            jsonString = jsonString.encodeUri();
            template = template.replaceAll("$itemJson", jsonString);

            var fn = function(value, key, obj) {
              var find = "$" + key;
              template = template.replaceAll(find, value);
            }; // end function fn (forEach)

            data.forEach(fn);
          } // end if data not null
        }
      } // end if data not undefined

      var reg = new RegExp("\\$[a-zA-Z0-9]+", "gi");
      var variables = template.match(reg);

      var fnEach = function(item, index, collection) {
        var varName = item.replace("$", "");
        if (typeof window[varName] != "undefined") {
          template = template.replaceAll(item, window[varName]);
        } // end fi window[varName]
      }; // end function

      if (variables !== null) {
        variables.forEach(fnEach);
      } // end if variables

      return template;
    }; // end function populateTemplate
  } // end class View

  /*::End::*/

  /** DateHelper **/
  function DateHelper() {
    this.timestamp = function() {
      return Math.floor(Date.now() / 1000); // end Math floor
    }; // end function timestamp

    this.getDateParts = function(date) {
      var dateObj = new Date();
      if (typeof date != "undefined") {
        dateObj = new Date(date);
      }

      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      var hour = dateObj.getUTCHours();
      var minutes = dateObj.getUTCMinutes();
      var seconds = dateObj.getUTCSeconds();
      month = "00" + month;
      month = String(month).right(2);
      day = "00" + day;
      day = String(day).right(2);
      hour = "00" + hour;
      hour = String(hour).right(2);
      minutes = "00" + minutes;
      minutes = String(minutes).right(2);
      seconds = "00" + seconds;
      seconds = String(seconds).right(2);
      var newTime = hour + ":" + minutes + ":" + seconds;
      var newDate = year + "/" + month + "/" + day;

      var dateParts = {};
      dateParts.year = year;
      dateParts.month = month;
      dateParts.day = day;
      dateParts.hour = hour;
      dateParts.date = newDate;
      dateParts.minutes = minutes;
      dateParts.seconds = seconds;
      dateParts.time = newTime;
      return dateParts;
    };
  } // end function DateHelper

  var date = new DateHelper();

  /**
   * Helper for cookies
   */
  function CookieHelper() {
    var self = this;

    self.set = function(name, value, days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      var expiresAt = "expires=" + date.toUTCString();
      var cookie = name + "=" + value + "; expires=" + expiresAt;
      document.cookie = cookie;
    }; // end function set

    self.delete = function(name) {
      var _cookies = self.get(name);

      if (_cookies === null) {
        return null;
      } // end if null

      var fnDelete = function(name) {
        var expiresAt = "Thu, 01 Jan 1970 00:00:01 GMT";
        var cookie = name + "=0; expires=" + expiresAt;
        document.cookie = cookie;
        cookie = name +
          "=0; path=/;domain=" +
          window.location.host +
          "; expires=" +
          expiresAt;
        document.cookie = cookie;
      }; // end fnDelete

      if (typeof _cookies.length != "undefined") {
        if (_cookies.length > 0) {
          var fnEach = function(item, index, collection) {
            fnDelete(item.name);
          }; // end fnEach
          _cookies.forEach(fnEach);
        } else {
          return null;
        } // en if len > 0
      } else {
        fnDelete(name);
      } // end if len not undefined
    }; // end function clear

    self.get = function(name) {
      if (document.cookie === "") {
        return null;
      } // end if cookie empty

      var cookies = document.cookie.split("; ");
      var result = [];
      var isFound = false;
      var itemResult = null;

      var fnEach = function(value, index, array) {
        var keyValue = value.split("=");
        var item = {};
        item.name = keyValue[0];
        item.value = keyValue[1];

        if (typeof name != "undefined") {
          if (name == item.name) {
            itemResult = item;
            isFound = true;
            return;
          } // end if name = item.name
        } else {
          result.push(item);
        } // end if name
      }; // end function fnEach

      cookies.forEach(fnEach);
      if (isFound) {
        return itemResult;
      } else {
        if (typeof name != "undefined") {
          return null;
        } else {
          return result;
        } // else if name not undefined
      } // end if then else if found
    }; // end function get
  } // end function cookieHelper

  /**
   * Handles the modal
   */
  function Modal() {
    var self = this;
    var divModal = dom.getById("modal");
    var divModalContent = dom.getById("modalContent");

    self.getContainer = function() {
      return divModal;
    };

    var fnLoadModal = function() {
      if (divModal === null) {
        divModal = dom.create("div");
        divModal.id = "modal";
        divModal.addClass("modal");
      } // end if divModal

      if (divModalContent === null) {
        divModalContent = dom.create("div");
        divModalContent.id = "modalContent";
        divModalContent.addClass("modalContent");
        divModal.appendChild(divModalContent);
      } // end divModalContent

      if (dom.getById("modal") === null) {
        var body = dom.get("body");
        body.appendChild(divModal);
      } // end if modal not in body
    }; // end fnLoadModal

    rs.onReady(fnLoadModal);

    self.showUrl = function(url, data) {
      divModalContent.style.width = "70%";
      divModalContent.style.height = "70vh";
      divModalContent.style.marginTop = "20vh";
      divModalContent.clear();
      var view = new View("modalContent");
      if (typeof data != "undefined") {
        view.loadUrl(url, data);
      } else {
        view.loadUrl(url);
      } // end if data
      divModal.style.display = "block";

      http.post(
        url,
        null,
        function(response) {
          var view;
          var temp = "";
          if (typeof data != "undefined") {
            view = new View();
            temp = view.populateTemplate(response.data, data);
          } else {
            temp = response.data;
          } // end if then else data undefined
          divModalContent.innerHTML = temp;
          divModal.style.display = "block";
        } // end anonymous response
      );
    }; // end showUrl

    self.showTemplate = function(templateId, data) {
      divModalContent.style.width = "70%";
      divModalContent.style.height = "70vh";
      divModalContent.style.marginTop = "20vh";
      divModalContent.clear();
      var template = dom.getById(templateId);
      var temp = "";
      if (typeof data != "undefined") {
        var view = new View();
        temp = view.populateTemplate(template.innerHTML, data);
      } else {
        temp = template.innerHTML;
      }
      divModalContent.innerHTML = temp;
      divModal.style.display = "block";
    }; // end function showTemplate

    self.showInfo = function(title, message, buttonText) {}; // end function showInfo

    self.showWait = function(message) {
      divModalContent.style.width = "50%";
      divModalContent.style.height = "25vh";
      divModalContent.style.marginTop = "25vh";
      divModalContent.clear();

      if (typeof message == "undefined") {
        message = "Espere, por favor";
      } // end if typeof message

      var txt = document.createTextNode(message);
      divModalContent.appendChild(txt);
      divModal.style.display = "block";
    }; // end function showWait

    self.hide = function() {
      divModal.style.display = "none";
      divModalContent.clear();
    }; // end function hide
  } // end function Modal

  /* Overload HTMLElmenet with view behavior */
  HTMLElement.prototype.loadUrl = function(url, data, callback) {
    var self = this;
    if (typeof self.id == "undefined") {
      self.id = "htmlelement_" + "".UUID();
    } // end if id undefined

    if (typeof self.view == "undefined") {
      self.view = new View(self.id);
    } // end if view undefined

    self.view.loadUrl(url, data, callback);
  }; // end function HTMLElement.loadUrl

  HTMLElement.prototype.loadTemplate = function(id, data) {
    var self = this;
    if (typeof self.id == "undefined") {
      self.id = "htmlelement_" + "".UUID();
    } // end if id undefined

    if (typeof self.view == "undefined") {
      self.view = new View(self.id);
    } // end if view undefined

    self.view.loadTemplate(id, data);
  }; // end function HTMLElement.loadTemplate

  HTMLElement.prototype.loadHTML = function(html, data) {
    var self = this;
    if (typeof self.id == "undefined") {
      self.id = "htmlelement" + rand();
    } // end if id undefined

    if (typeof self.view == "undefined") {
      self.view = new View(self.id);
    } // end if view undefined

    self.view.loadHTML(html, data);
  }; // end function HTMLElement.loadTemplate

  /* EXPORTS */
  window.rs = rs;
  window.watcher = watcher;
  window.dialog = dlg;
  window.dom = dom;
  window.http = http;
  window.local = local;
  window.date = date;
  window.cookies = new CookieHelper();
  window.modal = new Modal();
  window.View = View;
  window.View.populateTemplate = new View().populateTemplate;
})();
