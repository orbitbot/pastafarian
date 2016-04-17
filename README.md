# pastafarian
> A tiny event emitter-based finite state machine

[![Build Status](https://travis-ci.org/orbitbot/pastafarian.svg?branch=master)](https://travis-ci.org/orbitbot/pastafarian)

### Under development, but usable

- configure when initializing only (demo helpers to add/remove states?)
- state transition semantics vs "event" semantics (no methods/mixin)
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

- helper for next method
- helper for 'once' callback

<br>
#### Colophon

- https://github.com/jeromeetienne/microevent.js

<br>
#### Alternatives

- https://github.com/jakesgordon/javascript-state-machine
- https://github.com/ifandelse/machina.js

<br>
#### Notes

- transition function returns a promise? / proomise API ?
- transition function supports result callback?
- a transtition that throws an error can be canceled?