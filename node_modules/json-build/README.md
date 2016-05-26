json-build
==========

Small library to create JSON objects from expresions

Installation
============
```bash
npm install json-build
```
 
Usage
=====
```javascript
var json-build = require('json-build');

var entity = new json-build();
entity.addValue('first.second', 'value')
      .addValue('first.third.fourth', 'value').
      .pushValue('first.fifth', 1)
      .pushValue('first.fifth', 2)
      .build();

```

The result will be
```json
{
  "first": {
    "second": "value",
    "third": {
      "fourth": "value"
    },
    "fifth": [1, 2]
  }
}
```

In addition, an object can be passed as argument to the constructor to be used as base object to build upon.
