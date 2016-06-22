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

  assertValidTemplate(
    "hello ${person.name} you are ${person.age} years old",
    `Ember.computed("person.name", "person.age", function() { return "hello " + this.get("person.name") + " you are " + this.get("person.age") + " years old"; })`
  );

  assertValidTemplate(
    "here are some single quotes ${name} - 1:' 2:'",
    `Ember.computed("name", function() { return "here are some single quotes " + this.get("name") + " - 1:' 2:'"; })`
  );

  assertValidTemplate(
    'here are some double quotes ${name} - 1:" 2:"',
    `Ember.computed("name", function() { return "here are some double quotes " + this.get("name") + " - 1:\\" 2:\\""; })`
  );

  assertValidTemplate(
    "hello ${name}",
    `Em.computed("name", function() { return "hello " + this.get("name"); })`,
    "Em"
  );


});


function assertValidTemplate(template, expectedFunctionString, emberNamespace) {
  it(`correct parses ${template}`, function() {
    var parser = new Parser(template, emberNamespace);
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
