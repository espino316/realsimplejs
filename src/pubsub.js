define(
  [],
  function() {
    function PubSub() {
      var self = this;
      self.channels = {},

      self.subscribe = function(channel, onPublish) {
        if( !this.channels[channel]) {
          this.channels[channel] = [];
        } // end if not channel

        this.channels[channel].push(onPublish);
      }; // end subscribe

      self.publish = function(channel, data) {
        if( !this.channels[channel] ||
            this.channels[channel].length < 1
        ) {
          return;
        } // end if not channel

        this.channels[channel].forEach(
          function(onPublish) {
            onPublish(data || {});
          } // end foreach anonymous function
        ); // end forEach
      }; // end self publish
    }; // end PubSub

    return PubSub;
  }; // end anonymous define
); // end define
