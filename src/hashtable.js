/**
 * This is a hashtable implementation.
 * @returns an object containing functions for working with a hashtable.
 */
RS.Hashtable = () => {
  // create the hashtable
  let table = {};

  /**
   * Hashes the given key and returns the index in the table.
   * @param {str} key 
   * @returns 
   */
  const hashFunction = key => {
    let hash = 0;
    if (key.length === 0) return hash;

    // for every character in the key
    for (let i = 0; i < key.length; i++) {
      // get the character code
      const char = key.charCodeAt(i);
      // multiply the hash by 31 and add the character code
      hash = ((hash << 5) - hash) + char;
      // Convert to 32bit integer
      hash = hash & hash;
    } // end for
    
    return hash;
  }; // end function hashFunction

  /**
   * Inserts a key/value pair into the hashtable.
   * @param {string} key 
   * @param {object} value 
   */
  const insert = (key, value) => {
    // handle collisions
    const hash = hashFunction(key);
    if (!table[hash]) {
      table[hash] = [];
    } else {
      table[hash].push({ key, value });
    } // end if
  }; // end function insert

  /**
   * Returns the value associated with the given key.
   * @param {string} key 
   * @returns 
   */
  const get = key => {
    const hash = hashFunction(key);

    if (!table[hash]) {
      return undefined;
    } else if (table[hash].length === 1) {
      return table[hash][0].value;
    } else {
      for (let i = 0; i < table[hash].length; i++) {
        if (table[hash][i].key === key) {
          return table[hash][i].value;
        } // end if
      } // end for
    } // end if
  }; // end function get

  /**
   * Removes the key/value pair from the hashtable.
   * @param {string} key 
   */
  const remove = key => {
    const hash = hashFunction(key);
    if (table[hash]) {
      delete table[hash];
    }
  }; // end function remove

  /**
   * Returns an array of all keys in the hashtable.
   * @memberof RS.Hashtable
   * @returns {Array} - An array of all keys in the hashtable.
   * @example
   * ht.keys(); // returns ['key1', 'key2', 'key3']
   */
  const keys = () => {
    return Object.keys(table);
  };

  // return public methods
  return { insert, get, remove, keys };
} // end function Hashtable