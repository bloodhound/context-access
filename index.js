/**
 * context-access
 *
 * Powerful access control with a dead simple API.
 *
 * @module access
 * @link https://github.com/bloodhound/context-access
 * @api public
 */

/**
 * Container for contexts
 */

exports.contexts = [];

/**
 * Allow a given context when asserted.
 *
 * @param {Object} context
 * @api public
 */

exports.allow = function(context) {
  if (!(context instanceof Context)) {
    context = new Context(context);
  }
  this.contexts.push(context);
};

/**
 * Assert a given context. Returns `true` or `false` if it is allowed or denied.
 *
 * If there's no definition for a key in the given context then it is ignored.
 *
 * @param {Context} context
 * @param {Context} target Optional. A target context to assert a match.
 * @return {Boolean}
 * @api public
 */

exports.assert = function(context, target) {
  if (target) {
    if (!(target instanceof Context)) {
      target = new Context(target);
    }
    if (target.match(context)) return true;
  }
  else {
    for (var len = this.contexts.length, i=0; i<len; i++) {
      if (this.contexts[i].match(context)) return true;
      continue;
    }
  }
  return false;
};

/**
 * Initialize a new Context with given `definition`.
 *
 * @param {Object} definition Values can only be a string, number, or array of
 * either for imbricated array matching.
 * @return {Context}
 * @api private
 */

function Context(definition) {
  for (var key in definition) {
    if (!definition.hasOwnProperty(key)) continue;
    if (typeof definition[key] !== 'string'
    && (typeof definition[key] !== 'number')
    && !(definition[key] instanceof Array)) {
      throw new Error(
        "Context values can only be strings, numbers, or arrays of either."
      );
    }
    this[key] = definition[key];
  }
  return this;
};

/**
 * Export `Context`
 */

module.exports.Context = Context;

/**
 * Match given `context` with this context.
 *
 * @param {Context} context
 * @param {Boolean} operator true for AND false for OR. Used for imbricated
 * array matching.
 * @return {Boolean}
 * @api private
 */

Context.prototype.match = function(context, operator) {
  if (operator === undefined) operator = true;
  var imbricatedTargets = [];
  var matchImbricated = function(imbricated, operator) {
    if (imbricated instanceof Array) {
      for (var len = imbricated.length, i=0; i<len; i++) {
        var match = matchImbricated(imbricated[i], !operator);
        if (!match && operator) return false;
        if (match && !operator) return true;
      }
      return operator;
    }
    else {
      return ~imbricatedTargets.indexOf(imbricated);
    }
  };
  var results = [];
  for (var key in this) {
    if (!this.hasOwnProperty(key)) continue;
    if (!context[key]) return false;
    if (context[key] === this[key]) continue;
    if (typeof this[key] === 'object') {
      if (this[key] instanceof Array) {
        imbricatedTargets = context[key];
        if (!(context[key] instanceof Array)) {
          imbricatedTargets = [context[key]];
        }
        if (matchImbricated(this[key], true)) continue;
      }
    }
    return false;
  }
  return true;
};
