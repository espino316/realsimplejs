/**
 * Watch variables and report changes
 */
RS.Watcher = function () {
  var self = this;
  this.collection = [];

  this.add = function(name, fn) {
    var item = {};
    item.name = name;
    item.currentValue = RS.returnValue(name);
    item.function = fn;
    this.collection.push(item);
  }; // end function add

  // The tick event
  var fn = function() {
    var fnEach = function(item, index, arr) {
      var val = rs.returnValue(item.name);

      if (val != item.currentValue) {
        // And here we reverse dom
        item.function(item.name);
        item.currentValue = val;
      }
    }; // end fnEach
    self.collection.forEach(fnEach);
  }; // end fn

  setInterval(fn, 200);
} // end function watcher
