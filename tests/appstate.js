const RS = require('./RS.js');

describe('RS.AppState', () => {
  let appState;

  beforeEach(() => {
    appState = RS.AppState();
  });

  test('should be able to add and retrieve a store', () => {
    const storeName = 'testStore';
    const initialState = ['item1', 'item2'];
    const store = appState.createStore(storeName, initialState);
    expect(appState.getStore(storeName)).toEqual(store);
  });

  test('should throw an error when trying to add an invalid store', () => {
    expect(() => {
      appState.addStore('invalidStore', null);
    }).toThrow('Store must be an object.');
  });

  test('should be able to get all stores', () => {
    const store1 = appState.createStore('store1');
    const store2 = appState.createStore('store2');
    const allStores = appState.getAllStores();
    expect(allStores).toEqual({ store1, store2 });
  });
});
