define(
  [],
  function() {
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

    return Local;
  } // end anonymous define
); // end define
