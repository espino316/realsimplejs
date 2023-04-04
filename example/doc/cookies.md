## RS.Cookies

An object containing functions for working with cookies.

### RS.Cookies.get(name)

Gets a cookie by name.

- `name` (string): The name of the cookie to get.

Returns an object with a `name` and `value` property, or an array of all cookies if `name` is undefined. Returns `null` if no cookie with the specified name is found.

### RS.Cookies.set(name, value, days)

Sets a cookie with the given name, value, and expiration time.

- `name` (string): The name of the cookie to set.
- `value` (string): The value of the cookie.
- `days` (number, optional): The number of days until the cookie expires. Defaults to one hour.

### RS.Cookies.delete(name)

Deletes a cookie with the given name.

- `name` (string): The name of the cookie to delete.

Returns `null` if no cookie with the specified name is found.