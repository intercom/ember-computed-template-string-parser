# ember-computed-template-string-parser

[![Build Status](https://travis-ci.org/intercom/ember-computed-template-string-parser.svg?branch=master)](https://travis-ci.org/intercom/ember-computed-template-string-parser)

This simple package converts a string such as:

```
"hello ${name}!"
```

into:

```js
Ember.computed("name", function() { 
  return "hello " + this.get("name") + "!";
})
```

and is used in the [`ember-computed-template-string`](https://github.com/intercom/ember-computed-template-string) addon.
