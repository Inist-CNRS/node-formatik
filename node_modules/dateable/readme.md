[![build status](https://secure.travis-ci.org/eivindfjeldstad/dateable.png)](http://travis-ci.org/eivindfjeldstad/dateable)
# dateable
A small library that provides a few very useful methods for displaying dates, including a formatter and a parser.

## Install
	$ npm install dateable
	
## How?
```javascript
var dateable = require('dateable');

var str = dateable.format(new Date(), 'MM/DD-YYYY, hh:mm'); // e.g., 03/23-2012, 22:10

dateable.parse(str, 'MM/DD-YYYY, hh:mm') // Returns the original date
```

If you want to include text in the formatting, just escape it with either ' or ".

```javascript
var date = new Date(2009, 4, 23)
  , format = '"I went to the moon in" YYYY. "I think it was a" dddd "in" MMMM';

dateable.format(date, format); // I went to the moon in 2009. I think it was a Saturday in May
```
You can also get the answers to simple questions, such as:

```javascript
var date = new Date(2008, 4, 20);

dateable.when(date); // 4 years ago

// The same question can be asked for future days
dateable.when(new Date(2020, 4, 30)); // in 8 years

// And...
dateable.diff(new Date(2015), new Date()); // 3 years
```

## Why?
Because dealing with dates in javascript is a fucking pain in the ass!