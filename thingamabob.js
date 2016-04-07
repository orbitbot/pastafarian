;(function (root) {
  var slice = Array.prototype.slice;

  var FSM = function(config) {
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
    var emit = function trigger(evt) {
      if (evt in events) {
        for (var i = 0; i < events[evt].length; ++i) {
          try {
            events[evt][i].apply(this, slice.call(arguments, 1));
          } catch (e) {
            if (evt !== 'error' && 'error' in events)
              trigger('error', e);
            else
              setTimeout(function() { throw e; });
          }
        }
      }
    };

    fsm.go = function(next) {
      if (fsm.transitions[fsm.current].indexOf(next) > 0) {
        var params = slice(arguments, 1);
        var prev = fsm.current;

        emit.apply(this, ['after:' + prev, next].concat(params));
        emit.apply(this, ['before:' + next, prev].concat(params));
        fsm.current = next;
        emit.apply(this, [next, prev].concat(params));
      } else {
        emit('error', { message: '', name: 'IllegalTransition' });
      }
    };
    fsm.on = fsm.bind;

    return fsm;
  }

  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(function () { return FSM; });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = FSM;
  } else if (typeof self !== 'undefined') {
    self.StateMachine = StateMachine;
  } else {
    root.Bob = FSM;
  }
}(this));