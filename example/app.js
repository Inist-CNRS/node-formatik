'use strict';
/**
* Module dependencies.
*/

var express = require('express')
, routes = require('./routes')
, http = require('http')
, path = require('path')
, ejs = require('ejs');

ejs.filters.state = function (b) {
  if (b === true) {
    return 'success';
  }
  else if (b === false) {
    return 'error';
  }
  else {
    return '';
  }
}



var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
  }
);

app.configure('development', function () {
    app.use(express.errorHandler());
  }
);

require('./routes/index')(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
  }
);
