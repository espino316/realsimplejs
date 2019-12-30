/**
 * Helper for cookies
 *
 * Dependencies: overrides.js
 *
 * @return {undefined}
 */
RS.CookieHelper = function() {

  var self = this;

  self.set = function(name, value, days) {

    //  If not days speficied, set to one hour
    if (!days) {
      days = 1/24;
    } // end if not days

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
