if (!Date.now) {
    Date.now = function() {
        return new Date().getTime();
    };
}

JSON.tryParse = function(str, out) {
    try {
        out.data = JSON.parse(str);
        return true;
    } catch (ex) {
        return false;
    }
};

var hiddenEscapeTextArea = document.createElement("textarea");

String.prototype.UUID = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
        return v.toString(16);
    });
};

String.prototype.escapeHTML = function() {
    var self = this;
    if (typeof hiddenEscapeTextArea == "undefined") {
        var hiddenEscapeTextArea = document.createElement("textarea");
    }
    hiddenEscapeTextArea.textContent = self;
    return hiddenEscapeTextArea.innerHTML;
};

String.prototype.unescapeHTML = function() {
    var self = this;
    if (typeof hiddenEscapeTextArea == "undefined") {
        var hiddenEscapeTextArea = document.createElement("textarea");
    }
    hiddenEscapeTextArea.innerHTML = self;
    return hiddenEscapeTextArea.textContent;
};

String.prototype.encodeUri = function() {
    return encodeURIComponent(this);
};

String.prototype.decodeUri = function() {
    return decodeURIComponent(this);
};

String.prototype.base64Encode = function() {
    var self = this;
    self = self.encodeUri();
    var fnReplace = function(match, p1) {
        return String.fromCharCode("0x" + p1);
    };
    self = self.replace(/%([0-9A-F]{2})/g, fnReplace);
    return btoa(self);
};

String.prototype.base64Decode = function() {
    var self = this;
    try {
        self = atob(self);
    } catch (ex) {
        console.error("No base 64 data");
        return;
    }
    var fnMap = function(item) {
        return "%" + ("00" + item.charCodeAt(0).toString(16)).slice(-2);
    };
    self = Array.prototype.map.call(self, fnMap);
    self = self.join("");
    self = self.decodeUri();
    return self;
};

String.prototype.escapeRegExp = function() {
    return this.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

String.prototype.replaceAll = function(find, replace) {
    return this.replace(new RegExp(find.escapeRegExp(), "g"), replace);
};

String.prototype.left = function(n) {
    if (n <= 0) {
        return "";
    } else if (n > this.length) {
        return this;
    } else {
        return this.substring(0, n);
    }
};

String.prototype.right = function(n) {
    if (n <= 0) {
        return "";
    } else if (n > this.length) {
        return this;
    } else {
        var iLen = this.length;
        return this.substring(iLen, iLen - n);
    }
};

String.prototype.contains = function(str) {
    return this.indexOf(str) > -1;
};

String.prototype.toHex = function() {
    var hex = "0x";
    var i;
    for (i = 0; i < this.length; i++) {
        hex += "" + this.charCodeAt(i).toString(16);
    }
    return hex;
};

String.prototype.fromHex = function(hex) {
    hex = hex.toString();
    var str = "";
    var i;
    for (i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
};

HTMLElement.prototype.hide = function() {
    this.style.display = "none";
};

HTMLElement.prototype.show = function() {
    this.style.display = "block";
};

HTMLElement.prototype.hasClass = function(className) {
    var rgx = new RegExp("(\\s|^)" + className + "(\\s|$)");
    var match = this.className.match(rgx);
    return match !== null;
};

HTMLElement.prototype.addClass = function(className) {
    if (!this.hasClass(className)) {
        this.className += " " + className;
    }
};

HTMLElement.prototype.removeClass = function(className) {
    if (this.hasClass(className)) {
        var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
        this.className = this.className.replace(reg, " ");
    }
};

HTMLElement.prototype.addText = function(text) {
    var t = document.createTextNode(text);
    this.appendChild(t);
};

HTMLElement.prototype.clear = function() {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
};

HTMLElement.prototype.animate = function(options) {
    var element = this;
    var style = new CssStyle();
    var animateClass = new CssRule("animateclass" + options.name);
    animateClass.addProperty("-webkit-animation-name", options.name);
    animateClass.addProperty("-webkit-animation-duration", options.duration);
    animateClass.addProperty("animation-name", options.name);
    animateClass.addProperty("animation-duration", options.duration);
    animateClass.addProperty("animation-fill-mode", "forwards");
    animateClass.addProperty("-webkit-animation-fill-mode", "forwards");
    style.addClass(animateClass);
    var animateFrames = new CssAnimation(options.name);
    var keys = Object.keys(options.from);
    var i = 0;
    for (i = 0; i < keys.length; i++) {
        animateFrames.from.addProperty(keys[i], options.from[keys[i]]);
    }
    keys = Object.keys(options.to);
    i = 0;
    for (i = 0; i < keys.length; i++) {
        animateFrames.to.addProperty(keys[i], options.to[keys[i]]);
    }
    style.addClass(animateFrames);
    style.setStyle();
    element.removeClass(animateClass.className);
    void element.offsetWidth;
    element.addClass(animateClass.className);
};

Math.isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

Array.prototype.getUnique = function() {
    var u = {}, a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
};

Array.prototype.encodeUri = function() {
    var str = JSON.stringify(this);
    return encodeURIComponent(str);
};

Array.prototype.where = function(item, value) {
    var self = this;
    var result = [];
    var fn = function(obj, index, arr) {
        if (obj[item] == value) {
            result.push(obj);
        }
    };
    self.forEach(fn);
    return result;
};

Array.prototype.andWhere = function(item, value) {
    var self = this;
    var result = [];
    var fn = function(obj, index, arr) {
        if (obj[item] == value) {
            result.push(obj);
        }
    };
    self.forEach(fn);
    return result;
};

Array.prototype.first = function() {
    return this[0];
};

Array.prototype.like = function(item, value) {
    var self = this;
    var result = [];
    var fn = function(obj, index, arr) {
        if (String(obj[item]).contains(value)) {
            result.push(obj);
        }
    };
    self.forEach(fn);
    return result;
};

Array.prototype.andLike = function(item, value) {
    var self = this;
    var result = [];
    var fn = function(obj, index, arr) {
        if (String(obj[item]).contains(value)) {
            result.push(obj);
        }
    };
    self.forEach(fn);
    return result;
};

Array.prototype.indexOf = function(item, value) {
    var self = this;
    var result = -1;
    var fn = function(elem, index, arr) {
        if (elem[item] == value) {
            result = index;
        }
    };
    self.forEach(fn);
    return result;
};

Array.prototype.contains = function(value) {
    var self = this;
    var result = false;
    var fn = function(elem, index, self) {
        if (elem == value) {
            result = true;
        }
    };
    self.forEach(fn);
    return result;
};

if (typeof Array.prototype.forEach == "undefined") {
    var self = this;
    Array.prototype.forEach = function(fn) {
        var i;
        var len;
        len = self.length;
        for (i = 0; i < len; i++) {
            fn(self[i], i, self);
        }
    };
}

Array.prototype.sortAsc = function(property) {
    var self = this;
    if (self.length === 0) {
        console.warn("No data to sort", self, property);
        return;
    }
    var row = self[0];
    if (typeof row[property] == "undefined") {
        console.error(property + " no part of object.", self);
    }
    window.__tempFilter = property;
    var getValue = function(v) {
        if (Math.isNumeric(v)) {
            return v * 1;
        }
        return v;
    };
    var compareAscNumber = function(a, b) {
        var filter = window.__tempFilter;
        var _a = a[filter];
        var _b = b[filter];
        var _c = getValue(_a) - getValue(_b);
        return _c;
    };
    var compareAsc = function(a, b) {
        var filter = window.__tempFilter;
        var _a = a[filter];
        var _b = b[filter];
        var _c = _a.localeCompare(_b);
        return _c;
    };
    if (Math.isNumeric(row[property])) {
        return self.sort(compareAscNumber);
    } else {
        return self.sort(compareAsc);
    }
};

Array.prototype.sortDesc = function(property) {
    var self = this;
    if (self.length === 0) {
        console.warn("No data to sort", self, property);
        return;
    }
    var row = self[0];
    if (typeof row[property] == "undefined") {
        console.error(property + " no part of object.", self);
    }
    window.__tempFilter = property;
    var getValue = function(v) {
        if (Math.isNumeric(v)) {
            return v * 1;
        }
        return v;
    };
    var compareDescNumber = function(a, b) {
        var filter = window.__tempFilter;
        var _a = a[filter];
        var _b = b[filter];
        var _c = getValue(_b) - getValue(_a);
        return _c;
    };
    var compareDesc = function(a, b) {
        var filter = window.__tempFilter;
        var _a = a[filter];
        var _b = b[filter];
        var _c = _b.localeCompare(_a);
        return _c;
    };
    if (Math.isNumeric(row[property])) {
        return self.sort(compareDescNumber);
    } else {
        return self.sort(compareDesc);
    }
};

window.BreakException = {};

Array.prototype.each = function(fn) {
    var self = this;
    try {
        var i;
        var len;
        len = self.length;
        for (i = 0; i < len; i++) {
            fn(self[i], i, self);
        }
    } catch (e) {
        if (e !== BreakException) throw e;
    }
};

Array.prototype.sum = function(prop) {
    var self = this;
    if (self.length === 0) {
        return 0;
    }
    if (typeof self[0] != "object") {
        console.error("Items are not objects");
        return;
    }
    if (!self[0].hasOwnProperty(prop)) {
        console.error("Items does not have a " + prop + " property.");
        return;
    }
    var sum = 0;
    self.forEach(function(item) {
        sum += Number(item[prop]);
    });
    return sum;
};

window.Exception = function(message, reference) {
    this.message = message;
    this.reference = reference;
};

function RS() {
    var self = this;
    this.config = null;
    var locationHashBusy = false;
    var storedHash = window.location.hash;
    this.assignValue = function(bindable, value) {
        if (bindable === null || value === null) {
            return;
        }
        if (typeof value == "string" && value != "{}" && value != "null") {
            value = "'" + value + "'";
        }
        var parts = bindable.split(".");
        var code = "";
        if (parts.length > 1) {
            code = "window";
            var fnEach = function(item, index, collection) {
                code += "['" + item + "']";
            };
            parts.forEach(fnEach);
            code += " = " + value + ";";
        } else {
            code = bindable + " = " + value + ";";
        }
        var f = new Function(code);
        f();
    };
    this.returnValue = function(bindable) {
        if (bindable === null) {
            return null;
        }
        var self = this;
        var parts = bindable.split(".");
        if (parts.length > 0) {
            if (self.evalUndefined(parts[0])) {
                return null;
            } else if (self.evalUndefined(bindable)) {
                return null;
            } else {
                var code = "return " + bindable + ";";
                var f = new Function(code);
                return f();
            }
        } else if (self.evalUndefined(bindable)) {
            return null;
        }
    };
    this.evalUndefined = function(bindable) {
        var code = "return ( typeof " + bindable + " == 'undefined' );";
        var f = new Function(code);
        return f();
    };
    this.defineGetter = function(obj, propName, fnGet) {
        var parts = obj.split(".");
        var code = "";
        if (parts.length > 1) {
            code = "window";
            var fnEach = function(item, index, collection) {
                code += "['" + item + "']";
            };
            parts.forEach(fnEach);
            code += ".__defineGetter__( propName, fnGet );";
        } else {
            code += "window['" + obj + "'].__defineGetter__( propName, fnGet );";
        }
        var f = new Function("propName", "fnGet", code);
        f(propName, fnGet);
    };
    this.defineSetter = function(obj, propName, fnSet) {
        var parts = obj.split(".");
        var code = "";
        if (parts.length > 1) {
            code = "window";
            var fnEach = function(item, index, collection) {
                code += "['" + item + "']";
            };
            parts.forEach(fnEach);
            code += ".__defineSetter__( propName, fnSet );";
        } else {
            code += "window['" + obj + "'].__defineSetter__( propName, fnSet );";
        }
        var f = new Function("propName", "fnSet", code);
        f(propName, fnSet);
    };
    self.forEach = function(obj, fn) {
        var type = typeof obj;
        switch (type) {
          case "object":
            if (typeof obj.length == "number") {
                var i;
                var arr = [];
                for (i = 0; i < obj.length; i++) {
                    arr.push(obj[i]);
                }
                arr.forEach(fn);
            } else {
                obj = new RSObject(obj);
                obj.forEach(fn);
            }
            break;

          case "array":
            obj.forEach(fn);
            break;

          default:
            return null;
        }
    };
    self.onReady = function(fn) {
        document.addEventListener("DOMContentLoaded", function(event) {
            fn();
        });
    };
    self.removeHash = function() {
        window.location.hash = "";
    };
    var manageRoutes = function(locationHash) {
        if (locationHash == "#" || locationHash === "") {
            return;
        }
        locationHashBusy = true;
        if (self.config.routes !== "undefined" && self.config.routes !== null) {
            locationHash = String(locationHash);
            locationHash = locationHash.replace("#", "");
            var expression = ":[a-zA-Z0-9]+";
            var regParam = new RegExp(expression, "gi");
            var params = null;
            var urlFormat = null;
            var url = null;
            var newUrl = null;
            var fnEach = function(item, key, collection) {
                var tmp = key;
                params = key.match(regParam);
                var fnEachParam = function(str, idx, collection) {
                    key = key.replace(str, "[a-zA-Z0-9]+");
                };
                if (params !== null) {
                    params.forEach(fnEachParam);
                    var reg = new RegExp(key, "i");
                    var match = reg.exec(locationHash);
                    if (match !== null) {
                        urlFormat = tmp;
                        url = locationHash;
                        newUrl = item;
                        return;
                    }
                } else if (key == locationHash) {
                    urlFormat = key;
                    url = locationHash;
                    newUrl = item;
                    return;
                }
            };
            var routes = new RSObject(self.config.routes);
            routes.forEach(fnEach);
            if (urlFormat !== null) {
                var segmentsUrlFormat = urlFormat.split("/");
                var segmentsUrl = url.split("/");
                var map = {};
                var fnEach = function(item, index, collection) {
                    map[item] = segmentsUrl[index];
                };
                segmentsUrlFormat.forEach(fnEach);
                fnEach = function(item, index, collection) {
                    newUrl = newUrl.replaceAll(item, map[item]);
                };
                params = urlFormat.match(regParam);
                if (params !== null) {
                    params.forEach(fnEach);
                }
            } else {
                console.warn(locationHash + " no route found.");
                newUrl = locationHash;
            }
            var args = newUrl.split("/");
            if (args.length >= 2) {
                var controller = args[0];
                var action = args[1];
                args.splice(0, 2);
                if (typeof window[controller] == "undefined") {
                    console.error("Controlador no definido [" + controller + "]");
                    locationHashBusy = false;
                    return;
                } else if (typeof window[controller][action] == "undefined") {
                    console.error("Funcion no definida [" + controller + "." + action + "]");
                    locationHashBusy = false;
                    return;
                } else {
                    window[controller][action].apply(this, args);
                    locationHashBusy = false;
                    return;
                }
                console.error("La ruta o ubicacion debe tener al menos controlador/funcion");
            } else {}
        }
        locationHashBusy = false;
    };
    var hashChanged = function(locationHash) {
        if (locationHashBusy === false) {
            manageRoutes(locationHash);
        }
    };
    var hashChangedTick = function() {
        if (window.location.hash != storedHash) {
            storedHash = window.location.hash;
            hashChanged(storedHash);
        }
    };
    var setOnHashChange = function() {
        window.setInterval(hashChangedTick, 300);
    };
    this.readConfig = function(configUrl) {
        if (typeof http == "undefined") {
            var http = new Http();
        }
        var onSuccess = function(res) {
            var response = res.data;
            if (typeof response == "object") {
                self.config = response;
            } else {
                try {
                    var jsonResponse = JSON.parse(response);
                    response = jsonResponse;
                    self.config = jsonResponse;
                } catch (ex) {
                    console.error("Config is not json or is unavailable");
                    console.error(response);
                    return;
                }
            }
            if (typeof self.config != "undefined") {
                if (typeof self.config.options.useRouting != "undefined") {
                    if (self.config.options.useRouting) {
                        setOnHashChange();
                    }
                }
                if (typeof self.config.options.useMVC != "undefined") {
                    if (self.config.options.useMVC) {
                        dom.bindData();
                    }
                }
            }
        };
        var onError = function(statusText) {
            console.error(statusText);
            alert(statusText);
        };
        if (typeof configUrl != "undefined") {
            http.get(configUrl, null, onSuccess, onError);
        } else {
            console.error("Configuration file undefined");
        }
    };
}

RS.CookieHelper = function() {
    var self = this;
    self.set = function(name, value, days) {
        if (!days) {
            days = 1 / 24;
        }
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1e3);
        var expiresAt = "expires=" + date.toUTCString();
        var cookie = name + "=" + value + "; expires=" + expiresAt;
        document.cookie = cookie;
    };
    self.delete = function(name) {
        var _cookies = self.get(name);
        if (_cookies === null) {
            return null;
        }
        var fnDelete = function(name) {
            var expiresAt = "Thu, 01 Jan 1970 00:00:01 GMT";
            var cookie = name + "=0; expires=" + expiresAt;
            document.cookie = cookie;
            cookie = name + "=0; path=/;domain=" + window.location.host + "; expires=" + expiresAt;
            document.cookie = cookie;
        };
        if (typeof _cookies.length != "undefined") {
            if (_cookies.length > 0) {
                var fnEach = function(item, index, collection) {
                    fnDelete(item.name);
                };
                _cookies.forEach(fnEach);
            } else {
                return null;
            }
        } else {
            fnDelete(name);
        }
    };
    self.get = function(name) {
        if (document.cookie === "") {
            return null;
        }
        var cookies = document.cookie.split("; ");
        var result = [];
        var isFound = false;
        var itemResult = null;
        var fnEach = function(value, index, array) {
            var keyValue = value.split("=");
            var item = {};
            item.name = keyValue[0];
            item.value = keyValue[1];
            if (typeof name != "undefined") {
                if (name == item.name) {
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
        } else {
            if (typeof name != "undefined") {
                return null;
            } else {
                return result;
            }
        }
    };
};