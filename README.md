# pastafarian
> A tiny event emitter-based finite state machine

[![Build Status](https://travis-ci.org/orbitbot/pastafarian.svg?branch=master)](https://travis-ci.org/orbitbot/pastafarian)
![Uncompressed size](https://badge-size.herokuapp.com/orbitbot/pastafarian/master/pastafarian.js?color=red)
![minfied size](https://badge-size.herokuapp.com/orbitbot/pastafarian/master/pastafarian.min.js?color=yellow&label=minfied size)
![minfied+gzipped size](https://badge-size.herokuapp.com/orbitbot/pastafarian/master/pastafarian.min.js?label=gzipped.min&compression=gzip)

Grab a lightweight event emitter implementation, add some logic to track states and Voilà! A tiny finite state machine implementation at little less than 550 bytes minfied and gzipped. `pastafarian` is implemented as a UMD module, so it should run in most javascript setups.

![spaceballs-survive](https://cloud.githubusercontent.com/assets/2631164/14754610/28b3e7b6-08e5-11e6-83a5-da0bd6ced8b9.jpg)

###### Features
- probably the smallest FSM on the block in javascript-land
- simple but powerful API
- no external dependencies
- synchronous state transitions only (async transitions are actually waiting states... but have a look at [`henderson`](https://github.com/orbitbot/pastafarian) for an almost identical approach with promises)
- well below 100 LOC, small enough to read and understand immediately

<br>

### Example

```js
var state = new StateMachine({
  initial : 'start',
  states  : {
    start : ['end', 'start'],
    end   : ['start']
  }
});

state.on('*', function(prev, next) {
  console.log('State changed from ' + prev + ' to ' + next);
});

state
  .on('before:start', function(prev, param) {
    console.log('Reset with param === "foo": ' + param === 'foo');
  })
  .on('after:start', function(next) {
    console.log('Going to ' + next);
  })
  .on('end', function(prev, param) {
    console.log('Now at end, 2 + 2 = ' + param);
  });

state.go('end', 2 + 2);

state.reset = state.go.bind(state, 'start');
state.reset('foo');
```

<br>

### Installation

Right click to save or use the URLs in your script tags

- [`pastafarian.js`](https://cdn.rawgit.com/orbitbot/pastafarian/master/pastafarian.js)
- [`pastafarian.min.js`](https://cdn.rawgit.com/orbitbot/pastafarian/master/pastafarian.min.js)

or use

```sh
$ npm install pastafarian
$ bower install pastafarian
```

If you're using `pastafarian` in a browser environment, the constructor is attached to the `StateMachine` global.

<br>

### Usage

The `StateMachine` global or the `pastafarian` module is a constructor for a finite-state machine. The constructor expects a single configuration object:

| field      | type      | functionality                                                                                                 |
|:-----------|:----------|:--------------------------------------------------------------------------------------------------------------|
| `initial`  | string    | the starting state of the state machine                                                                       |
| `states`   | object    | keys are state names, values are arrays of valid states to transition to  `<state name> : ['<state>', '...']` |
| `error`    | function  | optional, function that handles errors in state transition callbacks or illegal state transitions             |
<br>

A simple state machine that describes a traffic light might be defined as

```js
var StateMachine = require('pastafarian');
var trafficLight = new StateMachine({
  initial : 'red',
  states  : {
    green  : ['yellow'],
    yellow : ['green', 'red'],
    red    : ['yellow'],
  },
  error : console.error.bind(console, 'Error: ')
});
```
... which will create a state machine like this diagram:

![ryg-state-sm](https://cloud.githubusercontent.com/assets/2631164/14754614/2daa6754-08e5-11e6-9922-1c63b3c7813f.png)

<br>

##### State machine API

A state machine `var fsm = new StateMachine(config)` will have


###### Methods:

**`fsm.bind(eventName, callback or [callbacks]) ⇒ fsm`**

Attaches a single `callback` or an array of `[callbacks]` to be called whenever `eventName` is triggered by a state transition. See the [Event callback API](README.md#event-callback-api) for all possible events for a single transition.

**`fsm.unbind(eventName, callback) ⇒ fsm`**

De-registers `callback` so it will not be triggered for `eventName`. Previously registered callbacks must be named values for this to have an effect, if a callback was defined as an anonymous function this method will silently fail.

**`fsm.on(eventName, callback or [callbacks]) ⇒ fsm`**

Synonym for `fsm.bind`.

**`fsm.go(state /* ...args */) ⇒ fsm`**

Transitions the state machine to `state` and causes any registered callbacks for this transition (including `before:`, `after:` and wildcard callbacks) to be triggered. All parameters after `state` are passed on to each callback along with the states involved in the transition, see the [Event callback API](README.md#event-callback-api) for the exact signatures.

All methods as well as the constructor return the state machine itself, and are therefore chainable.

<br>

###### Fields:

**`fsm.transitions` : `object`**

An object where the keys are state names, and the values of each key is an array of the states that can be transitioned to from this state, as defined by `config.states`.

**`fsm.current` : `string`**

Tracks the current state, the starting value is `config.initial`. The value changes during state transitions, see [Event callback API](README.md#event-callback-api).


**`fsm.error` : `function`**

The if defined, the function from `config.error`, see [Error handling](README.md#error-handling).

If you need to change the functionality or state without going through transitions, these fields can be edited as required. See the section on extending below for some ideas.


<br>

##### Event callback API

Callbacks triggered on state transitions can be registered with `fsm.on` or `fsm.bind`:

```js
fsm.on(eventName, function() {
  // do something
});
```

Every call to `fsm.go` will trigger all callbacks registered for the states involved in the transition according to the following semantics:

Assuming that
- `fsm` is in state `PREVIOUS_STATE`, and
- `fsm` can transition from `PREVIOUS_STATE` to `NEXT_STATE`,
- a call `fsm.go(NEXT_STATE, /* ...args */)`
- will trigger all callbacks registered for `event` with

| event                      | signature                                   | fsm.current      |
|:---------------------------|:--------------------------------------------|:-----------------|
| **`after:PREVIOUS_STATE`** | `function(next /* ...args */) {}`           | `PREVIOUS_STATE` |
| **`before:NEXT_STATE`**    | `function(previous /* ...args */) {}`       | `PREVIOUS_STATE` |
| **`NEXT_STATE`**           | `function(previous /* ...args */) {}`       | `NEXT_STATE`     |
| **`*`**                    | `function(previous, next /* ...args */) {}` | `NEXT_STATE`     |

- in all callback signatures, `next` is `NEXT_STATE` and `previous` is `PREVIOUS_STATE`
- `before:NEXT_STATE` and `NEXT_STATE` differ only in that `fsm.current` has changed when the callback is being executed
- the wildcard callback (`*`) is triggered on every successful transition, but not if a transition between states is not possible

Also note that

- all arguments to `fsm.go` after the first are always passed to the callbacks, according to the above signatures
- any number of callbacks can be registered for any `event`
- callbacks will be triggered in the order registered
- `fsm.on` and `fsm.bind` will accept any valid object key as the first parameter and will perform no checks to ensure a matching state is defined, so watch out for typos
- `fsm.error` significantly affects how `pastafarian` works in the case of thrown exceptions in callbacks, see [Differences in functionality if `fsm.error` is defined or not](README.md#)

So, given a basic state machine:

```js
var state = new StateMachine({
  initial : 'start',
  states  : {
    start : ['end', 'start'],
    end   : ['start']
  }
});
```
... the following callbacks may be triggered as the state changes

```js
state.on('*',            function() { });
state.on('before:start', function() { });
state.on('start',        function() { });
state.on('after:start',  function() { });
state.on('before:end',   function() { });
state.on('end',          function() { });
state.on('after:end',    function() { });
```


<br>

##### Error handling

If defined, the `fsm.error` function will be called in two separate cases:

1. when trying to perform an invalid state transition
1. when a callback defined for a transition throws an error

The signature of this function is

```js
function errorHandler(error, prev, next /* ...params */) {
  if (error.name === 'IllegalTransitionException') {
    console.log(error.message);
    // prev is fsm.current
    // next is the transition attempted, eg. fsm.go(next, ...)
    // params are any other parameters to fsm.go, eg. fsm.go(next, param1, param2 ...)
  } else {
    // error is whatever was thrown in the transition callback that caused the error
    // prev, next and other arguments will be undefined
  }
}
```

If the error handler function is not defined, any calls to `fsm.go` may throw errors or exceptions for the above reasons and can be caught similarly using try/catch blocks.

###### Differences in functionality if `fsm.error` is defined or not

The existance of `fsm.error` has a significant impact on functionality:

- if `fsm.error` is not defined, an uncaught exception in a callback will stop execution and subsequent callbacks will not be triggered, potentially leaving your application in an undefined state if you are relying on the side-effects of a certain callback being applied. `fsm.current` may also still be in the previous state, depending on which events the callbacks were registered to
- if `fsm.error` is defined, an uncaught exception in a callback will trigger the error handler and stop further execution of the code inside that callback, but all other callbacks will be triggered and the state transition will be completed, which may also cause cause problems with unfinished side-effects

###### IllegalTransitionException

`pastafarian` defines a custom exception which is generated when the transitions array of the current state doesn't contain the state passed to `fsm.go`:

- name: `IllegalTransitionException`
- message: `Transition from <current> to <next> is not allowed`
- prev : `<current>`
- attempt : `<next>`

The exception is generated inside the library, but in modern environments it should contain a stacktrace that allows you to track which line caused the exception.

<br>

### Extending

`pastafarian` omits most safety checks and a larger API in favor of size, but can be extended in different ways to support different usage patterns and semantics.

If you find yourself often needing to check the current state or valid transitions, these helpers might provide a nicer interface:

```js
// is parameter state a valid transition from the current state?
fsm.can = function(state) {
  return fsm.transitions[fsm.current].indexOf(state) > -1;
};

// is parameter state an invalid transition from the current state?
fsm.cannot = function(state) {
  return fsm.transitions[fsm.current].indexOf(state) === -1;
};

// shorthand to check if parameter state is the current one
fsm.is = function(state) {
  return fsm.current === state;
};

// return a list of the valid states to enter from the current state
fsm.allowed = function() {
  return fsm.transitions[fsm.current];
};
```

A "fire once" callback can be implemented with

```js
fsm.once = function(evt, fn) {
  fsm.on(evt, function onceCb() {
    fn.apply(fn, Array.prototype.slice.call(arguments));
    fsm.unbind(evt, onceCb);
  });
  return fsm;
};
```

If you need to add or remove states after the state machine has been initialized, something like the following might serve:

```js
fsm.add = function(state, from, to) {
  fsm.transitions[state] = to;
  from.forEach(function(elem) {
    fsm.transitions[elem].push(state);
  });
};

fsm.remove = function(obsolete) {
  delete fsm.transitions[obsolete];

  for (var state in fsm.transitions) {
    if (fsm.transitions.hasOwnProperty(state)) {
      var index = fsm.transitions[state].indexOf(obsolete);
      if (index > -1)
        fsm.transitions[state].splice(index, 1);
    }
  }
  // probably should also set or check fsm.current to see we're still in a valid state
};
```

Transitions between states can be removed in a similar fashion.

If you wish to apply some common sanity checks before state transitions, one way to add these would be by patching the `.go` method:

```js
fsm.origo = fsm.go;
fsm.go = function() {
  // put state validation, parameter checks, anything you might need here
  return fsm.origo.apply(this, Array.prototype.slice.call(arguments));
};
```

<br>

### Alternatives

Too basic? Not quite what you were looking for? Some other alternatives for state machines in javascript are

- [javascript-state-machine](https://github.com/jakesgordon/javascript-state-machine)
- [machina.js](https://github.com/ifandelse/machina.js)

Searching on bower or npm will probably also find some other takes on the subject.

<br>

### Colophon

The event emitter pattern that `pastafarian` uses at its core is based on [microevent.js](https://github.com/jeromeetienne/microevent.js).

<br>

### License

`pastafarian` is ISC licensed.

<br>

### Development

A basic development workflow is defined using npm run scripts. Get started with

```sh
$ git clone https://github.com/orbitbot/pastafarian
$ npm install
$ npm run develop
```

Bugfixes and improvements are welcome, however, please open an Issue to discuss any larger changes beforehand, and consider if functionality can be implemented with a simple monkey-patching extension script. Useful extensions are more than welcome!

<br>

##### Possible future

- a transition that throws an error can be canceled, ie. intelligent rollback?
