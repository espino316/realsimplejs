RS.Store = function(state) {

    var self = this;
    var logs = [];

    const RESET = 'RESET';
    const ADD = 'ADD';
    const UPDATE = 'UPDATE';
    const DELETE = 'DELETE';

    if (!state) {
        state = [];
    } // end if not state

    self.reset = function() {

        state = [];

        //  log reset
        logs.push({event: RESET, id: null, timestamp: Date.now(), state});
    }; // end function reset
    
    self.add = function(storeItem) {

        //  handle the id
        if (!storeItem.id) {
            storeItem.id = 1;
        } // end if not store item id

        //  add to collection
        state.push(storeItem);

        //  log adding
        logs.push({event: ADD, id: null, timestamp: Date.now(), storeItem});

    }; // end add

    self.update = function(id, storeItem) {

        //  log updating

    }; // end update

    self.delete = function(id) {

        //  log deleting

    }; // end delete

    self.get = function(id) {

    }; // end get
}; // end Store