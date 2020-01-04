RS.Controllers.HomeController = function ( data ) {

  var self = this;

  this.title = "Modules";

  this.modules = [{
    name: "Module 1",
    description: "Some description"
  }, {
    name: "Module 2",
    description: "Some other description"
  }];

  this.showAlert = function (message) {
    alert(message);
  }; // end function showAlert
}; // end function RS.Controllers.HomeController
