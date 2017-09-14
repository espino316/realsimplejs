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

window.rs = new RS();
window.rs.object = new RSObject();
