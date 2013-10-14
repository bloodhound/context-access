var should = require('should');
var access = require('..');

describe('module', function() {
  afterEach(function(done) {
    access.contexts = [];
    done();
  });

  it('should export Context', function(done) {
    should.exist(access);
    access.should.have.property('Context');
    access.allow.should.be.a('function');
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

  it('should match allowed contexts', function(done) {
    access.allow({
      application: 'one',
      role: ['role1', ['role2', 'role3']]
    });
    access.allow({
      application: 'two',
      role: [['role2', 'role3']]
    });
    var result = access.assert({
      role: 'role1'
    });
    should.exist(result);
    result.should.be.a('boolean');
    result.should.equal(false);
    result = access.assert({
      application: 'one',
      role: 'role1'
    });
    result.should.equal(false);
    result = access.assert({
      application: 'one',
      role: ['role1', 'role3']
    });
    result.should.equal(true);
    result = access.assert({
      application: 'two',
      role: 'role2'
    });
    result.should.equal(true);
    done();
  });

  it('should match provided target context', function(done) {
    var target = new access.Context({ role: 'guest' });
    result = access.assert({ role: 'guest' }, target);
    result.should.equal(true);
    result = access.assert({ role: 'admin' }, target);
    result.should.equal(false);
    done();
  });
});
