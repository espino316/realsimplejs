/**
 * Dependencies: overrides.js rsobject.js rspromise.js
 *
 * @return {undefined}
 */
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

  this.get = function(url, data) {
    return self.request("GET", url, data);
  }; // end function post

  this.post = function(url, data) {
    return self.request("POST", url, data);
  }; // end function post

  this.put = function(url, data) {
    return self.request("PUT", url, data);
  }; // end function post

  this.delete = function(url, data) {
    return self.request("DELETE", url, data);
  }; // end function post

  this.head = function(url, data) {
    return self.request("HEAD", url, data);
  }; // end function post

  this.postMultiPart = function(form) {
    return new RSPromise(
      function( resolve, reject ) {

        var xhttp = new XMLHttpRequest();
        xhttp.open("post", form.action, true);

        xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4 ) {
            if ( xhttp.status == 200 ) {
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
              resolve(res);
            } else {
              reject(xhttp);
            }  // end if status is 200
          } // end if readyState = 4
        }; // end onreadystatechange

        var formData = new FormData(form);
        xhttp.send(formData);

      } // end anonymous function RSPromise
    ); // end RSPromise
  }; // end function postMultiPart

  this.request = function(method, url, data) {

    return new RSPromise(function(resolve, reject) {
      //  Manage onError absence if any
      var localOnError = null;
      if (typeof reject == "undefined") {
        localOnError = function(statusText) {
          console.error(statusText);
        }; // end function localOnError
      } else {
        localOnError = reject;
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
            if (res.headers["content-type"].contains("application/json")) {
              res.data = JSON.parse(xhttp.response);
            } else {
              res.data = xhttp.response;
            } // end if json
            resolve(res);
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
        if (toPost !== "" && toPost !== null) {
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
    });
  }; // end function request

  // Download a file submiting a form
  self.downloadFile = dom.submitForm;
} // end class Http

window.http = new Http();
