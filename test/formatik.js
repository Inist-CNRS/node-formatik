'use strict';
var should = require('should')
, formatik = require('../lib/formatik.js');

describe('CSV', function () {
    /* */
    describe('#1 boolean should be true', function () {
        var data, schema, form;
        it('should', function() {
            data = { x: 1 };
            schema = { x: {type: "boolean"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.be.true;
            data = { x: true };
            schema = { x: {type: "boolean"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.be.true;
            data = { x: '1' };
            schema = { x: {type: "boolean"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.be.true;
            data = { x: 'on' };
            schema = { x: {type: "boolean"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.be.true;
          }
        );
      }
    );
    describe('#2 boolean should be false', function () {
        var data, schema, form;
        it('should', function() {
            data = { x: 0 };
            schema = { x: {type: "boolean"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.be.false;
            data = { x: false };
            schema = { x: {type: "boolean"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.be.false;
            data = { x: '0' };
            schema = { x: {type: "boolean"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.be.false;
            data = { x: 'off' };
            schema = { x: {type: "boolean"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.be.false;
          }
        );
      }
    );
    describe('#3 number should be number', function () {
        var data, schema, form;
        it('should', function() {
            data = { x: 10 };
            schema = { x: {type: "number"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.equal(10);
            data = { x: '10' };
            schema = { x: {type: "number"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.equal(10);
          }
        );
      }
    );
    describe('#4 string should be string', function () {
        var data, schema, form;
        it('should', function() {
            data = { x: 10 };
            schema = { x: {type: "string"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.equal("10");
            data = { x: '10' };
            schema = { x: {type: "string"}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.equal("10");
          }
        );
      }
    );
    /*
    describe('#5 date should be date', function () {
        var data, schema, form;
        it('should', function() {
            data = { x: '10/11/2012' };
            schema = { x: {type: "date", pattern: 'DD/MM/YYYY'}};
            form = formatik.parse(data, schema, 'fr');
            form.x.value.should.be.an.instanceOf(Date)
          }
        );
      }
    );




    /* */
  }
);
