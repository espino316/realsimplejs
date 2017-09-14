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

function CookieHelper() {
    var self = this;
    self.set = function(name, value, days) {
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
}

function CssRule(ruleName) {
    this.ruleName = ruleName;
    this.properties = {};
}

CssRule.prototype.ruleName = "";

CssRule.prototype.addProperty = function(propertyName, propertyValue) {
    var self = this;
    self.properties[propertyName] = propertyValue;
};

CssRule.prototype.toString = function() {
    var css = "." + this.ruleName + " {\n";
    var keys = Object.keys(this.properties);
    var len = keys.length;
    var i = 0;
    for (i = 0; i < len; i++) {
        css += keys[i] + ": " + this.properties[keys[i]] + ";";
        css += "\n";
    }
    css += "}";
    return css;
};

function CssStyle() {}

CssStyle.prototype.classes = [];

CssStyle.prototype.addClass = function(cssClass) {
    this.classes.push(cssClass);
};

CssStyle.prototype.toString = function() {
    var len = this.classes.length;
    var i;
    var css = "";
    for (i = 0; i < len; i++) {
        css += this.classes[i].toString() + "\n\n";
    }
    return css;
};

CssStyle.prototype.setStyle = function() {
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = this.toString();
    document.getElementsByTagName("head")[0].appendChild(style);
};

function CssAnimation(name) {
    this.name = name;
    this.from = new CssRule("from");
    this.to = new CssRule("to");
}

CssAnimation.prototype.name = "";

CssAnimation.prototype.from = null;

CssAnimation.prototype.to = null;

CssAnimation.prototype.toString = function() {
    var css = "@keyframes " + this.name + " {\n@from\n@to\n}";
    var cssFrom = this.from.toString();
    var cssTo = this.to.toString();
    cssFrom = cssFrom.replace(".from", "from");
    cssTo = cssTo.replace(".to", "to");
    css = css.replace("@from", cssFrom);
    css = css.replace("@to", cssTo);
    var wkcss = "@-webkit-keyframes " + this.name + " {\n@from\n@to\n}";
    wkcss = wkcss.replace("@from", cssFrom);
    wkcss = wkcss.replace("@to", cssTo);
    return css + "\n" + wkcss;
};

function DateHelper() {
    this.timestamp = function() {
        return Math.floor(Date.now() / 1e3);
    };
    this.getDateParts = function(date) {
        var dateObj = new Date();
        if (typeof date != "undefined") {
            dateObj = new Date(date);
        }
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        var hour = dateObj.getUTCHours();
        var minutes = dateObj.getUTCMinutes();
        var seconds = dateObj.getUTCSeconds();
        month = "00" + month;
        month = String(month).right(2);
        day = "00" + day;
        day = String(day).right(2);
        hour = "00" + hour;
        hour = String(hour).right(2);
        minutes = "00" + minutes;
        minutes = String(minutes).right(2);
        seconds = "00" + seconds;
        seconds = String(seconds).right(2);
        var newTime = hour + ":" + minutes + ":" + seconds;
        var newDate = year + "/" + month + "/" + day;
        var dateParts = {};
        dateParts.year = year;
        dateParts.month = month;
        dateParts.day = day;
        dateParts.hour = hour;
        dateParts.date = newDate;
        dateParts.minutes = minutes;
        dateParts.seconds = seconds;
        dateParts.time = newTime;
        return dateParts;
    };
}

function Dialog() {
    this.showAlert = function(msg, title, buttonText) {
        if (typeof navigator.notification == "undefined") {
            alert(msg);
        } else {
            navigator.notification.alert(msg, null, title, buttonText);
        }
    };
    this.showConfirm = function(msg, onConfirm) {
        if (navigator.notification === null) {
            var result = confirm(msg);
            if (result) {
                onConfirm(1);
            } else {
                onConfirm(2);
            }
        } else {
            navigator.notification.confirm(msg, onConfirm, "Confirmar", [ "Si", "No" ]);
        }
    };
}

window.dlg = new Dialog();

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

function RSObject(obj) {
    if (obj === null) {
        obj = {};
    }
    var self = this;
    var keys = {};
    var fnEach = function(elem, index, arr) {
        self[elem] = obj[elem];
    };
    if (typeof obj != "undefined") {
        keys = Object.keys(obj);
        keys.forEach(fnEach);
    }
    self.clone = function(from, to) {
        var keys = {};
        var fnEach = function(elem, index, arr) {
            if (typeof from[elem] == "object") {
                to[elem] = {};
                self.clone(from[elem], to[elem]);
            } else {
                to[elem] = from[elem];
            }
        };
        keys = Object.keys(from);
        keys.forEach(fnEach);
    };
    self.copy = function(to) {
        var keys = {};
        var fnEach = function(elem, index, arr) {
            to[elem] = self[elem];
        };
        keys = Object.keys(self);
        keys.forEach(fnEach);
    };
    self.clear = function() {
        var fnEach = function(value, key, obj) {
            self[key] = null;
        };
        self.forEach(fnEach);
    };
}

RSObject.prototype.forEach = function(fn) {
    var self = this;
    var keys = Object.keys(self);
    var i;
    var len = keys.length;
    for (i = 0; i < len; i++) {
        var type = typeof self[keys[i]];
        if (type != "function" && type != "undefined") {
            fn(self[keys[i]], keys[i], self);
        }
    }
};

RSObject.prototype.encodeUri = function() {
    var str = JSON.stringify(this);
    return encodeURIComponent(str);
};

RSObject.prototype.decodeUri = function() {
    var str = JSON.stringify(this);
    return decodeURIComponent(str);
};

RSObject.prototype.exists = function(obj) {
    var result = true;
    result = typeof obj != "undefined";
    return result;
};

RSObject.prototype.isNull = function(obj) {
    return obj === null;
};

RSObject.prototype.isSet = function isSet(obj) {
    var result = false;
    if (obj) {
        result = true;
        var toStr = Object.prototype.toString.call(obj);
        toStr = toStr.replace("[object ", "");
        toStr = toStr.replace("]", "");
        var len = 1;
        if (toStr == "Object") {
            len = Object.keys(obj).length;
        } else if (toStr == "Array") {
            len = obj.length;
        }
        if (len > 0) {
            result = true;
        } else {
            result = false;
        }
    }
    return result;
};

RSObject.prototype.addProperty = function(obj, name, onChange) {
    Object.defineProperty(obj, name, {
        _x: null,
        get: function() {
            return _x;
        },
        set: function(value) {
            _x = value;
            if (typeof onChange != "undefined") {
                onChange(obj);
            }
        }
    });
};

RSObject.prototype.serialize = function() {
    var result = [];
    var current = "";
    var fn = function(value, key, obj) {
        if (typeof value == "function") {
            return;
        } else if (typeof value == "object") {
            current = key;
            var tmp = new RSObject(value);
            tmp.forEach(fn);
            current = "";
        } else {
            if (current !== "") {
                var item = current + "[" + key + "]=" + value;
                result.push(item);
            } else {
                result.push(key + "=" + value);
            }
        }
    };
    this.forEach(fn);
    return result.join("&");
};

window.rs = new RS();

window.rs.object = new RSObject();

function Dom() {
    var self = this;
    var arrowUp = " " + "&#8679;".unescapeHTML();
    var arrowDown = " " + "&#8681;".unescapeHTML();
    var getInput = function(name, value) {
        var input = dom.create("input");
        input.setAttribute("name", name);
        input.setAttribute("value", value);
        return input;
    };
    self.submitForm = function(url, data) {
        var form = dom.create("form");
        var keys = Object.keys(data);
        keys.forEach(function(item, index, collection) {
            var input = getInput(item, data[item]);
            form.appendChild(input);
        });
        form.setAttribute("method", "post");
        form.setAttribute("action", url);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };
    self.onEnter = function(element, callback) {
        element.onkeyup = function() {
            var e = event;
            if (e.keyCode == 13) {
                callback();
            }
        };
    };
    self.get = function(selector) {
        var items = document.querySelectorAll(selector);
        if (items.length == 1) {
            return items[0];
        }
        return items;
    };
    self.getAll = function(selector) {
        var items = document.querySelectorAll(selector);
        return items;
    };
    self.getById = function(id) {
        return document.getElementById(id);
    };
    self.getFile = function(input, fn) {
        var result = null;
        if (input.files && input.files[0]) {
            result = {};
            result.name = input.files[0].name;
            result.type = input.files[0].type;
            result.size = input.files[0].size;
            result.inputName = input.name;
            result.data = null;
            var reader = new FileReader();
            reader.onload = function(e) {
                result.data = e.target.result;
                if (typeof fn != "undefined") {
                    fn(result);
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
        return result;
    };
    self.getInputsValues = function() {
        var allInputs = document.getElementsByTagName("input");
        var allSelects = document.getElementsByTagName("select");
        var result = {};
        var fn = function(val, i, arr) {
            result[val.id] = val.value;
        };
        var fnSelects = function(val, i, arr) {
            var selectedValue = val.options[val.options.selectedIndex].value;
            result[val.id] = selectedValue;
        };
        allInputs.forEach(fn);
        allSelects.forEach(fn);
        return result;
    };
    self.validateInputs = function() {
        var inputs = self.get("input");
        var isValid = true;
        var msg = "";
        var forEachInput = function(value, index, arr) {
            isValid = isValid && value.checkValidity();
            if (value.checkValidity() === false) {
                var title = value.getAttribute("title");
                if (title !== null) {
                    msg += title + "\r\n";
                }
            }
        };
        Array.prototype.forEach.call(inputs, forEachInput);
        if (!isValid) {
            dlg.showAlert(msg, "Error", "Ok");
        }
        return isValid;
    };
    self.getSelect = function(name, data, val, text) {
        var sel = document.createElement("select");
        sel.id = name;
        sel.name = name;
        var fn = function(v, i, a) {
            var opt = document.createElement("option");
            opt.value = v[val];
            opt.innerHTML = v[text];
            sel.appendChild(opt);
        };
        data.forEach(fn);
        return sel;
    };
    self.populateSelect = function(select, data, valueField, textField, value) {
        var forEachItem = function(item, key, arr) {
            var option = self.create("option");
            option.value = item[valueField];
            option.innerHTML = item[textField];
            if (typeof value != "undefined" && value !== null && value === item[valueField]) {
                option.selected = true;
            }
            select.appendChild(option);
        };
        data.forEach(forEachItem);
    };
    self.create = function(nodeName) {
        var element = document.createElement(nodeName);
        if (typeof rs != "undefined" && typeof rs.config != "undefined" && rs.config !== null) {
            if (typeof rs.config.options.useMVC != "undefined") {
                if (rs.config.options.useMVC) {
                    self.setMVCListener(element);
                }
            }
        }
        return element;
    };
    self.setMVCListener = function(input) {
        var setTwoWaysBinding = function(element, bindable) {
            var parts = bindable.split(".");
            if (parts.length > 1) {
                var propName = parts[parts.length - 1];
                parts.pop();
                var obj = parts.join(".");
                if (rs.evalUndefined(obj)) {
                    rs.assignValue(obj, "{}");
                }
                var privateName = "_" + propName;
                rs.assignValue(obj + "." + privateName, null);
                var fnGet = function() {
                    return this[privateName];
                };
                var fnSet = function(value) {
                    this[privateName] = value;
                    var nodeName = element.nodeName.toLowerCase();
                    if (nodeName == "img") {
                        element.src = value;
                    } else {
                        if (element != document.activeElement) {
                            element.value = value;
                        }
                    }
                };
                rs.defineSetter(obj, propName, fnSet);
                rs.defineGetter(obj, propName, fnGet);
            }
        };
        var onChange = function() {
            var self = this;
            var bindable = self.getAttribute("data-bind");
            if (bindable !== null) {
                var nodeName = self.nodeName.toLowerCase();
                var type = self.getAttribute("type");
                var val = null;
                if (nodeName == "input" && type == "checkbox") {
                    val = self.checked;
                } else if (nodeName == "select") {
                    val = self.value;
                } else {
                    val = self.value;
                }
                var current = rs.returnValue(bindable);
                if (current != val) {
                    rs.assignValue(bindable, val);
                    var bindedElements = document.querySelectorAll("[data-bind='" + bindable + "']");
                    var len = bindedElements.length;
                    var i;
                    var property;
                    var forEachBinded = function(element, key, arr) {
                        nodeName = element.nodeName.toLowerCase();
                        if (nodeName == "select") {
                            element.value = rs.returnValue(bindable);
                        } else {
                            element.innerHTML = rs.returnValue(bindable);
                        }
                    };
                    Array.prototype.forEach.call(bindedElements, forEachBinded);
                }
            }
        };
        switch (input.nodeName.toLowerCase()) {
          case "input":
            var type = input.getAttribute("type");
            switch (type) {
              case "text":
                input.addEventListener("keyup", onChange);
                input.addEventListener("blur", onChange);
                break;

              case "email":
                input.addEventListener("keyup", onChange);
                input.addEventListener("blur", onChange);
                break;

              case "password":
                input.addEventListener("keyup", onChange);
                input.addEventListener("blur", onChange);
                break;

              case "date":
                input.addEventListener("change", onChange);
                input.addEventListener("blur", onChange);
                break;

              case "time":
                input.addEventListener("change", onChange);
                input.addEventListener("blur", onChange);
                break;

              case "checkbox":
                input.addEventListener("change", onChange);
                break;

              case "radio":
                input.addEventListener("change", onChange);
                break;

              default:
            }
            break;

          case "textarea":
            input.addEventListener("keyup", onChange);
            input.addEventListener("blur", onChange);
            break;

          case "select":
            input.addEventListener("change", onChange);
            break;

          default:
        }
        var bindable = input.getAttribute("data-bind");
        var twoways = input.getAttribute("data-bind-mode");
        if (twoways !== null) {
            setTwoWaysBinding(input, bindable);
        }
        rs.assignValue(bindable, null);
    };
    self.bindData = function() {
        var self = this;
        var forEachInput = function(input, key, arr) {
            self.setMVCListener(input);
        };
        var inputs = document.querySelectorAll("input, textarea, select, img");
        Array.prototype.forEach.call(inputs, forEachInput);
        var selectElements = document.querySelectorAll("select[data-source]");
        var forEachSelect = function(select, key, arr) {
            var valueField = select.getAttribute("data-value-field");
            var textField = select.getAttribute("data-display-field");
            var dataSource = select.getAttribute("data-source");
            var dataBind = select.getAttribute("data-bind");
            dataSource = rs.returnValue(dataSource);
            var selectValue = rs.returnValue(dataBind);
            self.populateSelect(select, dataSource, valueField, textField, selectValue);
        };
        Array.prototype.forEach.call(selectElements, forEachSelect);
        var bindedElements = document.querySelectorAll("[data-bind],[data-source]");
        var len = bindedElements.length;
        var i;
        var property;
        var forEachBinded = function(element, key, arr) {
            var nodeName = element.nodeName.toLowerCase();
            var bindable = element.getAttribute("data-bind");
            if (nodeName == "select" || nodeName == "input" || nodeName == "textarea") {
                if (!rs.evalUndefined(bindable)) {
                    element.value = rs.returnValue(bindable);
                }
            } else if (nodeName == "img") {
                element.src = rs.returnValue(bindable);
            } else if (nodeName == "table") {
                bindable = element.getAttribute("data-source");
                if (!rs.evalUndefined(bindable)) {
                    var ths = element.querySelectorAll("tr > th");
                    var options = {};
                    var columns = [];
                    var column = {};
                    if (element.getAttribute("class") !== null) {
                        options.class = element.getAttribute("class");
                    }
                    var fnEachTh = function(th, i, ths) {
                        column = {};
                        var type = th.getAttribute("data-field-type");
                        column.type = type;
                        switch (type) {
                          case "text":
                            column.name = th.getAttribute("data-field");
                            column.header = th.getAttribute("data-header");
                            columns.push(column);
                            break;

                          case "textbox":
                            column.name = th.getAttribute("data-field");
                            column.header = th.getAttribute("data-header");
                            columns.push(column);
                            break;

                          case "select":
                            column.name = th.getAttribute("data-field");
                            column.header = th.getAttribute("data-header");
                            column.source = th.getAttribute("data-source");
                            column.valueField = th.getAttribute("data-value-field");
                            column.displayField = th.getAttribute("data-display-field");
                            columns.push(column);
                            break;

                          case "hyperlink":
                            column.name = th.getAttribute("data-field");
                            column.header = th.getAttribute("data-header");
                            column.urlFormatFields = th.getAttribute("data-url-fields");
                            column.text = th.getAttribute("data-text");
                            column.urlFormat = th.getAttribute("data-url-format");
                            column.onclickFormatFields = th.getAttribute("data-onclick-fields");
                            column.onclickFormat = th.getAttribute("data-onclick-format");
                            if (column.onclickFormatFields !== null) {
                                column.onclickFormatFields = column.onclickFormatFields.split(",");
                            }
                            if (column.urlFormatFields !== null) {
                                column.urlFormatFields = column.urlFormatFields.split(",");
                            }
                            columns.push(column);
                            break;

                          default:
                        }
                    };
                    ths.forEach(fnEachTh);
                    element.clear();
                    var data = rs.returnValue(bindable);
                    options.columns = columns;
                    var newTable = self.getTableFromData(data, options);
                    self.replaceTable(element, newTable);
                }
            } else {
                element.innerHTML = rs.returnValue(bindable);
            }
        };
        Array.prototype.forEach.call(bindedElements, forEachBinded);
    };
    self.replaceTable = function(table, newTable) {
        table.parentNode.replaceChild(newTable, table);
    };
    self.bind = function(variableName) {
        var bindedElements = document.querySelectorAll("[data-bind]");
        var len = bindedElements.length;
        var i;
        var property;
        var forEachBinded = function(element, key, arr) {
            var nodeName = element.nodeName.toLowerCase();
            var bindable = element.getAttribute("data-bind");
            if (bindable == variableName) {
                if (!rs.evalUndefined(bindable)) {
                    if (nodeName == "select" || nodeName == "input" || nodeName == "textarea") {
                        element.value = rs.returnValue(bindable);
                    } else {
                        element.innerHTML = rs.returnValue(bindable);
                    }
                }
            }
        };
        Array.prototype.forEach.call(bindedElements, forEachBinded);
    };
    self.addModel = function(name, data) {
        var fn = function(name) {
            console.log(name + " has changed");
        };
        if (data.constructor != "RSObject") {
            data = new RSObject(data);
        }
        var fnEach = function(value, key, obj) {
            watcher.add(name + "." + key, fn);
        };
        data.forEach(fnEach);
        window[name] = data;
    };
    self.getTableFromData = function(data, options) {
        var _checkedRows = function() {
            var self = this;
            var rows = [];
            self.forEachRow(function(row, index, arr) {
                row.forEachCell(function(cell, cellIndex, cellArray) {
                    cell.childNodes.forEach(function(node, nodeIndex, nodeArray) {
                        if (node.type == "checkbox") {
                            if (node.checked) {
                                rows.push(row);
                            }
                        }
                    });
                });
            });
            return rows;
        };
        var _forEachCell = function(fn) {
            var self = this;
            var item = null;
            var arr = self.cells;
            var i = 0;
            for (i = 0; i < arr.length; i++) {
                item = arr[i];
                fn(item, i, arr);
            }
        };
        var _forEachRow = function(fn) {
            var self = this;
            var item = null;
            var arr = self.rows;
            var i = 0;
            for (i = 0; i < arr.length; i++) {
                item = arr[i];
                fn(item, i, arr);
            }
        };
        if (typeof data == "undefined") {
            console.error("Table data is undefined");
            dlg.showAlert("Los datos no estan definidos", "Error", "Ok");
            return;
        }
        if (data.length == 0) {
            return dom.create("table");
        }
        var table = self.create("table");
        table.forEachRow = _forEachRow;
        table.checkedRows = _checkedRows;
        table.sort = function(property, ascDesc) {
            if (typeof ascDesc == "undefined") {
                ascDesc = "asc";
            }
        };
        if (typeof options != "undefined") {
            if (typeof options.class != "undefined") {
                table.addClass(options.class);
            }
            if (typeof options.id != "undefined") {
                table.id = options.id;
            }
        }
        var firstRow = data[0];
        var keys = Object.keys(firstRow);
        var th = null;
        var clearRows = function() {
            var len = table.rows.length;
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
        };
        var fnEachColumn = function(item, index, array) {
            th = self.create("th");
            th.setAttribute("data-sort", "asc");
            th.style.cursor = "pointer";
            var text = item + arrowUp;
            if (typeof item.name != "undefined") {
                text = item.name + arrowUp;
            }
            if (typeof item.header != "undefined") {
                text = item.header + arrowUp;
            }
            th.addText(text);
            var sortClick = function() {
                var self = this;
                var sort = self.getAttribute("data-sort");
                var arrow = "";
                var sortColumn = item;
                if (typeof item.name != "undefined") {
                    sortColumn = item.name;
                }
                if (sort == "asc") {
                    sort = "desc";
                    arrow = arrowDown;
                    data.sortDesc(sortColumn);
                } else {
                    sort = "asc";
                    arrow = arrowUp;
                    data.sortAsc(sortColumn);
                }
                self.setAttribute("data-sort", sort);
                sortColumn += arrow;
                if (typeof item.header != "undefined") {
                    sortColumn = item.header + arrow;
                }
                self.innerText = sortColumn;
                clearRows();
                data.forEach(fnEachRow);
            };
            th.addEventListener("click", sortClick);
            tr.appendChild(th);
        };
        var fnEachRow = function(obj, i, arr) {
            var fnEach = function(item, index, array) {
                var td = self.create("td");
                td.addText(obj[item]);
                tr.appendChild(td);
            };
            var fnEachColumn = function(item, index, array) {
                var row = obj;
                var td = self.create("td");
                switch (item.type) {
                  case "checkbox":
                    var checkbox = self.create("input");
                    checkbox.type = "checkbox";
                    checkbox.id = item.name + "_" + i;
                    checkbox.value = row[item.name];
                    td.appendChild(checkbox);
                    break;

                  case "text":
                    if (typeof item.transform != "undefined" && typeof item.transform == "function") {
                        td.addText(item.transform(row[item.name]));
                    } else if (typeof options.isNull != "undefined") {
                        if (row[item.name] === null) {
                            td.addText(options.isNull);
                        }
                    } else {
                        td.addText(row[item.name]);
                    }
                    break;

                  case "textbox":
                    var textbox = self.create("input");
                    textbox.type = "text";
                    textbox.value = row[item.name];
                    td.appendChild(textbox);
                    break;

                  case "select":
                    break;

                  case "hyperlink":
                    var hyperlink = self.create("a");
                    var dataTextFormat = item.dataTextFormat;
                    var dataTextFormatFields = item.dataTextFormatFields;
                    var linkText = item.text;
                    if (typeof item.text == "undefined") {
                        if (dataTextFormat !== null && typeof dataTextFormat != "undefined") {
                            if (dataTextFormatFields !== null && typeof dataTextFormatFields != "undefined") {
                                var fnEach = function(fieldName, index, fields) {
                                    var toFind = "@" + fieldName;
                                    dataTextFormat = dataTextFormat.replace(toFind, row[fieldName]);
                                };
                                dataTextFormatFields.forEach(fnEach);
                                linkText = dataTextFormat;
                            } else {
                                linkText = dataTextFormat;
                            }
                        }
                    }
                    hyperlink.appendChild(document.createTextNode(linkText));
                    var urlFormat = item.urlFormat;
                    var urlFormatFields = item.urlFormatFields;
                    var url = "#";
                    if (urlFormat !== null && typeof urlFormat != "undefined") {
                        if (urlFormatFields !== null && typeof urlFormatFields != "undefined") {
                            var fnEach = function(fieldName, index, fields) {
                                var toFind = "@" + fieldName;
                                urlFormat = urlFormat.replace(toFind, row[fieldName]);
                            };
                            urlFormatFields.forEach(fnEach);
                            url = urlFormat;
                        } else {
                            url = urlFormat;
                        }
                    }
                    hyperlink.href = url;
                    var onclickFormat = item.onclickFormat;
                    var onclickFormatFields = item.onclickFormatFields;
                    var onclick = "";
                    if (onclickFormat !== null && typeof onclickFormat != "undefined") {
                        if (onclickFormatFields !== null && typeof onclickFormatFields != "undefined") {
                            var fnEach = function(fieldName, index, fields) {
                                var toFind = "@" + fieldName;
                                onclickFormat = onclickFormat.replace(toFind, row[fieldName]);
                            };
                            onclickFormatFields.forEach(fnEach);
                            onclick = onclickFormat;
                        } else {
                            onclick = onclickFormat;
                        }
                    }
                    hyperlink.setAttribute("onclick", onclick);
                    td.appendChild(hyperlink);
                    break;

                  case "hidden":
                    var hidden = self.create("input");
                    hidden.type = "hidden";
                    hidden.value = row[item.name];
                    td.appendChild(hidden);
                    break;

                  case "textarea":
                    var textarea = self.create("textarea");
                    textarea.value = row[item.name];
                    td.appendChild(textarea);
                    break;

                  case "image":
                    var img = self.create("img");
                    urlFormat = item.urlFormat;
                    urlFormatFields = item.urlFormatFields;
                    url = "#";
                    if (urlFormat !== null) {
                        if (urlFormatFields !== null) {
                            var fnEach = function(fieldName, index, fields) {
                                var toFind = "@" + fieldName;
                                urlFormat = urlFormat.replace(toFind, row[fieldName]);
                            };
                            urlFormatFields.forEach(fnEach);
                            url = urlFormat;
                        } else {
                            url = urlFormat;
                        }
                    }
                    img.src = url;
                    img.style.height = item.height;
                    img.style.width = item.width;
                    td.appendChild(img);
                    break;
                }
                tr.appendChild(td);
            };
            tr = self.create("tr");
            tr.forEachCell = _forEachCell;
            tr.data = obj;
            if (typeof options != "undefined") {
                if (typeof options.onclick != "undefined") {
                    var caller = function() {
                        options.onclick(obj);
                    };
                    tr.addEventListener("click", caller);
                }
            }
            if (typeof options != "undefined") {
                if (typeof options.columns != "undefined") {
                    options.columns.forEach(fnEachColumn);
                } else {
                    keys.forEach(fnEach);
                }
            } else {
                keys.forEach(fnEach);
            }
            if (typeof options != "undefined") {
                if (typeof options.backgroundColorField != "undefined") {
                    tr.style.backgroundColor = obj[options.backgroundColorField];
                }
            }
            table.appendChild(tr);
        };
        var tr = self.create("tr");
        tr.setAttribute("data-rowheader", true);
        tr.forEachCell = _forEachCell;
        tr.data = keys;
        if (typeof options != "undefined") {
            if (typeof options.columns != "undefined") {
                options.columns.forEach(fnEachColumn);
            } else {
                keys.forEach(fnEachColumn);
            }
        } else {
            keys.forEach(fnEachColumn);
        }
        table.appendChild(tr);
        data.forEach(fnEachRow);
        return table;
    };
    self.setDataTable = function(id, data, options) {
        var tableParent = dom.getById(id);
        if (tableParent == null) {
            console.error(tableParent + " do not exists");
        }
        var table = self.getTableFromData(data, options);
        tableParent.clear();
        table.addClass("table table-hover");
        tableParent.appendChild(table);
        return table;
    };
    self.DataTable = function(containerId, data, options) {
        var me = this;
        me = self.setDataTable(containerId, data, options);
        return me;
    };
}

(function() {
    var States = {
        PENDING: "pending",
        FULLFILED: "fullfiled",
        REJECTED: "rejected",
        validate: function(state) {
            return state == "pending" || state == "fullfiled" || state == "rejected";
        }
    };
    var isRSPromise = function(obj) {
        if (typeof obj == "undefined") {
            return false;
        }
        return obj.constructor === self.constructor;
    };
    var setImmediate = function(fn) {
        setTimeout(fn, 0);
    };
    var setState = function(promise, state, val) {
        if (promise.state !== States.PENDING) {
            return;
        }
        if (promise.state === state) {
            return;
        }
        if (!States.validate(state)) {
            return;
        }
        promise.state = state;
        promise.value = val;
        if (promise.state === States.REJECTED) {
            console.error(promise.value);
        }
        promise.processQueue();
    };
    function RSPromise(functionPromise) {
        var self = this;
        self.promiseQueue = [];
        self.onFullfilled = null;
        self.onRejected = null;
        self.state = States.PENDING;
        self.value = null;
        self.then = function(onFullfilled, onRejected) {
            var promiseToQueue = new RSPromise();
            if (typeof onFullfilled != "undefined") {
                promiseToQueue.onFullfilled = onFullfilled;
            }
            if (typeof onReject != "undefined") {
                promiseToQueue.onRejected = onRejected;
            }
            self.promiseQueue.push(promiseToQueue);
            self.processQueue();
            return promiseToQueue;
        };
        var fulfillBackfall = function(val) {
            return val;
        };
        var rejectBackfall = function(err) {
            throw err;
        };
        var loopQueue = function() {
            while (self.promiseQueue.length > 0) {
                var currentPromise = self.promiseQueue.shift();
                var promiseHandler = fulfillBackfall;
                if (self.state == States.FULLFILED) {
                    if (currentPromise.onFulfilled !== null) {
                        promiseHandler = currentPromise.onFullfilled;
                    }
                }
                if (self.state == States.REJECTED) {
                    promiseHandler = rejectBackfall;
                    if (currentPromise.onRejected !== null) {
                        promiseHandler = currentPromise.onRejected;
                    }
                }
                var returnedValue = null;
                try {
                    returnedValue = promiseHandler(self.value);
                } catch (ex) {
                    setState(currentPromise, States.Rejected, ex);
                    continue;
                }
                resolve(currentPromise, returnedValue);
            }
        };
        self.processQueue = function() {
            if (self.state == States.PENDING) {
                return;
            }
            setImmediate(loopQueue);
        };
        var resolve = function(promise, value) {
            if (promise === value) {
                setState(promise, States.REJECTED, new TypeError("Promise and value are the same"));
                return;
            }
            if (isRSPromise(value)) {
                if (value.state === States.PENDING) {
                    value.then(function(val) {
                        resolve(promise, val);
                    }, function(err) {
                        setState(promise, States.REJECTED, err);
                    });
                    return;
                }
                setState(promise, value.state, value.value);
                return;
            }
            if (typeof value == "object" || typeof value == "function") {
                var thenHandler = null;
                try {
                    thenHandler = value.then;
                } catch (ex) {
                    setState(promise, States.REJECTED, ex);
                }
                if (typeof thenHandler == "function") {
                    var isCalled = false;
                    try {
                        value.then.call(value, function(y) {
                            if (!isCalled) {
                                resolve(promise, y);
                                isCalled = true;
                            }
                        }, function(r) {
                            if (!isCalled) {
                                setState(promise, States.REJECTED, r);
                                isCalled = true;
                            }
                        });
                    } catch (ex) {
                        if (!isCalled) {
                            setState(promise, States.REJECT, ex);
                        }
                    }
                    return;
                }
                setState(promise, States.FULLFILED, value);
                return;
            }
            setState(promise, States.FULLFILED, value);
            return;
        };
        if (functionPromise) {
            functionPromise(function(value) {
                resolve(self, value);
            }, function(error) {
                setState(self, States.REJECTED, error);
            });
        }
    }
    window.RSPromise = RSPromise;
})();

function Http() {
    var self = this;
    var dom = new Dom();
    var headers = new RSObject();
    this.setHeader = function(key, value) {
        headers[key] = value;
    };
    this.getHeaders = function() {
        return headers;
    };
    this.clearHeaders = function() {
        headers = {};
    };
    this.get = function(url, data) {
        return self.request("GET", url, data);
    };
    this.post = function(url, data) {
        return self.request("POST", url, data);
    };
    this.put = function(url, data) {
        return self.request("PUT", url, data);
    };
    this.delete = function(url, data) {
        return self.request("DELETE", url, data);
    };
    this.head = function(url, data) {
        return self.request("HEAD", url, data);
    };
    this.postMultiPart = function(form) {
        return new RSPromise(function(resolve, reject) {
            var xhttp = new XMLHttpRequest();
            xhttp.open("post", form.action, true);
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4) {
                    if (xhttp.status == 200) {
                        var res = {};
                        res.headers = {};
                        var headers = xhttp.getAllResponseHeaders();
                        headers = headers.split("\n");
                        var fnEach = function(item, index, collection) {
                            if (item !== "") {
                                var parts = item.split(": ");
                                var tmp = {};
                                res.headers[parts[0].trim()] = parts[1].trim();
                            }
                        };
                        headers.forEach(fnEach);
                        res.status = xhttp.status;
                        if (res.headers["Content-Type"] == "application/json") {
                            res.data = JSON.parse(xhttp.response);
                        } else {
                            res.data = xhttp.response;
                        }
                        resolve(res);
                    } else {
                        reject(xhttp);
                    }
                }
            };
            var formData = new FormData(form);
            xhttp.send(formData);
        });
    };
    this.request = function(method, url, data) {
        return new RSPromise(function(resolve, reject) {
            var localOnError = null;
            if (typeof reject == "undefined") {
                localOnError = function(statusText) {
                    console.error(statusText);
                };
            } else {
                localOnError = reject;
            }
            var fnStateChange = function() {
                if (xhttp.readyState == 4) {
                    if (xhttp.status == 200) {
                        var res = {};
                        res.headers = {};
                        var headers = xhttp.getAllResponseHeaders();
                        headers = headers.split("\n");
                        var fnEach = function(item, index, collection) {
                            if (item !== "") {
                                var parts = item.split(": ");
                                var tmp = {};
                                res.headers[parts[0].trim().toLowerCase()] = parts[1].trim();
                            }
                        };
                        headers.forEach(fnEach);
                        res.status = xhttp.status;
                        if (res.headers["content-type"].contains("application/json")) {
                            res.data = JSON.parse(xhttp.response);
                        } else {
                            res.data = xhttp.response;
                        }
                        resolve(res);
                    } else {
                        localOnError(xhttp);
                    }
                }
            };
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = fnStateChange;
            var setHeaders = function() {
                var fnEach = function(value, key, obj) {
                    xhttp.setRequestHeader(key, value);
                };
                headers.forEach(fnEach);
            };
            var toPost = null;
            var isBinary = false;
            if (typeof data != "undefined") {
                if (data !== null) {
                    if (String(data.constructor).contains("function File()")) {
                        toPost = data;
                        isBinary = true;
                    } else {
                        data = new RSObject(data);
                        toPost = data.serialize();
                    }
                }
            }
            if (method == "GET") {
                if (toPost !== "" && toPost !== null) {
                    url = url + "?" + toPost;
                }
                xhttp.open(method, url, true);
                setHeaders();
                xhttp.send();
            } else {
                xhttp.open(method, url, true);
                if (isBinary) {
                    setHeaders();
                    xhttp.setRequestHeader("Content-type", "multipart/form-data; boundary=blob");
                    xhttp.send(toPost);
                } else {
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    setHeaders();
                    xhttp.send(toPost);
                }
            }
        });
    };
    self.downloadFile = dom.submitForm;
}

window.http = new Http();

function Local() {
    this.set = function(itemKey, itemValue) {
        if (typeof itemValue == "object") {
            itemValue = JSON.stringify(itemValue);
        }
        window.localStorage.setItem(itemKey, itemValue);
    };
    this.remove = function(itemKey) {
        window.localStorage.removeItem(itemKey);
    };
    var getAll = function() {
        var i = 0;
        var len = localStorage.length;
        var params = {};
        for (i = 0; i < len; ++i) {
            var itemValue = localStorage.getItem(localStorage.key(i));
            var output = {};
            if (JSON.tryParse(itemValue, output)) {
                params[localStorage.key(i)] = output;
            } else {
                params[localStorage.key(i)] = itemValue;
            }
        }
        return params;
    };
    this.get = function(itemKey) {
        if (typeof itemKey == "undefined") {
            return getAll();
        }
        if (window.localStorage.getItem(itemKey) === null) {
            console.warn("Item " + itemKey + " do not exists");
            return null;
        }
        var output = {};
        var itemValue = window.localStorage.getItem(itemKey);
        if (JSON.tryParse(itemValue, output)) {
            return output.data;
        } else {
            return itemValue;
        }
    };
    this.exists = function(itemKey) {
        return window.localStorage.getItem(itemKey) !== null;
    };
}

window.local = new Local();

function GeoPosition() {
    var dlg = new Dialog();
    var local = new Local();
    this.Lat = 0;
    this.Lng = 0;
    this.LatLng = null;
    this.Geocode = [];
    this.StreetNumber = "";
    this.Route = "";
    this.SubLocality = "";
    this.City = "";
    this.State = "";
    this.Country = "";
    this.PostalCode = "";
    this.Address = "";
}

function Geo() {
    var fn = null;
    this.onError = function(error) {
        dlg.showAlert("Hubo problemas obteniendo la posicion");
    };
    this.onSuccessGetPosition = function(position) {
        local.remove("currentGeoPosition");
        var geoPos = new GeoPosition();
        geoPos.Lat = parseFloat(position.coords.latitude);
        geoPos.Lng = parseFloat(position.coords.longitude);
        geoPos.LatLng = new google.maps.LatLng(geoPos.Lat, geoPos.Lng);
        this.coder = new google.maps.Geocoder();
        this.coder.geocode({
            latLng: geoPos.LatLng
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var arrAddress = results[0].address_components;
                    var i = 0;
                    for (i = 0; i < arrAddress.length; i++) {
                        switch (arrAddress[i].types[0]) {
                          case "street_number":
                            geoPos.StreetNumber = arrAddress[i].long_name;
                            break;

                          case "route":
                            geoPos.Route = arrAddress[i].long_name;
                            break;

                          case "sublocality_level_1":
                            geoPos.SubLocality = arrAddress[i].long_name;
                            break;

                          case "locality":
                            geoPos.City = arrAddress[i].long_name;
                            break;

                          case "administrative_area_level_1":
                            geoPos.State = arrAddress[i].long_name;
                            break;

                          case "country":
                            geoPos.Country = arrAddress[i].long_name;
                            break;

                          case "postal_code":
                            geoPos.PostalCode = arrAddress[i].long_name;
                            break;
                        }
                    }
                    geoPos.Address = geoPos.Route + ", " + geoPos.StreetNumber + ", " + geoPos.SubLocality + ", " + geoPos.City + ", " + geoPos.State + ", " + geoPos.Country;
                    local.set("currentGeoPosition", JSON.stringify(geoPos));
                    fn(geoPos);
                } else {
                    dlg.showAlert("No results found", "Error", "Ok");
                }
            } else {
                dlg.showAlert("Geocoder failed due to: " + status, "Error", "Ok");
            }
        });
    };
    this.getPositionAddress = function(callBack) {
        fn = callBack;
        navigator.geolocation.getCurrentPosition(this.onSuccessGetPosition, this.onError);
    };
}

function PubSub() {
    var self = this;
    self.channels = {}, self.subscribe = function(channel, onPublish) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push(onPublish);
    };
    self.publish = function(channel, data) {
        if (!this.channels[channel] || this.channels[channel].length < 1) {
            return;
        }
        this.channels[channel].forEach(function(onPublish) {
            onPublish(data || {});
        });
    };
}

function Restful(resourceUrl) {
    var http = new Http();
    var self = this;
    var responseHandler = null;
    var uriParamRegex = /:\b[a-z]+/g;
    var match = uriParamRegex.exec(resourceUrl);
    if (typeof match != "undefined") {
        if (match.length > 0) {
            match = match[0];
            var key = match.replace(":", "");
            if (typeof self[key] != "undefined") {
                resourceUrl = resourceUrl.replace(match, self[key]);
            } else {
                resourceUrl = resourceUrl.replace(match, "");
            }
        }
    }
    var setData = function() {
        var data = {};
        var fnEach = function(key, index, arr) {
            var value = self[key];
            if (typeof value != "function") {
                data[key] = value;
            }
        };
        var keys = Object.keys(self);
        keys.forEach(fnEach);
        return data;
    };
    var createCollection = function(response) {
        var result = [];
        var fnEach = function(item, index, arr) {
            var r = new window["Restful"](resourceUrl);
            var fnEachItem = function(value, key, obj) {
                r[key] = value;
            };
            item.forEach(fnEachItem);
            result.push(r);
        };
        response.forEach(fnEach);
        return result;
    };
    var updateModel = function(model) {
        var fnEach = function(value, key, obj) {
            self[key] = value;
        };
        model.forEach(fnEach);
    };
    var onGet = function(response) {
        if (typeof response == "object") {
            if (response instanceof Array) {
                if (typeof responseHandler != "undefined") {
                    var collection = createCollection(response);
                    responseHandler(collection);
                    responseHandler = null;
                }
            } else {
                updateModel(response);
            }
        } else {
            console.error("Response is neither Array nor Object.");
        }
    };
    this.get = function(fnResponse) {
        if (typeof fnResponse != "undefined") {
            responseHandler = fnResponse;
        }
        http.get(resourceUrl, null, onGet);
    };
    this.post = function() {
        var data = setData();
        http.post(resourceUrl, data, onRequest);
    };
    this.put = function() {
        var data = setData();
        http.put(resourceUrl, data, onRequest);
    };
    this.delete = function() {
        var data = setData();
        http.delete(resourceUrl, data, onRequest);
    };
    this.head = function() {
        var data = setData();
        http.head(resourceUrl, data, onRequest);
    };
}

function View(id) {
    var self = this;
    var dom = new Dom();
    self.contentId = id;
    self.content = dom.getById(self.contentId);
    self.httpR = null;
    self.setHttp = function() {
        if (this.httpR === null) {
            if (typeof http != "undefined") {
                this.httpR = http;
            } else {
                this.httpR = new Http();
            }
        }
    };
    self.setHttp();
    self.setContent = function() {
        self.content = dom.getById(self.contentId);
    };
    self.loadUrl = function(url, data) {
        return new RSPromise(function(resolve, reject) {
            self.setContent();
            if (data === null || typeof date == "undefined") {
                data = new RSObject(data);
            } else if (data.constructor.toString().contains("Object")) {
                data = new RSObject(data);
            }
            return self.httpR.post(url, data).then(function(response) {
                var template = String(response.data);
                template = self.populateTemplate(template, data);
                self.content.innerHTML = template;
                dom.bindData();
                if (typeof resolve != "undefined") {
                    resolve();
                }
            });
        });
    };
    self.loadTemplate = function(id, data) {
        if (data === null) {
            data = new RSObject(data);
        } else if (data.constructor.toString().contains("Object")) {
            data = new RSObject(data);
        }
        var html = dom.getById(id).innerHTML;
        self.loadHTML(html, data);
        dom.bindData();
    };
    self.loadHTML = function(html, data) {
        self.setContent();
        html = self.populateTemplate(html, data);
        self.content.innerHTML = html;
        dom.bindData();
    };
    self.populateTemplate = function(template, data) {
        if (typeof data != "undefined" && data !== null) {
            if (typeof data.length != "undefined") {
                var result = "";
                var fEach = function(item, index, collection) {
                    result += self.populateTemplate(template, item);
                };
                data.forEach(fEach);
                return result;
            } else {
                if (data !== null) {
                    data = new RSObject(data);
                    var jsonString = JSON.stringify(data);
                    jsonString = jsonString.encodeUri();
                    template = template.replaceAll("$itemJson", jsonString);
                    var fn = function(value, key, obj) {
                        var find = "$" + key;
                        template = template.replaceAll(find, value);
                    };
                    data.forEach(fn);
                }
            }
        }
        var reg = new RegExp("\\$[a-zA-Z0-9]+", "gi");
        var variables = template.match(reg);
        var fnEach = function(item, index, collection) {
            var varName = item.replace("$", "");
            if (typeof window[varName] != "undefined") {
                template = template.replaceAll(item, window[varName]);
            }
        };
        if (variables !== null) {
            variables.forEach(fnEach);
        }
        return template;
    };
}

function Modal() {
    var self = this;
    var dom = new Dom();
    var http = new Http();
    var divModal = dom.getById("modal");
    var divModalContent = dom.getById("modalContent");
    self.getContainer = function() {
        return divModal;
    };
    var fnLoadModal = function() {
        if (divModal === null) {
            divModal = dom.create("div");
            divModal.id = "modal";
            divModal.addClass("modal");
        }
        if (divModalContent === null) {
            divModalContent = dom.create("div");
            divModalContent.id = "modalContent";
            divModalContent.addClass("modalContent");
            divModal.appendChild(divModalContent);
        }
        if (dom.getById("modal") === null) {
            var body = dom.get("body");
            body.appendChild(divModal);
        }
    };
    rs.onReady(fnLoadModal);
    self.showUrl = function(url, data) {
        divModalContent.style.width = "70%";
        divModalContent.style.height = "70vh";
        divModalContent.style.marginTop = "20vh";
        divModalContent.clear();
        var view = new View("modalContent");
        if (typeof data != "undefined") {
            view.loadUrl(url, data);
        } else {
            view.loadUrl(url);
        }
        divModal.style.display = "block";
        http.post(url, null, function(response) {
            var view;
            var temp = "";
            if (typeof data != "undefined") {
                view = new View();
                temp = view.populateTemplate(response.data, data);
            } else {
                temp = response.data;
            }
            divModalContent.innerHTML = temp;
            divModal.style.display = "block";
        });
    };
    self.showTemplate = function(templateId, data) {
        divModalContent.style.width = "70%";
        divModalContent.style.height = "70vh";
        divModalContent.style.marginTop = "20vh";
        divModalContent.clear();
        var template = dom.getById(templateId);
        var temp = "";
        if (typeof data != "undefined") {
            var view = new View();
            temp = view.populateTemplate(template.innerHTML, data);
        } else {
            temp = template.innerHTML;
        }
        divModalContent.innerHTML = temp;
        divModal.style.display = "block";
    };
    self.showInfo = function(title, message, buttonText) {};
    self.showWait = function(message) {
        divModalContent.style.width = "50%";
        divModalContent.style.height = "25vh";
        divModalContent.style.marginTop = "25vh";
        divModalContent.clear();
        if (typeof message == "undefined") {
            message = "Espere, por favor";
        }
        var txt = document.createTextNode(message);
        divModalContent.appendChild(txt);
        divModal.style.display = "block";
    };
    self.hide = function() {
        divModal.style.display = "none";
        divModalContent.clear();
    };
}

function Watcher() {
    var self = this;
    this.collection = [];
    this.add = function(name, fn) {
        var item = {};
        item.name = name;
        item.currentValue = rs.returnValue(name);
        item.function = fn;
        this.collection.push(item);
    };
    var fn = function() {
        var fnEach = function(item, index, arr) {
            var val = rs.returnValue(item.name);
            if (val != item.currentValue) {
                item.function(item.name);
                item.currentValue = val;
            }
        };
        self.collection.forEach(fnEach);
    };
    setInterval(fn, 200);
}