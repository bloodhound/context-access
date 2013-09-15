var should = require('should');
var access = require('..');

describe('module', function() {
  afterEach(function(done) {
    access.contexts = [];
    done();
  });

  it('should export allow()', function(done) {
    should.exist(access);
    access.should.have.property('allow');
    access.allow.should.be.a('function');
    done();
  });

  it('should export assert()', function(done) {
    should.exist(access);
    access.should.have.property('assert');
    access.allow.should.be.a('function');
    done();
  });
});

describe('exports.allow', function() {
  afterEach(function(done) {
    access.contexts = [];
    done();
  });

  it('should add to contexts container', function(done) {
    access.allow({ role: 'guest' });
    access.contexts.length.should.be.above(0);
    done();
  });
});

describe('exports.assert', function() {
  afterEach(function(done) {
    access.contexts = [];
    done();
  });

  it('should return boolean', function(done) {
    access.allow({
      application: 'api',
      role: 'guest'
    });
    var result = access.assert({
      application: 'api',
      role: 'guest'
    });
    should.exist(result);
    result.should.be.a('boolean');
    done();
  });

  it('should match contexts', function(done) {
    access.allow({
      application: 'api',
      role: 'guest'
    });
    var result = access.assert({
      role: 'guest'
    });
    should.exist(result);
    result.should.be.a('boolean');
    result.should.equal(false);
    result = access.assert({
      application: 'a',
      role: 'guest'
    });
    result.should.equal(false);
    result = access.assert({
      application: 'api',
      role: 'guest'
    });
    result.should.equal(true);
    done();
  });
});
