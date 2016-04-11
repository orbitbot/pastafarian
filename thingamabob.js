;(function (root) {
  function ITE(prev, next) {
    var error = Error.call(this, 'Transition from ' + prev + ' to ' + next + ' is not allowed');
    error.name = 'IllegalTransitionException';
    return error;
  }

  function FSM(config) {
    var events = {};
    var fsm = {
      transitions : config.states,
      current     : config.initial,
    };
    fsm.bind = function(evt, fn) {
      events[evt] = events[evt] || [];
      events[evt].push(fn);
      return fsm;
    };
    fsm.unbind = function(evt, fn) {
      if (evt in events)
        events[evt].splice(events[evt].indexOf(fn), 1);
      return fsm;
    };
    fsm.on = fsm.bind;
    var emit = function trigger(evt, args) {
      if (evt in events) {
        for (var i = 0; i < events[evt].length; ++i) {
          try {
            events[evt][i].apply(this, args);
          } catch (e) {
            if (evt !== 'error' && 'error' in events)
              trigger('error', [e]);
            else {
              throw e;
            }
          }
        }
      } else if (evt === 'error') {
        throw args[0];
      }
    };

    fsm.go = function(next) {
      var prev = fsm.current;
      if (fsm.transitions[prev].indexOf(next) >= 0) {
        var params = Array.prototype.slice.call(arguments, 1);

        emit('after:' + prev, [next].concat(params));
        emit('before:' + next, [prev].concat(params));
        fsm.current = next;
        emit(next, [prev].concat(params));
      } else {
        emit('error', [new ITE(prev, next), prev, next]);
      }
    };

    return fsm;
  }

  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(function () { return FSM; });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = FSM;
  } else if (typeof self !== 'undefined') {
    self.StateMachine = FSM;
  } else {
    root.StateMachine = FSM;
  }
}(this));
