var assert = require('assert');
var Parser = require('../lib/parser');

describe("template-string-parser", function() {

  assertInvalidTemplates([
    "hello",
    "${name"
  ]);

  assertValidTemplate(
    "${name}",
    `Ember.computed("name", function() { return this.get("name"); })`
  );

  assertValidTemplate(
    "hello ${name}",
    `Ember.computed("name", function() { return "hello " + this.get("name"); })`
  );

  assertValidTemplate(
    "hello ${name}!",
    `Ember.computed("name", function() { return "hello " + this.get("name") + "!"; })`
  );

  assertValidTemplate( //TODO: perhaps use brace expansion here?
    "hello ${person.name} you are ${person.age} years old",
    `Ember.computed("person.name", "person.age", function() { return "hello " + this.get("person.name") + " you are " + this.get("person.age") + " years old"; })`
  );

  assertValidTemplate(
    "here is a single quote ${name} : '",
    `Ember.computed("name", function() { return "here is a single quote " + this.get("name") + " : '"; })`
  );

  assertValidTemplate(
    'here is a double quote ${name} : "',
    `Ember.computed("name", function() { return "here is a double quote " + this.get("name") + " : \""; })`
  );

});


function assertValidTemplate(template, expectedFunctionString) {
  it(`correct parses ${template}`, function() {
    var parser = new Parser(template);
    assert.equal(parser.toComputedPropertyString(), expectedFunctionString);
  });
}

function assertInvalidTemplate(template) {
  it(`raises an exception when parsing ${template}`, function() {
    assert.throws(function() {
      new Parser(template);
    }, "Templates must contain a dynamic section");
  });
}

function assertInvalidTemplates(templates) {
  templates.forEach(function(template) {
    assertInvalidTemplate(template);
  })
}
