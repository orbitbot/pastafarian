# pastafarian
> A tiny event emitter-based finite state machine

[![Build Status](https://travis-ci.org/orbitbot/pastafarian.svg?branch=master)](https://travis-ci.org/orbitbot/pastafarian)
![Uncompressed size](https://badge-size.herokuapp.com/orbitbot/pastafarian/master/pastafarian.js?color=red)
![minfied size](https://badge-size.herokuapp.com/orbitbot/pastafarian/master/pastafarian.min.js?color=yellow&label=minfied size)
![minfied+gzipped size](https://badge-size.herokuapp.com/orbitbot/pastafarian/master/pastafarian.min.js?label=gzipped.min&compression=gzip)

Grab a lightweight event emitter implementation, add some logic to track states and Voilà! A tiny finite state machine implementation at around 500 bytes minfied and gzipped.


- configure when initializing only (demo helpers to add/remove states?)
- state transition semantics vs "event" semantics (no methods/mixin), name your states, not your transitions
- synchronous state transfers (althrough doesn't care about the contents of your callbacks)
...

#### Installation

```sh
$ npm install pastafarian
```

<br>
#### Examples

...

<br>
#### Extending

- helper for "can/cannot"
- helper for "is"
- helper for 'once' callback
- helper to add / remove states

<br>
#### Colophon

The event emitter pattern that `pastafarian` uses at its core is based on [microevent.js](https://github.com/jeromeetienne/microevent.js).

<br>
#### Alternatives

Too basic? Not quite what you were looking for? Some other alternatives for state machines in javascript are

- [javascript-state-machine](https://github.com/jakesgordon/javascript-state-machine)
- [machina.js](https://github.com/ifandelse/machina.js)

<br>
#### License

`pastafarian.js` is ISC licensed.

<br>
#### Development

A basic development workflow is defined using npm run scripts. Get started with

```sh
$ git clone https://github.com/orbitbot/pastafarian
$ npm install
$ npm run develop
```

Bugfixes and improvements are welcome, however, please open an Issue to discuss any larger changes beforehand, and consider if functionality can be implemented with a simple monkey-patching extension script. Useful extensions are more than welcome!

<br>
#### Possible future development

- transition function returns a promise?
- a transition that throws an error can be canceled?
