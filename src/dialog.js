/*
::Dialog.js::
Functions for modal dialogs
Dependencies
  Cordova
 */
function Dialog() {
  this.showAlert = function(msg, title, buttonText) {
    if (typeof navigator.notification == "undefined") {
      alert(msg);
    } else {
      navigator.notification.alert(
        msg, // message
        null, // callback: Do nothing, just message
        title, // title
        buttonText // buttonName
      );
    }
  };

  this.showConfirm = function(msg, onConfirm) {
    if (navigator.notification === null) {
      var result = confirm(msg);
      if (result) {
        onConfirm(1);
      } else {
        onConfirm(2);
      }
    } else {
      navigator.notification.confirm(
        msg, // message
        onConfirm, // callback to invoke with index of button pressed
        "Confirmar", // title
        ["Si", "No"] // buttonLabels
      );
    }
  };
} // end function Dialog

window.dlg = new Dialog();
