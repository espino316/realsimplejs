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

var validateWindow = function() {
  return (window);
};

RS.SessionStorage.set = function(itemKey, itemValue) {

  if (!validateWindow()) { console.log('No window. Exit RS.SessionStorage.set'); return; }

  if (typeof itemValue == "object") {
    itemValue = JSON.stringify(itemValue);
  } // end if itemValue object
  window.localStorage.setItem(itemKey, itemValue);
};

RS.SessionStorage.remove = function(itemKey) {

  if (!validateWindow()) { console.log('No window. Exit RS.SessionStorage.remove'); return; }

  window.localStorage.removeItem(itemKey);
};

RS.SessionStorage.get = function(itemKey) {


  if (!validateWindow()) { console.log('No window. Exit RS.SessionStorage.get'); return; }

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

RS.SessionStorage.exists = function(itemKey) {

  if (!validateWindow()) { console.log('No window. Exit RS.SessionStorage.get'); return; }

  return window.localStorage.getItem(itemKey) !== null;
};
