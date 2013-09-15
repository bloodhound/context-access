# context-access

[![Build Status](https://secure.travis-ci.org/bloodhound/context-access.png)](http://travis-ci.org/bloodhound/context-access) 
[![Dependency Status](https://david-dm.org/bloodhound/context-access.png)](http://david-dm.org/bloodhound/context-access)

Powerful access control with a dead simple API. Build any access control scheme
you need by allowing maps of arbitrary keys and values called contexts.

* Simple — just two API methods.
* Powerful — flexible enough to build any API scheme.
* Browser support — works on the client or server.

## Installation

### Node

Using [npm](https://npmjs.org/):

```sh
npm install context-access
```

### Browser

Using [component](https://github.com/component/component/):

```sh
component install bloodhound/context-access
```

## Example

### Roles

The simplest example is a traditional roles-based access control system using
contexts:

```javascript
var access = require('context-access');

access.allow({
  url: '/public'
});

access.allow({
  url: '/private',
  role: 'admin'
});

access.assert({
  url: '/public',
  role: 'guest'
});
// => true

access.assert({
  url: '/private',
  role: 'guest'
});
// => false
```

### Express middleware

Use contexts to match routes in Express:

```javascript
var app = require('express')();
var access = require('coaccess');

access.allow({
  role: 'guest',
  path: '/users',
  method: 'GET'
});

access.allow({
  role: 'admin',
  path: '/users',
  method: ['GET', 'PUT', 'POST', 'DELETE']
});

// Route middleware
var authorize = function(req, res, next) {
  var context = {
    role: req.session.role,   // admin
    path: req.path,           // /users
    method: req.method        // POST
  };
  if (access.assert(context)) {
    return next();
  }
  res.send(403, 'You must be an admin to do this!');
};

app.post('/users', authorize, function(req, res) {
  // ...
});
```

## API

### exports.allow(context)

Allow a given context when asserted.

### exports.assert(context)

Assert a given context. Returns `true` or `false` if it is allowed or denied.

If there's no definition for a key in the given context, then it is ignored.

### Imbricated array matching

Imbricate arrays to alternate AND and OR operations when asserting.

```javascript
["guest", "admin"]                guest AND admin
[["guest", "admin"]]              guest OR admin
["role1", ["role2", "role3"]]     role1 AND (role2 OR role3)

access.allow({
  resource: 'API',
  role: ['admin', 'manager']
});

access.assert({
  resource: 'API',
  role: 'admin'
});
// => true
```

## Tests

Tests are written with [mocha](https://github.com/visionmedia/mocha) and
[should](https://github.com/visionmedia/should.js) using BDD-style assertions.

Run them with npm:

```sh
npm test
```

## MIT Licensed
