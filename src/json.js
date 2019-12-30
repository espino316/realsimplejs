RS.JSON = function() {

  var self = this;

  self.tryParse = function(str, out) {
    try {
      out.data = JSON.parse(str);
      return true;
    } catch (ex) {
      return false;
    } // end try catch
  }; // end JSON.tryParse
}; // end function RS JSON
