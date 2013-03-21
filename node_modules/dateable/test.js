var dateable = require('./')
  , assert = require('assert');

dateable.formats.test = 'YYYY YY MMMM MMM "old school" MM M DD D dddd ddd hh h a A HH H mm m ss s'

var tests = module.exports = {
  'test format': function () {
    var date = new Date(2012, 4, 7, 16, 7, 3)
      , expected = '2012 12 May May old school 05 5 07 7 Monday Mon 04 4 pm PM 16 16 07 7 03 3';

    assert.equal(dateable.format(date, 'test'), expected);
  },
  
  'test parse': function () {
    var date = new Date(1992, 1, 25, 7, 0, 1)
      , expected = date.valueOf();

    date = dateable.format(date, 'test');
    assert.equal(dateable.parse(date, 'test').valueOf(), expected);
  },
  
  'test when': function () {
    var date = new Date();
    
    date.setHours(date.getHours() - 2);
    assert.equal(dateable.when(date), '2 hours ago');
  },
  
  'test diff': function () {
    var diff = dateable.diff(new Date(2000, 1), new Date(2009, 1));
    
    assert.equal(diff, '9 years');
  }
};

for (var t in tests)
  tests[t]();

console.log('All tests completed successfully');