// this function manages the state of the app
// using the store.js functions
RS.AppState = () => {

    //  the store object
    let stores = {};

    // list of store changes log
    const storesLogs = [];

    // list of property changes log
    const propertiesLogs = [];

    // the events:
    const RESET = 'RESET';
    const ADD = 'ADD';
    const UPDATE = 'UPDATE';
    const REMOVE = 'REMOVE';
    const CREATE = 'CREATE';

    // add a store change log
    const addStoreLog = (storeName, event, store) => {
        // check if log is too long
        if (storesLogs.length > 100) {
            storesLogs.shift();
        } // end if log is too long
        storesLogs.push({ storeName, event, store, timestamp: Date.now() });
    }; // end function addStoreLog

    // return the store log
    const getStoreLog = () => {
        return [...storesLogs];
    }; // end function getStoreLog

    // add a property change log
    const addPropertyLog = (propertyName, event, property) => {
        
        // check if log is too long
        if (propertiesLogs.length > 100) {
            propertiesLogs.shift();
        } // end if log is too long

        propertiesLogs.push({ propertyName, event, property, timestamp: Date.now() });
    }; // end function addPropertyLog

    // return the property log
    const getPropertyLog = () => {
        return [...propertiesLogs];
    }; // end function getPropertyLog

    // add a store to the list
    // must be a RS.Store object
    const addStore = (name, store) => {

        if (!store || typeof store !== "object") {
            throw new Error("Store must be an object.");
        }

        stores[name] = store;

        // log adding
        addStoreLog(name, ADD, store);
    }; // end function addStore

    // create a store
    const createStore = (storeName, initialState = []) => {
        let store = new RS.Store(initialState);
        addStore(storeName, store);
        // log creating
        addStoreLog(storeName, CREATE, store);
        return store;
    }; // end function createStore

    // updates a store
    const updateStore = (storeName, store) => {

        if (!stores[storeName]) {
            throw new Error(`Store '${storeName}' not found.`);
        }
        stores[storeName] = store;

        // log updating
        addStoreLog(storeName, UPDATE, store);
    }; // end function updateStore

    // return a store by storeName
    const getStore = (storeName) => {
        return stores[storeName];
    }; // end function getStore

    // return all the stores
    const getAllStores = () => {
        return { ...stores };
    }; // end function getStores

    // remove a store
    const removeStore = (storeName) => {
        if (!stores[storeName]) {
            throw new Error(`Store '${storeName}' not found.`);
        }

        // log removing
        addStoreLog(storeName, REMOVE, stores[storeName]);

        delete stores[storeName];
    }; // end function removeStore

    Object.freeze(stores); // make stores object immutable

    // list of variable properties
    let properties = {};

    // add a property to the list
    const addProperty = (name, value) => {
        properties = Object.freeze({ ...properties, [name]: value });
        // log adding
        addPropertyLog(name, ADD, value);
    }; // end function addProperty

    // update a property
    const updateProperty = (name, value) => {
        if (!properties[name]) {
            throw new Error(`Property '${name}' not found.`);
        }
        properties = Object.freeze({ ...properties, [name]: value });
        // log updating
        addPropertyLog(name, UPDATE, value);
    }; // end function updateProperty

    const getProperty = (name) => {
        return properties[name];
    }; // end function getProperty

    const getAllProperties = () => {
        return { ...properties };
    }; // end function getAllProperties

    const removeProperty = (name) => {
        if (!properties[name]) {
            throw new Error(`Property '${name}' not found.`);
        }
        const { [name]: value, ...newProperties } = properties;
        properties = Object.freeze(newProperties);
        // log removing
        addPropertyLog(name, REMOVE, value);
    }; // end function removeProperty

    //  return the public functions
    return {
        addStore, createStore, getStore, getAllStores, removeStore, updateStore,
        addProperty, updateProperty, getProperty, getAllProperties, removeProperty,
        getStoreLog, getPropertyLog
    } // end return
}; // end class AppState