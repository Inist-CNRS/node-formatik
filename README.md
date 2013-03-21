# Formatik

[![Build Status](https://secure.travis-ci.org/touv/node-formatik.png?branch=master)](http://travis-ci.org/touv/formatik)

Yet another module to validate associative arrays with a schema, but unlike the others implementations (see [below](./#also))
there some particulars features :

* can only validate associative arrays, (Browser form or Browser query, Mysql datasets, etc.)
* can transform type of the variables
* the messages can be specific for each error
* i18n supports for labels and messages
* origins data are never modified
* The result of the validation tries to be the most practical : 
  * all declared variables exists
  * original value & cast value are side by side
  * extremely easy to use in a template [see by yourself](./example/views/index.ejs)


## Contributors

  * [Nicolas Thouvenin](https://github.com/touv) 

# Installation

With [npm](http://npmjs.org) do:

    $ npm install formatik

# Tests

Use [mocha](https://github.com/visionmedia/mocha) to run the tests.

    $ npm install mocha
    $ mocha test

# Usage

## Basic example
```javascript

var form = require('formatik').parse(req.body, require('./schema.json'), 'fr');

if (form.isValid()) {
   console.log(form.mget('value'));
}
```

## Complete example

see the [example directory for a complete example with expressjs](./example).

# API

### parse(Object data, Object schema, String language)
**Return Output Object.**

Parse and validate ''data'' with ''schema''. Labels and Messages are choosed with ''language''.

### create(Object schema, String language)
**Return Output Object.**

Create on empty Output Object with ''schema''. Labels are choosed with ''language''.


# Schema 

## Example
```json
{
   "familyName" : {
      "type" : "text", 
      "required" : true,
      "label" : [
         {
            "lang" : "fr",
            "$t" : "Nom de famille"
         },
         {
            "lang" : "en",
            "$t" : "Family Name"
         }
      ],
      "error" : [
         {
            "lang" : "fr",
            "for" : "required",
            "$t" : "Le nom de famille est obligatoire"
         },
	 	 {
            "lang" : "en",
            "for" : "required",
            "$t" : "familly Name are required"
         }
	  ]
   }
}
```

## Description

### type

The Javascript type for cast the variable. Values can be :
* string | text
* number
* date
* boolean

### required

To indicate if the variable are required or optional. Values can be :
* true
* false (default)

### pattern

To validate the variable with a mask (or pattern). Values depended of the type of the variable.
* a REGEX for text
* a date format for date

### default

To set the variable with default value.

### maxlength

__Not yet implemeted. Contribs are welcome__

### label

The label of the variable. Values are an array of object like this : { 'lang' : 'XX', '$t' : 'The label' }

### error

The list of errors messages depending of the control. Values are an array of object like this : { 'lang' : 'XX', '$t' : 'The error message', 'for' : type|required|pattern|maxlength }

### values

List of predefined values. Values are an array.

### alias

List of alternative name of the variable.

# Output Object

The validator product an new object contains for each variable 5 fields. Also, the object provide 2 methods.

## Fields

### valid
boolean indicate if the variable is valid.
### value
the variable casted with the corresponding type.
### error
if the variable is not valid, the error message (depending of the selected language).
### label
the label of the variable (depending of the selected language)


## Methods

### mset(String name, Object value)
**Return None.**

Set one field of all the variable with the same value. Example : form.mset('valid', null) 

### mget(String name)
**Return Object.**

Get an new object with all the variable with only the value of one field. Example : form.mget('value')

## Example
```json
{
   "familyName" : {
		"valid" : true,
        "value" : "Thouvenin",
        "input" : "Thouvenin",
        "error" : null,
        "label" : "Nom de famille"
    },
   "givenName" : {
		"valid" : false,
        "value" : "",
        "input" : "",
        "error" : "Le prénom est obligatoire",
        "label" : "Prénom"
    },
   "age" : {
		"valid" : true,
        "value" : 99,
        "input" : "99",
        "error" : null,
        "label" : "Age"
    },
   "available" : {
		"valid" : true,
        "value" : true,
        "input" : "on",
        "error" : null,
        "label" : "Disponible"
    }
}
```



# Also

* https://github.com/garycourt/JSV
* https://github.com/chriso/node-validator
* https://github.com/freewil/express-form
* https://github.com/eivindfjeldstad/validate
* https://github.com/kriszyp/json-schema
* https://github.com/Baggz/Amanda
* https://github.com/bradleyg/acceptance


# License

[MIT/X11](./LICENSE)

