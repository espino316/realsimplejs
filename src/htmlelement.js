RS.HTMLElement = function(elem) {

  var self = this;

  elem.hide = function() {
    elem.style.display = "none";
  }; // end HTML element hide

  elem.show = function() {
    elem.style.display = "block";
  }; // end HTML element hide

  elem.hasClass = function(className) {
    var rgx = new RegExp("(\\s|^)" + className + "(\\s|$)");
    var match = elem.className.match(rgx);
    return match !== null;
  };

  elem.addClass = function(className) {
    if (!elem.hasClass(className)) {
      elem.className += " " + className;
    }
  };

  elem.removeClass = function(className) {
    if (elem.hasClass(className)) {
      var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
      elem.className = elem.className.replace(reg, " ");
    }
  };

  elem.addText = function(text) {
    var t = document.createTextNode(text); // Create a text node
    elem.appendChild(t);
  }; // end function addText

  elem.clear = function() {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }; // end function clear

  elem.animate = function(options) {

    var element = elem;
    var style = new RS.CssStyle();
    var animateClass = new RS.CssRule("animateclass" + options.name);

    animateClass.addProperty("-webkit-animation-name", options.name);
    animateClass.addProperty("-webkit-animation-duration", options.duration);
    animateClass.addProperty("animation-name", options.name);
    animateClass.addProperty("animation-duration", options.duration);
    animateClass.addProperty("animation-fill-mode", "forwards");
    animateClass.addProperty("-webkit-animation-fill-mode", "forwards");
    style.addClass(animateClass);

    var animateFrames = new CssAnimation(options.name);
    var keys = Object.keys(options.from);
    var i = 0;

    for (i = 0; i < keys.length; i++) {
      animateFrames.from.addProperty(keys[i], options.from[keys[i]]);
    } // end for

    keys = Object.keys(options.to);
    i = 0;

    for (i = 0; i < keys.length; i++) {
      animateFrames.to.addProperty(keys[i], options.to[keys[i]]);
    } // end for

    style.addClass(animateFrames);
    style.setStyle();
    element.removeClass(animateClass.className);
    void element.offsetWidth;
    element.addClass(animateClass.className);

  }; // end animate

  /* Overload HTMLElmenet with view behavior */
  elem.loadUrl = function(url, data, callback) {
    var self = this;
    if (typeof self.id == "undefined") {
      self.id = "htmlelement_" + RS.String.UUID();
    } // end if id undefined

    if (typeof self.view == "undefined") {
      self.view = new View(self.id);
    } // end if view undefined

    self.view.loadUrl(url, data, callback);
  }; // end function HTMLElement.loadUrl

  elem.loadTemplate = function(id, data) {
    var self = this;
    if (typeof self.id == "undefined") {
      self.id = "htmlelement_" + RS.String.UUID();
    } // end if id undefined

    if (typeof self.view == "undefined") {
      self.view = new View(self.id);
    } // end if view undefined

    self.view.loadTemplate(id, data);
  }; // end function HTMLElement.loadTemplate

  elem.loadHTML = function(html, data) {
    var self = this;
    if (typeof self.id == "undefined") {
      self.id = "htmlelement" + rand();
    } // end if id undefined

    if (typeof self.view == "undefined") {
      self.view = new View(self.id);
    } // end if view undefined

    self.view.loadHTML(html, data);
  }; // end function HTMLElement.loadTemplate

  return elem;
};
