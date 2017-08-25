"use strict";
define(
  [cssrule],
  function (CssRule) {
    function CssAnimation(name) {
      this.name = name;
      this.from = new CssRule("from");
      this.to = new CssRule("to");
    }

    CssAnimation.prototype.name = "";
    CssAnimation.prototype.from = null;
    CssAnimation.prototype.to = null;

    CssAnimation.prototype.toString = function() {
      var css = "@keyframes " + this.name + " {\n@from\n@to\n}";
      var cssFrom = this.from.toString();
      var cssTo = this.to.toString();
      cssFrom = cssFrom.replace(".from", "from");
      cssTo = cssTo.replace(".to", "to");
      css = css.replace("@from", cssFrom);
      css = css.replace("@to", cssTo);

      var wkcss = "@-webkit-keyframes " + this.name + " {\n@from\n@to\n}";
      wkcss = wkcss.replace("@from", cssFrom);
      wkcss = wkcss.replace("@to", cssTo);

      return css + "\n" + wkcss;
    }; // end prototype to string

    return CssAnimation;
  } // end anonymous function define
); // end define
