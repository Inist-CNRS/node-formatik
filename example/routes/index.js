'use strict';


var formatik = require('../../lib/formatik.js');

module.exports = function (server, service) {

  var schema = require('./schema.json');

  server.get("/", function (req, res) {
      var form = formatik.create(schema, 'fr');
      res.render('index', {
          title: 'Home',
          form: form
        }
      );
    }
  );

  server.post("/", function (req, res) {
      var form = formatik.parse(req.body, schema, 'fr');

      if (form.isNotValid()) {
        res.render('index', {
            title: 'Home',
            form: form
          }
        );
      }
      else {
        res.render('save', {
            title: 'Save',
            data: form.mget('value')
          }
        );
      }
    }
  );

}
