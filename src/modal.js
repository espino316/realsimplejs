/**
 * Handles the modal
 */
RS.Modal = function() {
  var self = this;
  var divModal = dom.getById("modalContainer");
  var divModalContent = dom.getById("modalContent");
  var divTitle, divMessage, divButton, divClose;

  self.getContainer = function() {
    return divModal;
  };

  var fnLoadModal = function() {
    if (divModal === null) {
      divModal = dom.create("div");
      divModal.id = "modalContainer";
      divModal.addClass("modal");
    } // end if divModal

    if (divModalContent === null) {
      divModalContent = dom.create("div");
      divModalContent.id = "modalContent";
      divModalContent.addClass("modalContent");
      divModal.appendChild(divModalContent);
    } // end divModalContent

    if (dom.getById("modalContainer") === null) {
      var body = dom.get("body");
      body.appendChild(divModal);
    } // end if modal not in body
  }; // end fnLoadModal

  rs.onReady(fnLoadModal);

  var self = this;

  self.showUrl = function(url, data) {
    if (divModal === null) {
      fnLoadModal();
    } // end if divModal is null
    divModalContent.style.width = "70%";
    divModalContent.style.height = "70vh";
    divModalContent.style.marginTop = "20vh";
    divModalContent.clear();
    var view = new View("modalContent");
    if (typeof data != "undefined" && data !== null) {
      view.loadUrl(url, data);
    } else {
      view.loadUrl(url);
    } // end if data
    divModal.style.display = "block";
  }; // end showUrl

  self.showTemplate = function(templateId, data) {
    if (divModal === null) {
      fnLoadModal();
    } // end if divModal is null
    divModalContent.style.width = "70%";
    divModalContent.style.height = "70vh";
    divModalContent.style.marginTop = "20vh";
    divModalContent.style.padding = "1vh";
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

  self.showInfo = function(message, title, buttonText) {
    if (divModal === null) {
      fnLoadModal();
    } // end if divModal is null

    if (typeof title == "undefined") {
      title = "Info";
    } // end if title undefined

    if (typeof buttonText == "undefined") {
      buttonText = "Ok";
    } // end if buttonText undefined

    divModalContent.style.width = "80%";
    divModalContent.style.height = "40%";
    divModalContent.style.marginTop = "40%";
    divModalContent.style.padding = "10px";
    divModalContent.clear();

    divTitle = dom.create("div");
    divTitle.style.height = "25%";
    divTitle.style.width = "100%";
    divTitle.style.float = "left";
    divTitle.innerHTML = title;

    divMessage = dom.create("div");
    divMessage.style.height = "50%";
    divMessage.style.width = "100%";
    divMessage.style.float = "left";
    divMessage.innerHTML = message;

    divButton = dom.create("div");
    divButton.style.height = "25%";
    divButton.style.width = "50%";
    divButton.style.float = "right";
    divButton.addClass("button");
    divButton.addClass("go");
    divButton.onclick = function() {
      self.hide();
    }; // end onclick
    divButton.innerHTML = buttonText;

    divModalContent.appendChild(divTitle);
    divModalContent.appendChild(divMessage);
    divModalContent.appendChild(divButton);

    divModal.style.display = "block";
  }; // end function showInfo

  self.showWait = function(message) {
    if (divModal === null) {
      fnLoadModal();
    } // end if divModal is null

    divModalContent.style.width = "80%";
    divModalContent.style.height = "20vh";
    divModalContent.style.marginTop = "40vh";
    divModalContent.style.padding = "4vh";
    divModalContent.clear();

    if (typeof message == "undefined") {
      message = "Espere, por favor";
    } // end if typeof message

    var txt = document.createTextNode(message);
    var img = document.createElement("img");
    img.src = "img/preloader.gif";
    img.style.width = "90%";
    img.style.marginLeft = "5%";
    img.style.float = "left";
    divModalContent.appendChild(txt);
    divModalContent.appendChild(document.createElement("br"));
    divModalContent.appendChild(document.createElement("br"));
    divModalContent.appendChild(img);
    divModal.style.display = "block";
  }; // end function showWait

  self.hide = function() {
    if (divModal === null) {
      fnLoadModal();
    } // end if divModal is null
    divModal.style.display = "none";
    divModalContent.clear();
  }; // end function hide

} // end function Modal

var modal = new Modal();
