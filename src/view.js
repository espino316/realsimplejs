/**
 * Handles load content into HTMLElements
 */
RS.View = function ( id ) {
  var self = this;
  var dom = new RS.Dom();

  self.contentId = id;
  self.content = dom.getById(self.contentId);
  self.httpR = null;

  self.setHttp = function() {
    if (this.httpR === null) {
      if (typeof http != "undefined") {
        this.httpR = http;
      } else {
        this.httpR = new Http();
      } // end if then else is undefined http
    } // end if httpR undefined
  }; // end setHttp;

  self.setHttp();

  self.setContent = function() {
    self.content = dom.getById(self.contentId);
  }; // end self.setContent

  self.loadUrl = function(url, data) {
    return new RSPromise(
      function( resolve, reject ) {
        self.setContent();

        if (data === null || typeof date == "undefined" ) {
          data = new RSObject( data );
        } else if ( data.constructor.toString().contains("Object") ) {
          data = new RSObject( data );
        }  // end if data = object

        return self.httpR.post(
          url,
          data
        ).then(
          function( response ) {
            var template = String(response.data);
            template = self.populateTemplate(template, data);
            self.content.innerHTML = template;
            dom.bindData();

            if (typeof resolve != "undefined") {
              resolve();
            } // end if fn
          } // end then
        ); // end post then
      } // end anonymous function RSPromise
    ); // end RSPromise
  }; // end function load

  self.loadTemplate = function(id, data) {
    if (data === null) {
      data = new RSObject( data );
    } else if ( data.constructor.toString().contains("Object") ) {
      data = new RSObject( data );
    }  // end if data = object

    var html = dom.getById(id).innerHTML;
    self.loadHTML(html, data);
    dom.bindData();
  }; // end function loadTemplate

  self.loadHTML = function(html, data) {
    self.setContent();
    html = self.populateTemplate(html, data);
    self.content.innerHTML = html;
    dom.bindData();
  }; // end function load

  self.populateElement = function( el, data ) {
    if (typeof data != "undefined" && data !== null) {
      if (typeof data.length != "undefined") {
        var result = [];
        var fEach = function(item, index, collection) {
          result.push(self.populateElement(el, item));
        }; // end fEach
        data.forEach(fEach);
        return result;
      } else {
        if (data !== null) {
          data = new RSObject(data);
          var copyEl = el.cloneNode(true);
          copyEl.dataItem = data;
          var bindedElements = copyEl.querySelectorAll("[data-bind]");
          bindedElements.forEach(
            function( element ) {
              var dataBind = element.getAttribute( "data-bind" );
              var nodeName = element.nodeName.toLowerCase();
              if ( nodeName == "div" || nodeName == "span" ) {
                element.innerHTML = data[dataBind];
              } // end if nodeName div or span
            } // end anonymous forEach
          ); // end forEach
          return copyEl;
        } // end if data not null
      } // end if data length undefined
    } // end if data not undefined
  }; // end populateElement

  self.populateTemplate = function(template, data) {
    if (typeof data != "undefined" && data !== null) {
      if (typeof data.length != "undefined") {
        var result = "";
        var fEach = function(item, index, collection) {
          result += self.populateTemplate(template, item);
        }; // end fEach
        data.forEach(fEach);
        return result;
      } else {
        if (data !== null) {
          data = new RSObject(data);
          var jsonString = JSON.stringify(data);
          jsonString = jsonString.encodeUri();
          template = template.replaceAll("$itemJson", jsonString);

          var fn = function(value, key, obj) {
            var find = "$" + key;
            template = template.replaceAll(find, value);
          }; // end function fn (forEach)

          data.forEach(fn);
        } // end if data not null
      }
    } // end if data not undefined

    var reg = new RegExp("\\$[a-zA-Z0-9]+", "gi");
    var variables = template.match(reg);

    var fnEach = function(item, index, collection) {
      var varName = item.replace("$", "");
      if (typeof window[varName] != "undefined") {
        template = template.replaceAll(item, window[varName]);
      } // end fi window[varName]
    }; // end function

    if (variables !== null) {
      variables.forEach(fnEach);
    } // end if variables

    return template;
  }; // end function populateTemplate
} // end class View
