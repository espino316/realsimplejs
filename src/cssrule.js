"use strict";
define(
  [],
  function () {
    function CssRule(ruleName) {
      this.ruleName = ruleName;
      this.properties = {};
    }

    CssRule.prototype.ruleName = "";

    CssRule.prototype.addProperty = function(propertyName, propertyValue) {
      var self = this;
      self.properties[propertyName] = propertyValue;
    };

    CssRule.prototype.toString = function() {
      var css = "." + this.ruleName + " {\n";
      var keys = Object.keys(this.properties);
      var len = keys.length;
      var i = 0;
      for (i = 0; i < len; i++) {
        css += keys[i] + ": " + this.properties[keys[i]] + ";";
        css += "\n";
      }
      css += "}";
      return css;
    };

    return CssRule;
  } // end anonymous function define
); // end define
