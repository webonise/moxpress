"use strict";

var expect = require('chai').expect;

var moxpress = "../lib/moxpress";

describe("Moxpress:", function() {
  describe("requiring it", function() {
    it("does not explode on require", function() {
      require(moxpress);
    });
    it("does not explode on execution", function() {
      require(moxpress)();
    });
    it("provides app", function() {
      expect(require(moxpress)().app).to.be.an("object");
    });
    it("provides req", function() {
      expect(require(moxpress)().req).to.be.an("object");
    });
    it("proides res", function() {
      expect(require(moxpress)().req).to.be.an("object");
    });
  });
});

