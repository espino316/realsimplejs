define(
  ["dom", "rspromise"],
  function( Dom, RSPromise ) {
    function Http() {

      var self = this;
      var dom = new Dom();

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

    return Http;
  } // end anonymous function
); // end define
