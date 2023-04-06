# RS.Hashtable
This function returns an object containing functions for working with a hashtable.
## Usage
```js
const  ht = RS.Hashtable();
```
## Methods
### `insert(key: string, value: object): void`

This method inserts a new key/value pair into the hashtable. If there's a collision, it creates an array of objects for the same hash key. 

#### Parameters
- `key` (type: string): The key for the key/value pair.
- `value` (type: object): The value for the key/value pair.

#### Returns
- This method does not return anything.

#### Example
```js
ht.insert('name', 'John');
ht.insert('age', 30);
ht.insert('name', 'Mary');

```

### get
Returns the value associated with the given key.

```js
ht.get(key);
```
#### Parameters:
* key - a string representing the key

#### Returns:
* The value associated with the key

### remove
Removes the key/value pair from the hashtable.
```js
ht.remove(key);
```
#### Parameters:
* key - a string representing the key

### keys
Returns an array of all keys in the hashtable.
```js
ht.keys();
```
#### Returns:
an array of all keys in the hashtable
#### Example
```js
const  ht = RS.Hashtable();
ht.insert("foo", 123);
ht.insert("bar", "abc");
ht.get("foo"); // returns 123
ht.keys(); // returns ["foo", "bar"]
```