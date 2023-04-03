RS.Math = function() {
  var self = this;
  self.isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }; // end function isNumeric
};