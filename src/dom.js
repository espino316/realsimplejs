/**
 * Handles the dom
 *
 * Dependencies RS, Dialog
 *
 * @return {undefined}
 */
RS.Dom = function () {
  var self = this;
  var arrowUp = " " + RS.Strings.unescapeHTML("&#8679;");
  var arrowDown = " " + RS.Strings.unescapeHTML("&#8681;");

  var getInput = function(name, value) {
    var input = dom.create("input");
    input.setAttribute( "name", name );
    input.setAttribute( "value", value );
    return input;
  }; // end function getInput

  self.submitForm = function( url, data ) {
    var form = dom.create("form");
    var keys = Object.keys( data );
    keys.forEach(
      function( item, index, collection ) {
        var input = getInput( item, data[item] );
        form.appendChild( input );
      } // end anonymous forEach
    ); // end forEach

    form.setAttribute( "method", "post" );
    form.setAttribute( "action", url );
    document.body.appendChild( form );
    form.submit();
    document.body.removeChild( form );
  }; // end function getForm

  /**
   * Sets an on enter to a element
   *
   * @param {HTMLElement} element The element to add the behavior
   * @param {Function} callback The function to call on enter
   *
   * @return undefined
   */
  self.onEnter = function(element, callback) {
    element.onkeyup = function() {
      var e = event;
      if (e.keyCode == 13) {
        callback();
      } // end if enter
    }; // end onkeyup
  }; // end function onEnter

  self.get = function(selector) {
    var items = document.querySelectorAll(selector);
    if (items.length == 1) {
      return items[0];
    } // end if length 1
    return items;
  };

  self.getAll = function(selector) {
    var items = document.querySelectorAll(selector);
    return items;
  };

  self.getById = function(id) {
    return document.getElementById(id);
  };

  /**
   * Sets the file from computer
   */
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
        } // end if fn not undefined
      };
      reader.readAsDataURL(input.files[0]);
    } // end if inputfiles
    return result;
  }; // end function getFile

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
    } // end if isNotValid
    return isValid;
  }; // end function validateInputs

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
    if ( typeof value == "undefined" || value === null ) {
      value = data[0][valueField];
    } // end if no value
    var forEachItem = function(item, key, arr) {
      var option = self.create("option");
      option.value = item[valueField];
      option.innerHTML = item[textField];
      select.appendChild(option);
    };

    data.forEach(forEachItem);
    select.value = value;
  }; // end function populateSelect

  self.create = function(nodeName) {
    var element = document.createElement(nodeName);

    if (typeof rs != "undefined" &&
        typeof rs.config != "undefined" &&
        rs.config !== null) {
      if (typeof rs.config.options.useMVC != "undefined") {
        if (rs.config.options.useMVC) {
          self.setMVCListener(element);
        } // end if useMVC true
      } // end if useMVC defined
    } // end if self.config

    return element;
  }; // end create

  /**
   * This function will set a listener onchange of the value for the input
   */
  self.setMVCListener = function(input) {
    var setTwoWaysBinding = function(element, bindable) {
      // hacer otra funcion para los setters and getters
      var parts = bindable.split(".");
      if (parts.length > 1) {
        var propName = parts[parts.length - 1];
        parts.pop();
        var obj = parts.join(".");
        if (rs.evalUndefined(obj)) {
          rs.assignValue(obj, "{}");
        } // end if obj undefined

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
            } // end if not activeElement
          } // end if nodeName is img
        }; // end fnSet

        rs.defineSetter(obj, propName, fnSet);
        rs.defineGetter(obj, propName, fnGet);
      } // if parts
    }; // end function setTwoWaysBinding

    /**
     * This function will be set to inputs
     */
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
        } // end if nodename

        var current = rs.returnValue(bindable);
        if (current != val) {
          rs.assignValue(bindable, val);
          var bindedElements = document.querySelectorAll(
            "[data-bind='" + bindable + "']"
          );
          var len = bindedElements.length;
          var i;
          var property;

          var forEachBinded = function(element, key, arr) {
            nodeName = element.nodeName.toLowerCase();
            if (nodeName == "select") {
              element.value = rs.returnValue(bindable);
            } else {
              element.innerHTML = rs.returnValue(bindable);
            } // end if nodeName select
          }; // end forEachBinded

          Array.prototype.forEach.call(bindedElements, forEachBinded);
        } // end if current != val
      } // end if bindable
    }; // end onChange

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
        } // end switch
        break;
      case "textarea":
        input.addEventListener("keyup", onChange);
        input.addEventListener("blur", onChange);
        break;
      case "select":
        input.addEventListener("change", onChange);
        break;
      default:
      // No input
    } // end switch

    var bindable = input.getAttribute("data-bind");
    var twoways = input.getAttribute("data-bind-mode");

    if (twoways !== null) {
      setTwoWaysBinding(input, bindable);
    }
    rs.assignValue(bindable, null);
  }; // end end setMVCListener

  self.bindData = function() {
    var self = this;
    var forEachInput = function(input, key, arr) {
      self.setMVCListener(input);
    }; // end function forEachInput

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
      self.populateSelect(
        select,
        dataSource,
        valueField,
        textField,
        selectValue
      );
    }; // end forEachSelect

    Array.prototype.forEach.call(selectElements, forEachSelect);

    var bindedElements = document.querySelectorAll(
      "[data-bind],[data-source]"
    );

    var len = bindedElements.length;
    var i;
    var property;

    var forEachBinded = function(element, key, arr) {
      var nodeName = element.nodeName.toLowerCase();
      var bindable = element.getAttribute("data-bind");
      var dataRepeater = element.getAttribute("data-repeater");

      if (
        nodeName == "select" || nodeName == "input" || nodeName == "textarea"
      ) {
        if (!rs.evalUndefined(bindable)) {
          var val = rs.returnValue(bindable);
          if ( val !== null ) {
            element.value = val;
          }
        } // end if bindable
      } else if (nodeName == "img") {
        element.src = rs.returnValue(bindable);
      } else if (nodeName == "table") {
        bindable = element.getAttribute("data-source");
        if (!rs.evalUndefined(bindable)) {
          // Here we parse the table
          var ths = element.querySelectorAll("tr > th");
          var options = {};
          var columns = [];
          var column = {};

          if (element.getAttribute("class") !== null) {
            options.class = element.getAttribute("class");
          } // end if class

          // for each th search data-field, just like RsPhp
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
                column.onclickFormatFields = th.getAttribute(
                  "data-onclick-fields"
                );
                column.onclickFormat = th.getAttribute("data-onclick-format");

                if (column.onclickFormatFields !== null) {
                  column.onclickFormatFields = column.onclickFormatFields.split(
                    ","
                  );
                }

                if (column.urlFormatFields !== null) {
                  column.urlFormatFields = column.urlFormatFields.split(",");
                }

                columns.push(column);
                break;
              default:
            }
          }; // end function fnEachTh

          ths.forEach(fnEachTh);
          element.clear();
          var data = rs.returnValue(bindable);
          options.columns = columns;
          var newTable = self.getTableFromData(data, options);
          self.replaceTable(element, newTable);
        } // end if bindable
      } else if ( dataRepeater == "true" ) {
        var data = rs.returnValue( element.getAttribute("data-source") );
        if ( data === null ) {
          console.error( "DataRepeater.data is null" );
          return;
        }
        var view = new View();
        var temp = view.populateElement( element.firstElementChild, data );
        element.clear();
        if ( temp.constructor.toString().contains("Array") ) {
          temp.forEach(
            function( item ) {
              element.append(item);
            } // end anonymous foreach
          ); // end temp for each
        } else {
          element.append(temp);
        } // end if is array
      } else {
        element.innerHTML = rs.returnValue(bindable);
      } // end if nodeName
    }; // end forEachBinded

    Array.prototype.forEach.call(bindedElements, forEachBinded);
  }; // end function bindData

  self.replaceTable = function(table, newTable) {
    table.parentNode.replaceChild(newTable, table);
  }; // end function replaceTable

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
          if (
            nodeName == "select" ||
              nodeName == "input" ||
              nodeName == "textarea"
          ) {
            element.value = rs.returnValue(bindable);
          } else {
            element.innerHTML = rs.returnValue(bindable);
          } // end if nodeName select
        } // end if not undefined
      } // end if bindable = variableName
    }; // end forEachBinded

    Array.prototype.forEach.call(bindedElements, forEachBinded);
  }; // end function bind

  /**
   * Adds a model to the current memory stack
   */
  self.addModel = function(name, data) {
    var fn = function(name) {
      console.log(name + " has changed");
      // self.bind( name );
      // here we look for data-bind and changed them
    }; // end fn
    if (data.constructor != "RSObject") {
      data = new RSObject(data);
    } // end if
    var fnEach = function(value, key, obj) {
      watcher.add(name + "." + key, fn);
    }; // end fnEach
    data.forEach(fnEach);
    window[name] = data;
  }; // end function addModel

  /**
   * Gets a table element from a json data
   *
   * @param {Array} data An array of json objects
   * @param {Object} options An object with key value pair options for the table
   *
   * @return {HTMLElement}
   */
  self.getTableFromData = function(data, options) {
    /**
     * Gets the rows checked, in a table with checkboxes
     *
     * @param {String} table The table's id
     *
     * @return {Array}
     */
    var _checkedRows = function() {
      var self = this;
      var rows = [];
      self.forEachRow(
        function(row, index, arr) {
          row.forEachCell(
            function(cell, cellIndex, cellArray) {
              cell.childNodes.forEach(
                function(node, nodeIndex, nodeArray) {
                  if (node.type == "checkbox") {
                    if (node.checked) {
                      rows.push(row);
                    } // end if checked
                  } // end if checkbox
                } // end function anonymous foreach node
              ); // end foreach childNode
            } // end function anonymour foreach cell
          ); // end forEachCell
        } // end function anonymous foreach
      ); // end forEachRow

      return rows;
    }; // end function getCheckedRows

    /**
     * Applies for each to cells in a row
     *
     * @param fn {Function} The function foreach
     *
     * @return {Function}
     */
    var _forEachCell = function(fn) {
      var self = this;
      var item = null;
      var arr = self.cells;
      var i = 0;

      for (i = 0; i < arr.length; i++) {
        item = arr[i];
        fn(item, i, arr);
      } // end for
    }; // end forEachCell

    /**
     * Applies for each to rows in a table
     *
     * @param fn {Function} The function foreach
     *
     * @return {Function}
     */
    var _forEachRow = function(fn) {
      var self = this;
      var item = null;
      var arr = self.rows;
      var i = 0;

      for (i = 0; i < arr.length; i++) {
        item = arr[i];
        fn(item, i, arr);
      } // end for
    }; // end function forEachRow

    if (typeof data == "undefined") {
      console.error("Table data is undefined");
      dlg.showAlert("Los datos no estan definidos", "Error", "Ok");
      return;
    } // end if

    if (data.length == 0) {
      return dom.create("table");
    } // end if data len = 0

    var table = self.create("table");
    table.forEachRow = _forEachRow;
    table.checkedRows = _checkedRows;
    table.sort = function(property, ascDesc) {
      if (typeof ascDesc == "undefined") {
        ascDesc = "asc";
      } // end if ascDesc is undefined
    }; // end function table.sort

    if (typeof options != "undefined") {
      if (typeof options.class != "undefined") {
        table.addClass(options.class);
      } // if class not undefined

      if (typeof options.id != "undefined") {
        table.id = options.id;
      } // end if id defined
    } // end if options not undefined

    var firstRow = data[0];
    var keys = Object.keys(firstRow);
    var th = null;

    var clearRows = function() {
      var len = table.rows.length;
      while (table.rows.length > 1) {
        table.deleteRow(1);
      } // end while rows
    }; // end function clearRows

    var fnEachColumn = function(item, index, array) {
      th = self.create("th");
      th.setAttribute("data-sort", "asc");
      th.style.cursor = "pointer";

      var text = item + arrowUp;

      if (typeof item.name != "undefined") {
        text = item.name + arrowUp;
      } // end if name

      if (typeof item.header != "undefined") {
        text = item.header + arrowUp;
      } // end if item header

      th.addText(text);

      var sortClick = function() {
        var self = this;
        var sort = self.getAttribute("data-sort");
        var arrow = "";
        var sortColumn = item;

        if (typeof item.name != "undefined") {
          sortColumn = item.name;
        } // end if name defined

        if (sort == "asc") {
          sort = "desc";
          arrow = arrowDown;
          data.sortDesc(sortColumn);
        } else {
          sort = "asc";
          arrow = arrowUp;
          data.sortAsc(sortColumn);
        } // end if as

        self.setAttribute("data-sort", sort);

        sortColumn += arrow;

        if (typeof item.header != "undefined") {
          sortColumn = item.header + arrow;
        }

        // Set header text
        self.innerText = sortColumn;
        // Clear rows
        clearRows();
        // Add rows again
        data.forEach(fnEachRow);
      }; // end sortClick function

      th.addEventListener("click", sortClick);
      tr.appendChild(th);
    }; //end fnEachColumn

    var fnEachRow = function(obj, i, arr) {
      var fnEach = function(item, index, array) {
        var td = self.create("td");
        td.addText(obj[item]);
        tr.appendChild(td);
      }; // end function fnEach

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
            if (
              typeof item.transform != "undefined" &&
                typeof item.transform == "function"
            ) {
              td.addText(item.transform(row[item.name]));
            } else if (typeof options.isNull != "undefined") {
              if (row[item.name] === null) {
                td.addText(options.isNull);
              } // end if null
            } else {
              td.addText(row[item.name]);
            } // end if item.coalesce
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
              if (
                dataTextFormat !== null &&
                  typeof dataTextFormat != "undefined"
              ) {
                if (
                  dataTextFormatFields !== null &&
                    typeof dataTextFormatFields != "undefined"
                ) {
                  var fnEach = function(fieldName, index, fields) {
                    var toFind = "@" + fieldName;
                    dataTextFormat = dataTextFormat.replace(
                      toFind,
                      row[fieldName]
                    );
                  }; // end fnEach
                  dataTextFormatFields.forEach(fnEach);
                  linkText = dataTextFormat;
                } else {
                  linkText = dataTextFormat;
                } // end if url fields
              } // end if urlFormat
            }
            hyperlink.appendChild(document.createTextNode(linkText));

            var urlFormat = item.urlFormat;
            var urlFormatFields = item.urlFormatFields;
            var url = "#";
            if (urlFormat !== null && typeof urlFormat != "undefined") {
              if (
                urlFormatFields !== null &&
                  typeof urlFormatFields != "undefined"
              ) {
                var fnEach = function(fieldName, index, fields) {
                  var toFind = "@" + fieldName;
                  urlFormat = urlFormat.replace(toFind, row[fieldName]);
                }; // end fnEach
                urlFormatFields.forEach(fnEach);
                url = urlFormat;
              } else {
                url = urlFormat;
              } // end if url fields
            } // end if urlFormat
            hyperlink.href = url;

            var onclickFormat = item.onclickFormat;
            var onclickFormatFields = item.onclickFormatFields;
            var onclick = "";
            if (
              onclickFormat !== null && typeof onclickFormat != "undefined"
            ) {
              if (
                onclickFormatFields !== null &&
                  typeof onclickFormatFields != "undefined"
              ) {
                var fnEach = function(fieldName, index, fields) {
                  var toFind = "@" + fieldName;
                  onclickFormat = onclickFormat.replace(
                    toFind,
                    row[fieldName]
                  );
                }; // end fnEach
                onclickFormatFields.forEach(fnEach);
                onclick = onclickFormat;
              } else {
                onclick = onclickFormat;
              } // end if url fields
            } // end if urlFormat

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
                }; // end fnEach

                urlFormatFields.forEach(fnEach);
                url = urlFormat;
              } else {
                url = urlFormat;
              } // end if url fields
            } // end if urlFormat

            img.src = url;
            img.style.height = item.height;
            img.style.width = item.width;
            td.appendChild(img);
            break;

        } // end switch

        tr.appendChild(td);
      }; // end function fnEach

      tr = self.create("tr");
      tr.forEachCell = _forEachCell;
      tr.data = obj;

      if (typeof options != "undefined") {
        if (typeof options.onclick != "undefined") {
          var caller = function() {
            options.onclick(obj);
          }; // end caller
          tr.addEventListener("click", caller);
        } // end if onclick
      } // end if options

      if (typeof options != "undefined") {
        if (typeof options.columns != "undefined") {
          options.columns.forEach(fnEachColumn);
        } else {
          keys.forEach(fnEach);
        } // end if then else columns
      } else {
        keys.forEach(fnEach);
      } // end if then else options

      if (typeof options != "undefined") {
        if (typeof options.backgroundColorField != "undefined") {
          tr.style.backgroundColor = obj[options.backgroundColorField];
        } // end if bgColorField
      } // end if options undefined

      table.appendChild(tr);
    }; // end function fnEachRow

    var tr = self.create("tr");
    tr.setAttribute("data-rowheader", true);
    tr.forEachCell = _forEachCell;
    tr.data = keys;

    if (typeof options != "undefined") {
      if (typeof options.columns != "undefined") {
        options.columns.forEach(fnEachColumn);
      } else {
        keys.forEach(fnEachColumn);
      } // end if then else columns
    } else {
      keys.forEach(fnEachColumn);
    } // end if then else options

    table.appendChild(tr);

    data.forEach(fnEachRow);
    return table;
  }; // end function getTableFromData

  /**
   * Creates a table in element id
   * @param id The id for the element
   * @param data The data to create the table
   * @param options The options of the table
   */
self.setDataTable = function(id, data, options) {
  var tableParent = dom.getById(id);
  if ( tableParent == null ) {
    console.error( tableParent + " do not exists" );
  } // end oif tableParent null

  var table = self.getTableFromData(data, options);
  tableParent.clear();
  table.addClass("table table-hover");
  tableParent.appendChild(table);
  return table;
}; // end function getDOMTable

  /**
   * Represents a data table
   *
   * @param {String} container The id for the container
   * @param {Array} data The data, and array or objects
   * @param {Object} options The data structure and table options
   *
   * @return {HTMLElement}
   */
  self.DataTable = function(containerId, data, options) {
    var me = this;
    me = self.setDataTable(containerId, data, options);
    return me;
  }; // end function DataTable
} // end function Dom

window.dom = new Dom();
