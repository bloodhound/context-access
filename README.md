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

The simplest example is a traditional roles-based access control system:

```javascript
var access = require('context-access');

access.allow({
  url: '/public',
  role: 'guest'
});

access.assert({
  url: '/public'
});
// => false
```

The call to assert returns `false` because the properties in the context
asserted do not match any allowed context. However, if we add a matching `role`
property:

```javascript
access.allow({
  url: '/public',
  role: 'guest'
});

access.assert({
  url: '/public',
  role: 'guest'
});
// => true
```

### AND and OR operations

You can imbricate arrays to alternate AND and OR operations when asserting:

```javascript
["role1", "role1"]                role1 AND role2
[["role1", "role2"]]              role1 OR role2
["role1", ["role2", "role3"]]     role1 AND (role2 OR role3)

access.allow({
  url: '/private',
  roles: [['manager', 'admin']]
});

access.assert({
  roles: 'manager'
});
// => true
```

### Express middleware

Use contexts to match routes in Express:

```javascript
var app = require('express')();
var access = require('context-access');

// Allow users with manager or admin role to POST to /users
access.allow({
  path: '/users',
  method: [['GET', 'POST']]
  role: [['manager', 'admin']],
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
  else {
    res.send(403, 'You must be an admin to do this!');
  }
};

// Use route middleware
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

## Browser support

Firefox, Chrome, Safari, IE9+

## Tests

Tests are written with [mocha](https://github.com/visionmedia/mocha) and
[should](https://github.com/visionmedia/should.js) using BDD-style assertions.

Run them with npm:

```sh
npm test
```

## MIT Licensed
