/**
 * An object containing functions for working with cookies.
 * @namespace RS.Cookies
 */
RS.Cookies = {} // end function cookieHelper

/**
 * Gets a cookie by name.
 * @function get
 * @memberof RS.Cookies
 * @param {string} name - The name of the cookie to get.
 * @returns {Object|null} - The cookie object with a `name` and `value` property, or an array of all cookies if `name` is undefined. Returns null if no cookie with the specified name is found.
 */
RS.Cookies.get = (name) => {
  if (!document.cookie) {
    return null;
  }

  const cookies = document.cookie.split(';');

  const result = [];
  let isFound = false;
  let itemResult = null;

  const fnEach = (value) => {
    const [cookieName, cookieValue] = value.split('=');
    if (!cookieName) {
      return;
    }

    const item = { name: cookieName, value: cookieValue };

    if (name !== undefined) {
      if (name === item.name) {
        itemResult = item;
        isFound = true;
        return;
      }
    } else {
      result.push(item);
    }
  };

  cookies.forEach(fnEach);

  if (isFound) {
    return itemResult;
  } else if (name !== undefined) {
    return null;
  } else {
    return result;
  }
};

/**
 * Sets a cookie with the given name, value, and expiration time.
 * @function set
 * @memberof RS.Cookies
 * @param {string} name - The name of the cookie to set.
 * @param {string} value - The value of the cookie.
 * @param {number} [days=1/24] - The number of days until the cookie expires. Defaults to one hour.
 */
RS.Cookies.set = function(name, value, days) {
  if (!days) {
    days = 1/24;
  }

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  const expiresAt = `expires=${date.toUTCString()}`;
  const cookie = `${name}=${value}; ${expiresAt}; SameSite=Strict; Secure`;
  document.cookie = cookie;
};

/**
 * Deletes a cookie with the given name.
 * @function delete
 * @memberof RS.Cookies
 * @param {string} name - The name of the cookie to delete.
 * @returns {null} - Returns null if no cookie with the specified name is found.
 */
RS.Cookies.delete = function(name) {
  const cookies = RS.Cookies.get(name);

  if (cookies === null) {
    return null;
  }

  const fnDelete = (name) => {
    const expiresAt = "Thu, 01 Jan 1970 00:00:01 GMT";
    const cookie = `${name}=0; expires=${expiresAt}; path=/; SameSite=Strict; Secure`;
    document.cookie = cookie;
  };

  if (cookies.length !== undefined && cookies.length > 0) {
    cookies.forEach(cookie => fnDelete(cookie.name));
  } else {
    fnDelete(name);
  }
};