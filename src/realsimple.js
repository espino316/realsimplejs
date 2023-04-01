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
