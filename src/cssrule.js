/**
 * Dependencies: overrides.js
 *
 * @return {undefined}
 */
RS.CssRule = function (ruleName) {
  this.ruleName = ruleName;
  this.properties = {};
}

RS.CssRule.prototype.ruleName = "";

RS.CssRule.prototype.addProperty = function(propertyName, propertyValue) {
  this.properties[propertyName] = propertyValue;
};

RS.CssRule.prototype.toString = function() {
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
