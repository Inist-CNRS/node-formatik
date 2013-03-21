var fs = require('fs')
  , path = require('path')
  , files = fs.readdirSync(path.join(__dirname, 'lang'))
  , langs = {}
  , lang

files.forEach(function (filename) {
  var language = filename.replace(/\.json$/, '');
  
  langs[language] = require('./lang/' + filename);
});

var units = exports.units = {
    years   : 31536000000
  , months  : 2592000000
  , weeks   : 604800000
  , days    : 86400000
  , hours   : 3600000
  , minutes : 60000
  , seconds : 1000
};

var formats = exports.formats = {};

// Set the default language
var lang = langs['en-us'];

exports.setLang = function (language) {
  if (typeof language == 'object')
    lang = language;
  else if (langs[language])
    lang = langs[language];
};

exports.format = function (date, format) {
  var tokens = /Y{2,4}|[Md]{1,4}|[DHhms]{1,2}|[Aa]|"[^"]*"|'[^']*'/g
    , date = toObject(date);
    
  format = formats[format] || format;

  return format.replace(tokens, function (part) {
    switch (part) {
      case 'YYYY':
        return pad(date.Y, 3);
      case 'YY':
        return ('' + date.Y).slice(-2);
      case 'MMMM':
      case 'MMM':
        return lang[part][date.M];
      case 'MM':
        return pad(date.M + 1);
      case 'M':
        return date.M + 1;
      case 'DD':
        return pad(date.D);
      case 'D':
        return date.D;
      case 'dddd':
      case 'ddd':
        return lang[part][date.d];
      case 'A':
        return date.A;
      case 'a':
        return date.a
      case 'H':
        return date.H
      case 'HH':
        return pad(date.H);
      case 'hh':
        return pad(date.h);
      case 'h':
        return date.h
      case 'mm':
        return pad(date.m);
      case 'm':
        return date.m
      case 'ss':
        return pad(date.s);
      case 's':
        return date.s;
      default:
        return part.slice(1, -1);
    }
  });
};

exports.parse = function (string, format) {
  var tokenizer = /Y{2,4}|[Md]{1,4}|[DHhms]{1,2}|[Aa]/g 
    , offset = 0
    , parts = {}
    , token
    , index
    , part
  
  format = formats[format] || format;
  // Strip the string from the escaped parts of the format
  format = format.replace(/"[^"]*"|'[^']*'/g, function (str) {
    string = string.replace(str.slice(1, -1), '');
    return '';
  });
  
  var stringLength = string.length;
  
  while (token = tokenizer.exec(format)) {
    index = token.index + offset;
    
    var tokenLength = token[0].length;
    part = string.substr(index, tokenLength);
    index += tokenLength - 1;
    
    // Remove characters that are not part of the format
    // e.g, MMMM > May
    part = part.replace(/\W+.*/, function (str) {
      index -= str.length;
      return '';
    });
    
    // Looks ahead for characters beyond the
    // specified format, e.g, D > 9
    while (++index < stringLength) {
      if (!(/\d|\w/).test(string[index]))
        break;
      
      part += string[index];
    }

    offset += part.length - tokenLength;

    if (/[Md]{3,4}/.test(token[0]))
      part = lang[token[0]].indexOf(part);
    else if (token[0][0] === 'M')
      part--;
      
    parts[token[0][0]] = part;
  }
  
  return toDate(parts);
};

exports.when = function (date, unit) {
  var diff = date.valueOf() - Date.now()
    , time = 'present'

  unit = unit || determineUnit(diff);
  diff = Math.round(diff / units[unit])

  if (diff !== 0)
    time = diff < 0 ? 'past' : 'future';

  diff = Math.abs(diff);
  
  return printify(lang.time[time], pluralize(diff, unit));
};

exports.diff = function (start, end, unit) {
  var diff = start.valueOf() - end.valueOf()
    , unit = unit || determineUnit(diff)
  
  diff = Math.abs(Math.round(diff / units[unit]))
  
  return pluralize(diff, unit);
};

function pluralize (value, unit) {
  var form = lang.units[unit][value > 1 ? 1 : 0];
  
  return printify(form, value);
};

function determineUnit (ms) {
  var unit;
  
  ms = Math.abs(ms);
  
  for (unit in units) {
    if (ms > units[unit])
      break;
  }
  
  return unit;
}

function printify (string) {
  var args = [].slice.call(arguments, 1)
    , offset = 0;
    
  return string.replace(/%s([0-9])*/g, function (s, n) {
    n = n || offset;
   
    if (args[n] && Array.isArray(args[n])) 
      args[n] = printify.apply(null, args[n]);

    offset++;

    return args[n];
  });
}

function pad (number, zeros) {
  return number < Math.pow(10, zeros || 1) 
    ? '0' + number 
    : '' + number;
}
 
function toDate (obj) {
  var date = new Date(0)
    , abbr = obj.a || obj.A
  
  // Handle AM/PM
  if (!obj.H && obj.h && abbr) {
    abbr = abbr.toLowerCase();
    
    if (abbr == 'pm' && obj.h < 12)
      obj.H = obj.h + 12;
  }
    
  // Handle years
  if (obj.Y && obj.Y.length == 2) {
    if (parseInt(obj.Y, 10) > 50)
      obj.Y = '19' + obj.Y;
    else
      obj.Y = '20' + obj.Y;
  }
  
  date.setFullYear(obj.Y || 0);
  date.setMonth(obj.M || 0);
  date.setDate(obj.D || 0);
  date.setHours(obj.H || 0);
  date.setMinutes(obj.m || 0);
  date.setSeconds(obj.s || 0);

  return date;
}

function toObject (date) {
  var obj = {
      Y: date.getFullYear()
    , M: date.getMonth()
    , D: date.getDate()
    , d: date.getDay()
    , H: date.getHours()
    , h: date.getHours()
    , m: date.getMinutes()
    , s: date.getSeconds()
  };

  obj.h = obj.H - (obj.H > 12 ? 12 : 0);
  obj.a = obj.H >= 12 ? 'pm' : 'am';
  obj.A = obj.a.toUpperCase();
  
  return obj;
}
