if (typeof window === 'undefined')
  StateMachine = require('./../pastafarian.js');
var chai = require('chai');
var assert = chai.assert;
var should = chai.should();

describe('FSM API', function() {

  var fsm;

  beforeEach(function() {
    fsm = new StateMachine({
      initial : 'green',
      states  : {
        green : ['red'],
        red   : ['green'],
      },
      error   : console.error.bind(console, 'Error: ')
    });
  });

  it('has state machine fields', function() {
    assert.isObject(fsm.transitions, 'has transitions object');
    assert.isString(fsm.current, 'current state is defined');
    assert.isFunction(fsm.error, 'error hanlder is defined');
  });

  it('has methods for registering and unregistering events', function() {
    assert.isFunction(fsm.on, 'fsm.on API');
    assert.isFunction(fsm.bind, 'fsm.bind API');
    assert.isFunction(fsm.unbind, 'fsm.unbind API');
  });

  it('does not expose internal methods or data structures', function() {
    assert.isUndefined(fsm.emit);
    assert.isUndefined(fsm.events);
  });

  it('supports chaining registering event callbacks', function() {
    var fst = fsm.on('something', function() {});
    var snd = fsm.unbind('another', function() {});
    var trd = fsm.go('red');
    fst.should.equal(fsm);
    snd.should.equal(fsm);
    trd.should.equal(fsm);
  });
});
