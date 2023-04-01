RS.ActivityConfig = {
  containerId: "",
  url: ""
};

RS.Activity = function( config ) {

  var self = this;
  self.containerId = config.containerId;
  self.url = config.url;
  var view = new RS.View(self.containerId);

  var animationActivityLeft = {
    name: "animationActivityLeft",
    duration: "300ms",
    from: {
      left: "-100%"
    },
    to: {
      left: "0"
    }
  };

  var animationActivityRight = {
    name: "animationActivityRight",
    duration: "300ms",
    from: {
      left: "0"
    },
    to: {
      left: "-100%"
    }
  };

  self.hide = function() {
    if ( view.content === null ) {
      view = new RS.View(self.containerId);
    }
    view.content.removeClass("animateclassanimationActivityLeft");
    view.content.addClass("animateclassanimationActivityRight");
  }; // end function hide

  self.load = function(data) {
    if ( view.content === null ) {
      view = new View(self.containerId);
    }

    if ( typeof data == "undefined" ) {
      data = null;
    } // end if undefined

    view.loadUrl(
      self.url,
      data,
      function() {
        view.content.removeClass("animateclassanimationActivityRight");
        view.content.addClass("animateclassanimationActivityLeft");
      } // end anonymous function
    ); // end loadUrl
  }; // end showActivity
}; // end activity
