RS.Store = function(initialState) {

    const logs = [];
    const RESET = 'RESET';
    const ADD = 'ADD';
    const UPDATE = 'UPDATE';
    const REMOVE = 'REMOVE';

    let state = Object.freeze(initialState || []);

    const addLog = (event, id, item) => {
        logs.push({event, id, item, timestamp: Date.now()});
    }; // end private function addLog

    const reset = () => {

        state = Object.freeze([]);

        //  log reset
        addLog(RESET, null, state);
    }; // end function reset
    
    const add = (item) => {

        if (!item || typeof item !== "object") {
            throw new Error("Item must be an object.");
          }

        //  handle the id
        if (!item.id) {
            item.id = Math.max(...state.map(item => item.id), 0) + 1;
        } else if (state.find((i) => i.id === item.id)) {
            throw new Error(`An item with id '${item.id}' already exists.`); 
        } // end if not store item id

        const newState = [...state, item];
        state = Object.freeze(newState);

        //  log adding
        addLog(ADD, item.id, item);
    }; // end add

    const update = (id, item) => {

        if (!item || typeof item !== "object") {
            throw new Error("Item must be an object.");
        }

        if (item.id !== id) {
            throw new Error(`Item id '${item.id}' does not match id '${id}'.`);
        }

        const index = state.findIndex((i) => i.id === id);

        if (index === -1) {
            throw new Error(`Item with id '${id}' not found.`);
        }

        const newState = [...state];
        newState[index] = item;
        state = Object.freeze(newState);
        addLog(UPDATE, id, item);

    }; // end update

    const remove = (id) => {

        const index = state.findIndex((i) => i.id === id);

        if (index === -1) {
            throw new Error(`Item with id '${id}' not found.`);
        }

        const newState = [...state.slice(0, index), ...state.slice(index + 1)];
        state = Object.freeze(newState);
        addLog(REMOVE, id, id);
    }; // end delete

    const getById = (id) => {

        if (!id) {
            return state;
        } // end if not id

        return state.find(item => item.id === id) || null;
    }; // end get by id

    const getAll = () => {
        return state;
    }; // end get all

    const filter = (filterFn) => {
        return state.filter(filterFn);
    };

    const addMethod = (methodName, methodFunction) => {

        this[methodName] = methodFunction;
    }; // end function add method

    const getLog = () => {
        return logs;
    }; // end function show logs

    return {
        add, update, remove, getById, getAll, filter, reset, addMethod, getLog
    } // end return
}; // end Store