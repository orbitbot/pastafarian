// event callbacks can be registered and will be called when a matching transition occurs
// event callbacks can be unregistered and will no longer be called when a previously matching transition occurs
// event callbacks are not fired if an event is fired that does not match
// arbitrary numbers of event callbacks can be registered for an event and will all be fired
// parameters to transitions are passed on to event callbacks
// event callbacks are fired in the order registered