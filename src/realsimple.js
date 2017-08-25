define(
  [
    "rs",
    "watcher",
    "dialog",
    "dom",
    "local",
    "geo",
    "http",
    "datehelper",
    "view",
    "cookiehelper",
    "modal"
  ],
  function(
    RS,
    Watcher,
    Dialog,
    Dom,
    Local,
    Geo,
    Http,
    DateHelper,
    View,
    CookieHelper,
    Modal
  ){
    "use strict";

    /* Overload HTMLElmenet with view behavior */
    HTMLElement.prototype.loadUrl = function(url, data, callback) {
      var self = this;
      if (typeof self.id == "undefined") {
        self.id = "htmlelement_" + "".UUID();
      } // end if id undefined

      if (typeof self.view == "undefined") {
        self.view = new View(self.id);
      } // end if view undefined

      self.view.loadUrl(url, data, callback);
    }; // end function HTMLElement.loadUrl

    HTMLElement.prototype.loadTemplate = function(id, data) {
      var self = this;
      if (typeof self.id == "undefined") {
        self.id = "htmlelement_" + "".UUID();
      } // end if id undefined

      if (typeof self.view == "undefined") {
        self.view = new View(self.id);
      } // end if view undefined

      self.view.loadTemplate(id, data);
    }; // end function HTMLElement.loadTemplate

    HTMLElement.prototype.loadHTML = function(html, data) {
      var self = this;
      if (typeof self.id == "undefined") {
        self.id = "htmlelement" + rand();
      } // end if id undefined

      if (typeof self.view == "undefined") {
        self.view = new View(self.id);
      } // end if view undefined

      self.view.loadHTML(html, data);
    }; // end function HTMLElement.loadTemplate

    window.rs = new RS();
    rs.object = new RSObject();
    window.watcher = new Watcher();
    window.dlg = new Dialog();
    window.dom = new Dom();
    window.local = new Local();
    window.geo = new Geo();
    window.http = new Http();
    window.date = new DateHelper();
    window.cookies = new CookieHelper();
    window.modal = new Modal();
    window.View = View;
    window.View.populateTemplate = new View().populateTemplate;
  } // end function anonymous define function
); // end define
  /* Overrides */
  /*
(function(){
    var oldLog = console.log;
    console.log = function (message) {
        // DO MESSAGE HERE.
        oldLog.apply(console, arguments);
    };
})();
*/
