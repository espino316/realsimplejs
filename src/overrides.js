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

/**
 * Sum the property "prop" in array of objects
 *
 * @param {String} prop The property to sum
 *
 * @return Number
 */
Array.prototype.sum = function( prop ) {
  var self = this;
  if ( self.length === 0 ) {
    return 0;
  } // end if

  if ( typeof self[0] != "object" ) {
    console.error( "Items are not objects" );
    return;
  } // end if not object

  if ( ! self[0].hasOwnProperty( prop ) ) {
    console.error( "Items does not have a " + prop +  " property." );
    return;
  } // end if not prop

  var sum = 0;
  self.forEach(
    function( item ) {
      sum += Number(item[prop]);
    } // end anonymous forEach
  ); // end forEach

  return sum;
}; // end Array.sum

//*** END PROTOTYPES ***///

/**
 * Exception class
 *
 * @return {undefined}
 */
window.Exception = function(message, reference) {
  this.message = message;
  this.reference = reference;
}; // end class Exception
