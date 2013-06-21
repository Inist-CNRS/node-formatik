'use strict';

var dateable = require('dateable');

function getMessage(obj, lang, filter) {
  if (Array.isArray(obj)) {
    var c = obj.reduce(function (prev, cur) {
        if (!filter && cur.lang && cur.lang === lang) {
          return cur.$t;
        }
        else if (filter && cur.lang && cur.lang === lang && cur['for'] === filter) {
          return cur.$t;
        }
        else {
          return prev;
        }
      }, null
    );
    return c
  }
  else if (obj) {
    if (obj.$t) {
      return obj.$t;
    }
    else if (lang && !filter && obj[lang]) {
      return obj[lang];
    }
    else if (lang && !filter && obj.en) {
      return obj.en;
    }
    else if (lang && filter && obj[filter]) {
      return getMessage(obj[filter], lang);
    }
    else if (lang && filter && !obj[filter]) {
      return getMessage(obj, lang);
    }
    else {
      return obj;
    }
  }
  else {
    return;
  }
}

function transtype(type, object, pattern) {
  var d, n;
  if (type === "boolean" && typeof object === "boolean") {
    return object;
  }
  else if (type === "boolean" && typeof object !== "boolean") {
    if (object === '1' || object === "true" || object === "on" || object === 1 || object === true) {
      return true;
    }
    else {
      return false;
    }
  }
  else if (object === undefined) {
    return undefined;
  }
  else if (object === null) {
    return null;
  }
  else if (type === undefined || type === "string" || type === "text") {
    if (object !== null && typeof object === "string") {
      return object;
    }
    else {
      return object.toString();
    }
  }
  else if (type === "number") {
    n = Number(object);
    return isNaN(n) ? undefined : n;
  }
  else if (type === "date" && object instanceof Date) {
    return (!object || isNaN(object.valueOf())) ? undefined : object;
  }
  else if (type === "date" && typeof object === 'string' && typeof pattern === 'string' && object !== '' && pattern !== '') {
    d = dateable.parse(object, pattern);
    return (!d || isNaN(d.valueOf())) ? undefined : d;
  }
  else if (type === "date" && typeof object === 'string') {
    d = Date.parse(object);
    return (!d || isNaN(d.valueOf())) ? undefined : d;
  }
  else if (type === "date"  && typeof object === 'object') {
    d = Date.parse(object.toString());
    return (!d || isNaN(d.valueOf())) ? undefined : d;
  }
  else if (type === "date") {
    return undefined;
  }
  return object;
}
function Form() {
}
Form.prototype.isNotValid = function () {
  return !this.isValid();
}
Form.prototype.isValid = function () {
  var name, valid = true;
  for (name in this) {
    if (this.hasOwnProperty(name)) {
      if (this[name].valid === false) {
        return false;
      }
    }
  }
  return true;
}
Form.prototype.mget =  function (key) {
  var name, values = {};
  for (name in this) {
    if (this.hasOwnProperty(name)) {
      values[name] = this[name][key];
    }
  }
  return values;
}
Form.prototype.mset =  function (key, value) {
  var name, values = {};
  for (name in this) {
    if (this.hasOwnProperty(name)) {
      this[name][key] = value;
    }
  }
  return values;
}

exports.create = function (schema, langue) {
  var result = new Form();

  for (var name in schema)
  {
    if (schema.hasOwnProperty(name))
    {
      result[name] = {
        valid : null,
        value : '',
        input : '',
        error : '',
        label : '',
        help  : ''
      };

      if (schema[name]['default'] !== undefined) {
        result[name].value = schema[name]['default'];
      }

      if (schema[name].label) {
        result[name].label = getMessage(schema[name].label, langue);
      }
      if (schema[name].help) {
        result[name].help = getMessage(schema[name].help, langue);
      }
    }
  }
  return result;
}

exports.parse = function (input, schema, langue) {

  var result = new Form();

  for (var name in schema)
  {
    if (schema.hasOwnProperty(name))
    {

      result[name] = {
        valid : null,
        value : null,
        input : null,
        error : '',
        label : '',
        help  : ''
      };

      // One or more alias ?
      if (Array.isArray(schema[name].alias)) {
        schema[name].alias.forEach(function (p) {
            if (input[p] !== undefined) {
              result[name].value = input[p] || true;
            }
          }
        );
      }
      else if (typeof schema[name].alias === 'string') {
        var p = schema[name].alias;
        if (input[p] !== undefined) {
          result[name].value = input[p] || true;
        }
      }

      // fetch schema[name] value
      if (input[name] !== undefined) {
        result[name].value = input[name];
      }

      // Array conversion or not
      if (schema[name].array && !Array.isArray(result[name].value) && result[name].value !== undefined) {
        var value = result[name].value;
        result[name].value = [ value ];
      }
      if (!schema[name].array && Array.isArray(result[name].value)) {
        result[name].value = result[name].value[0];
      }
      // Save input value
      result[name].input = result[name].value;


      // Convert & Check the type
      if (Array.isArray(result[name].value)) {
        result[name].value.forEach(function (value, index) {
            result[name].value[index] = transtype(schema[name].type, value, schema[name].pattern);
          }
        );
      }
      else {
        result[name].value = transtype(schema[name].type, result[name].value, schema[name].pattern);
      }

      // List of defined values
      if (schema[name].values !== undefined && Array.isArray(schema[name].values)) {
        var belongsto = function (x) {
          return x === result[name].value;
        }
        if (schema[name].values.some(belongsto) === false) {
          delete result[name].value;
        }
      }

      // Set to default or not
      if (schema[name]['default'] !== undefined && result[name].value === undefined) {
        result[name].value = schema[name]['default'];
      }

      // Clean undefined elements
      if (Array.isArray(result[name].value)) {
        result[name].value.forEach(function (value, index) {
            if (value === undefined) {
              result[name].value.splice(index, 1);
            }
          }
        );
        if (result[name].value.length === 0) {
          result[name].value = undefined;
        }
      }
      if (result[name].input && result[name].value === undefined) {
        result[name].valid = false;
        if (schema[name].error) {
          result[name].error = getMessage(schema[name].error, langue, 'type');
        }
      }
      else if (result[name].input && result[name].value && (result[name].input !== undefined && result[name].input !== null  && (typeof result[name].input === 'string' && result[name].input.trim() !== ''))) {
        result[name].valid = true;
      }

      if (schema[name].required && (result[name].value === undefined || result[name].value === null  || (typeof result[name].value === 'string' && result[name].value.trim() === ''))) {
        result[name].valid = false;
        if (schema[name].error) {
          result[name].error = getMessage(schema[name].error, langue, 'required');
        }
      }
      else if (schema[name].required) {
        result[name].valid = true;
      }

      if (schema[name].label) {
        result[name].label = getMessage(schema[name].label, langue);
      }     
      if (schema[name].help) {
        result[name].help = getMessage(schema[name].help, langue);
      }     
    }
  }
  return result;
}

