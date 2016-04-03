var should = require('chai').should();

describe('hello test', function() {
  it('should pass', function() {
    true.should.equal(true);
  });

  it('should fail', function() {
    false.should.equal(true);
  });

  it('should have a window', function() {
    window.should.not.equal(false);
  });

  it('might have a module', function() {
    module.should.not.equal(false);
  })
});
