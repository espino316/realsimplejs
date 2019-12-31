RS.SessionStorage = function() {} // end session storage

var getAll = function() {
  var i = 0;
  var len = sessionStorage.length;
  var params = {};

  for (i = 0; i < len; ++i) {
    var itemValue = sessionStorage.getItem(sessionStorage.key(i));
    var output = {};
    if (JSON.tryParse(itemValue, output)) {
      params[sessionStorage.key(i)] = output;
    } else {
      params[sessionStorage.key(i)] = itemValue;
    } // end if tryParse
  } // end for

  return params;
}; // end getAll

RS.SessionStorage.set = function(itemKey, itemValue) {
  if (typeof itemValue == "object") {
    itemValue = JSON.stringify(itemValue);
  } // end if itemValue object
  window.sessionStorage.setItem(itemKey, itemValue);
};

RS.SessionStorage.remove = function(itemKey) {
  window.sessionStorage.removeItem(itemKey);
};

RS.SessionStorage.get = function(itemKey) {
  if (typeof itemKey == "undefined") {
    return getAll();
  } // end if itemKey undefined
  if (window.sessionStorage.getItem(itemKey) === null) {
    console.warn("Item " + itemKey + " do not exists");
    return null;
  }

  var output = {};
  var itemValue = window.sessionStorage.getItem(itemKey);
  if (JSON.tryParse(itemValue, output)) {
    return output.data;
  } else {
    return itemValue;
  } // end if then else JSON.tryParse
};

RS.SessionStorage.exists = function(itemKey) {
  return window.sessionStorage.getItem(itemKey) !== null;
};
