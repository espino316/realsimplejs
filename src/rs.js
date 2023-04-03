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
  self.assignValue = function(bindable, value) {
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
  self.returnValue = function(bindable) {
    if ( bindable === null ) {
      return null;
    } // end if bindable is null
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
  self.evalUndefined = function(bindable) {
    var code = "return ( typeof " + bindable + " == 'undefined' );";
    var f = new Function(code);
    return f();
  }; // end function evalUndefined;

  self.defineGetter = function(obj, propName, fnGet) {
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

  self.defineSetter = function(obj, propName, fnSet) {
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
            dom.bindData();
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