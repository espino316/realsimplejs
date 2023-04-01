/**
 * Dependencies: overrides.js
 *
 * @return {undefined}
 */
RS.CssStyle = function() {}

RS.CssStyle.prototype.classes = [];

RS.CssStyle.prototype.addClass = function(cssClass) {
  this.classes.push(cssClass);
};

RS.CssStyle.prototype.toString = function() {
  var len = this.classes.length;
  var i;
  var css = "";
  for (i = 0; i < len; i++) {
    css += this.classes[i].toString() + "\n\n";
  }
  return css;
};

RS.CssStyle.prototype.setStyle = function() {
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = this.toString();
  document.getElementsByTagName("head")[0].appendChild(style);
}; // end setStyle
