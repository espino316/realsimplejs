RS.Store = function(state) {

    var self = this;
    var logs = [];

    const RESET = 'RESET';
    const ADD = 'ADD';
    const UPDATE = 'UPDATE';
    const DELETE = 'DELETE';

    state = new RS.Array(state);

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

        //  get the item
        //  perform the update
        let index = state.indexOf("id", id);

        if (index !== -1) {
            state.splice(index, storeItem);
        } // end if index

        //  log updating
        logs.push({event: UPDATE, id: null, timestamp: Date.now(), storeItem});

    }; // end update

    self.delete = function(id) {

        //  get the item
        //  perform the update
        let index = state.indexOf("id", id);

        if (index !== -1) {
            state.splice(index);
        } // end if index

        //  log deleting
        logs.push({event: DELETE, id: null, timestamp: Date.now(), id});

    }; // end delete

    self.get = function(id) {

        if (!id) {
            return state;
        } // end if not id
        
        let index = state.indexOf("id", id);
        return state[index];

    }; // end get

    self.addMethod = function(methodName, methodFunction) {

        self[methodName] = methodFunction;
    }; // end function add method
}; // end Store