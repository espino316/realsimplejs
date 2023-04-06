RS.Array = function(data) {

  if (!data) {
    data = [];
  } // end if not arr

  const unique = () => {
    const hashTable = {};
    const uniqueValues = [];
  
    for (let i = 0; i < data.length; i++) {
      const currentValue = data[i];
      if (!hashTable[currentValue]) {
        hashTable[currentValue] = true;
        uniqueValues.push(currentValue);
      }
    }
  
    return uniqueValues;
  }

  const encodeUri = () => {
    let str = JSON.stringify(data);
    return encodeURIComponent(str);
  };

  const where = (property, value) => {
    let result = [];
    result = data.filter(obj => obj[property] == value);
    return new RS.Array(result);
  }; // end function where
  
  const andWhere = (property, value) =>{
    return where(property, value);
  }; // end function where

  const first = () => {
    return new RS.Array(data[0]);
  }; // end function first

  const last = () => {
    return new RS.Array(data[data.length - 1]);
  }; // end function last

  const like = (property, value) => {
    return new RS.Array(data.filter(obj => String(obj[property]).contains(value)));
  }; // end function where

  const andLike = (property, value) => {
    return like(property, value);
  }; // end function where

  const indexOfProperty = function(property, value) {
    return data.indexOf(data.where(property, value)[0]);
  }; // end function where

  /**
   * Sorts an array of objects by propery, ascending
   *
   * @param {String} property
   *
   * @return Array
   */
  const sortAsc = property => {

    if (data.length === 0) {
      console.warn("No data to sort", data, property);
      return;
    } // end if length 0

    let row = data[0];

    if (typeof row[property] == "undefined") {
      console.error(property + " no part of object.", data);
    } // end if property undefined

    //  Stores the filter in a global variable
    window.__tempFilter = property;

    /**
     * Gets the value, if is numeric, return number data
     */
    let getValue = function(v) {
      if (RS.Math.isNumeric(v)) {
        return v * 1;
      } // end if isNumeric
      return v;
    }; // end function getValue

    let compareAscNumber = function(a, b) {
      let filter = window.__tempFilter;
      let _a = a[filter];
      let _b = b[filter];
      let _c = getValue(_a) - getValue(_b);
      return _c;
    }; // end function compareAscNumber

    let compareAsc = function(a, b) {
      let filter = window.__tempFilter;
      let _a = a[filter];
      let _b = b[filter];
      let _c = _a.localeCompare(_b);
      return _c;
    }; // end function compareAsc

    //  If not numeric, sort by key
    if (RS.Math.isNumeric(row[property])) {
      return data.sort(compareAscNumber);
    } else {
      return data.sort(compareAsc);
    } // end if not is numeric
  }; // end function Array Sort Asc

  /**
   * Sorts an array of objects by propery, descending
   *
   * @param {String} property
   *
   * @return Array
   */
  const sortDesc = property => {

    if (data.length === 0) {
      console.warn("No data to sort", data, property);
      return;
    } // end if length 0

    let row = data[0];

    if (typeof row[property] == "undefined") {
      console.error(property + " no part of object.", data);
    } // end if property undefined

    window.__tempFilter = property;

    let getValue = function(v) {
      if (RS.Math.isNumeric(v)) {
        return v * 1;
      }
      return v;
    }; // end function getValue

    let compareDescNumber = function(a, b) {
      let filter = window.__tempFilter;
      let _a = a[filter];
      let _b = b[filter];
      let _c = getValue(_b) - getValue(_a);
      return _c;
    }; // end function compareDesc

    let compareDesc = function(a, b) {
      let filter = window.__tempFilter;
      let _a = a[filter];
      let _b = b[filter];
      let _c = _b.localeCompare(_a);
      return _c;
    }; // end function compareAsc

    //  If not numeric, sort by key
    if (RS.Math.isNumeric(row[property])) {
      return data.sort(compareDescNumber);
    } else {
      return data.sort(compareDesc);
    } // end if not is numeric
  }; // end function Array Sort Desc

  /**
   * Sum the property "prop" in array of objects
   *
   * @param {String} property The property to sum
   *
   * @return Number
   */
  const sum = function( property ) {
    
    if ( data.length === 0 ) {
      return 0;
    } // end if

    if ( typeof data[0] != "object" ) {
      console.error( "Items are not objects" );
      return;
    } // end if not object

    if ( ! data[0].hasOwnProperty( property ) ) {
      console.error( "Items does not have a " + property +  " property." );
      return;
    } // end if not prop

    let sum = 0;
    data.forEach(
      function( item ) {
        sum += Number(item[property]);
      } // end anonymous forEach
    ); // end forEach

    return sum;
  }; // end Array.sum

  const getData = () => {
    return data;
  }; // end function getData

  return { 
    unique, encodeUri, where, andWhere, first, last, like, andLike, indexOfProperty,
    sortAsc, sortDesc, sum, getData
  };
}; // end RS Array