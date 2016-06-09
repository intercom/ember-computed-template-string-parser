var assert = require('assert');
var Parser = require('../lib/parser');

describe("template-string-parser", function() {

  it("temp tests", function() {
    var parser = new Parser("");
    assert.equal(parser.sections.length, 0);
    parser = new Parser("hello");
    assert.equal(parser.sections.length, 1);
    parser = new Parser("hi ${name}");
    assert.equal(parser.sections.length, 2);
    assert.equal(parser.sections[0].type(), 'LiteralSection');
    assert.equal(parser.sections[1].type(), 'PropertySection');
    parser = new Parser("hi ${name}!");
    assert.equal(parser.sections.length, 3);
    parser = new Parser("hi ${name}, you are ${age}!");
    assert.equal(parser.sections.length, 5);
    parser = new Parser("hi ${person.name}");
    assert.equal(parser.sections.length, 2);
    parser = new Parser("${name}");
    assert.equal(parser.sections.length, 1);
    parser = new Parser("${name");
    assert.equal(parser.sections.length, 1);
    assert.equal(parser.sections[0].type(), 'LiteralSection');
    parser = new Parser("hi ${name ${name}");
    assert.equal(parser.sections.length, 2);
    assert.equal(parser.sections[1].type(), 'PropertySection');
    parser = new Parser("hi }!");
    assert.equal(parser.sections.length, 1);
  });
});
