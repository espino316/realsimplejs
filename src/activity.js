RS.ActivityConfig = {
  containerId: "",
  url: ""
};

RS.Activity = config => {

  let self = this;
  const containerId = config.containerId;
  const url = config.url;
  let view = new RS.View(containerId);

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

  const hide = () => {
    if ( view.content === null ) {
      view = new RS.View(containerId);
    }
    view.content.removeClass("animateclassanimationActivityLeft");
    view.content.addClass("animateclassanimationActivityRight");
  }; // end function hide

  const load = data => {
    if ( view.content === null ) {
      view = new View(containerId);
    }

    if ( typeof data == "undefined" ) {
      data = null;
    } // end if undefined

    view.loadUrl(
      url,
      data,
      () => {
        view.content.removeClass("animateclassanimationActivityRight");
        view.content.addClass("animateclassanimationActivityLeft");
      } // end anonymous function
    ); // end loadUrl
  }; // end showActivity

  // return public methods
  return {
    hide,
    load
  };
}; // end activity
