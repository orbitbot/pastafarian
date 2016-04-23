if (typeof window === 'undefined')
  StateMachine = require('./../pastafarian.js');
var chai = require('chai');
var sinon = require('sinon');
var should = chai.should();

describe('FSM Error handling', function() {

  var fsm;

  beforeEach(function() {
    fsm = new StateMachine({
      initial : 'green',
      states  : {
        green : ['red'],
        red   : ['green'],
      }
    });
  });

  describe('without an error handler', function() {
    it('throws error if an illegal transition is attempted', function() {
      try {
        fsm.go('green');
      } catch(e) {
        e.name.should.equal('IllegalTransitionException');
        e.message.should.not.equal(undefined);
      }
    });

    it('re-thows exceptions if an uncaught exception is thrown in a transition', function() {
      fsm.on('red', function() {
        throw new Error('intentional');
      });
      try {
        fsm.go('red');
      } catch (e) {
        e.message.should.equal('intentional');
      }
    });

    it('does not call subsequent callbacks if a previous callback throws an uncaught exception', function() {
      var catchBlock = sinon.spy();
      var spy = sinon.spy();

      fsm.on('red', function() {
        throw new Error('intentional');
      });
      fsm.on('red', spy);

      try {
        fsm.go('red');
      } catch (e) {
        e.message.should.equal('intentional');
        catchBlock();
      }

      spy.callCount.should.equal(0);
      catchBlock.callCount.should.equal(1);
    });
  });

  describe('with an error handler', function() {
    it('calls the provided error handler if a transition is not allowd from the current state', function(done) {
      fsm.error = function(error, prev, attempted) {
        error.name.should.equal('IllegalTransitionException');
        error.message.should.not.equal(undefined);
        prev.should.equal('green');
        attempted.should.equal('green');
        done();
      };
      fsm.go('green');
    });

    it('calls the provided error handler if an uncaught exception is thrown in a transition', function(done) {
      fsm.error = function(error) {
        error.message.should.equal('intentional');
        done();
      };
      fsm.on('red', function() {
        throw new Error('intentional');
      });
      fsm.go('red');
    });

    it('continues callback execution if a previous callback throws an uncaught exception', function() {
      var spy = sinon.spy();
      fsm.error = sinon.spy();

      fsm.on('red', function() {
        throw new Error('intentional');
      });
      fsm.on('red', spy);

      fsm.go('red');
      spy.callCount.should.equal(1);
      fsm.error.callCount.should.equal(1);
    });
  });
});
