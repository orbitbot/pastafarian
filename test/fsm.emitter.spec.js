if (typeof window === 'undefined')
  StateMachine = require('./../pastafarian.js');
var chai = require('chai');
var sinon = require('sinon');
var should = chai.should();
var expect = chai.expect;

describe('FSM event emitter', function() {

  function random(upper) {
    return Math.floor(Math.random() * upper) + 1;
  }

  function range(len) {
    return Array.apply(null, Array(len)).map(function (_, i) { return i; });
  }

  var fsm;

  beforeEach(function() {
    fsm = new StateMachine({
      initial : 'green',
      states  : {
        green : ['red'],
        red   : ['green', 'red'],
      },
      error   : console.error.bind(console, 'Error: ')
    });
  });

  it('supports registering callbacks that will be fired when matching transitions occur', function() {
    var spy = sinon.spy();

    fsm.on('red', spy);
    fsm.go('red');

    spy.callCount.should.equal(1);
  });

  it('supports de-registering named callback functions', function() {
    var spy = sinon.spy();

    fsm.on('red', spy);
    fsm.go('red');
    fsm.unbind('red', spy);
    fsm.go('red');

    spy.callCount.should.equal(1);
  });

  it('does not remove unrelated callbacks if unbind is called with a method not registered', function() {
    var spy = sinon.spy();

    fsm.on('red', spy);
    fsm.unbind('red', function() {});
    fsm.go('red');

    spy.callCount.should.equal(1);
  });

  it('fires only callbacks matching the event', function() {
    var fst = sinon.spy();
    var snd = sinon.spy();
    fsm.on('red', fst);
    fsm.on('green', snd);

    fsm.go('red');
    fst.callCount.should.equal(1);
    snd.called.should.equal(false);

    fsm.go('green');
    fst.callCount.should.equal(1);
    snd.callCount.should.equal(1);
  });

  it('supports registering any number of callbacks for a single event', function() {
    var count = random(15);
    var called = new Array(count);

    for (var i = 0; i < called; ++i) {
      fsm.on('red', function() { called[i] = true; });
    }
    fsm.go('red');

    for (var i = 0; i < called; ++i) {
      called[i].should.equal(true);
    }
  });

  it('runs callbacks in the order registered', function() {
    var called = { 0: false, 1: false, 2: false };

    function cb(index) {
      return function() {
        called.index = true;
        var prev = called[index - 1];
        var next = called[index + 1];

        if (prev) prev.should.equal(true);
        if (next) next.should.equal(false);
      }
    }

    fsm.on('red', cb(0));
    fsm.on('red', cb(1));
    fsm.on('red', cb(2));
    fsm.go('red');
  });

  it('supports registering multiple callbacks at once', function() {
    var fst = sinon.spy();
    var snd = sinon.spy();
    var trd = sinon.spy();

    fsm.on('red', [
      fst, snd, trd
    ]);

    fsm.go('red')
    expect(fst.called && snd.called && trd.called).to.equal(true);
  });
});
