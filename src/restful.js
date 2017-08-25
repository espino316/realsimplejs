define(
  ["http"],
  function( Http ) {
    /**
     *  Holds the function for Restful calls
     */
    function Restful(resourceUrl) {

      var http = new Http();

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
  } // end anonymous function
); // end define
