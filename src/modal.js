/**
 * Handles the modal
 */
function Modal() {
  var self = this;
  var dom = new Dom();
  var http = new Http();

  var divModal = dom.getById("modal");
  var divModalContent = dom.getById("modalContent");

  self.getContainer = function() {
    return divModal;
  };

  var fnLoadModal = function() {
    if (divModal === null) {
      divModal = dom.create("div");
      divModal.id = "modal";
      divModal.addClass("modal");
    } // end if divModal

    if (divModalContent === null) {
      divModalContent = dom.create("div");
      divModalContent.id = "modalContent";
      divModalContent.addClass("modalContent");
      divModal.appendChild(divModalContent);
    } // end divModalContent

    if (dom.getById("modal") === null) {
      var body = dom.get("body");
      body.appendChild(divModal);
    } // end if modal not in body
  }; // end fnLoadModal

  rs.onReady(fnLoadModal);

  self.showUrl = function(url, data) {
    divModalContent.style.width = "70%";
    divModalContent.style.height = "70vh";
    divModalContent.style.marginTop = "20vh";
    divModalContent.clear();
    var view = new View("modalContent");
    if (typeof data != "undefined") {
      view.loadUrl(url, data);
    } else {
      view.loadUrl(url);
    } // end if data
    divModal.style.display = "block";

    http.post(
      url,
      null,
      function(response) {
        var view;
        var temp = "";
        if (typeof data != "undefined") {
          view = new View();
          temp = view.populateTemplate(response.data, data);
        } else {
          temp = response.data;
        } // end if then else data undefined
        divModalContent.innerHTML = temp;
        divModal.style.display = "block";
      } // end anonymous response
    );
  }; // end showUrl

  self.showTemplate = function(templateId, data) {
    divModalContent.style.width = "70%";
    divModalContent.style.height = "70vh";
    divModalContent.style.marginTop = "20vh";
    divModalContent.clear();
    var template = dom.getById(templateId);
    var temp = "";
    if (typeof data != "undefined") {
      var view = new View();
      temp = view.populateTemplate(template.innerHTML, data);
    } else {
      temp = template.innerHTML;
    }
    divModalContent.innerHTML = temp;
    divModal.style.display = "block";
  }; // end function showTemplate

  self.showInfo = function(title, message, buttonText) {}; // end function showInfo

  self.showWait = function(message) {
    divModalContent.style.width = "50%";
    divModalContent.style.height = "25vh";
    divModalContent.style.marginTop = "25vh";
    divModalContent.clear();

    if (typeof message == "undefined") {
      message = "Espere, por favor";
    } // end if typeof message

    var txt = document.createTextNode(message);
    divModalContent.appendChild(txt);
    divModal.style.display = "block";
  }; // end function showWait

  self.hide = function() {
    divModal.style.display = "none";
    divModalContent.clear();
  }; // end function hide
} // end function Modal
