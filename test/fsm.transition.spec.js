// a configured fsm contains transitions
// an allowed transition emits an exit event after:<state>, contains next
// an allowed transition emits a before event before:<state>, contains prev
// an allowed transition emits an "on" event <state>, contains prev
// the state machine state is changed before the 
// if a transition is not allowed from the current state, an error is emitted

// transition function returns a promise? / proomise API ?
// transition function supports result callback?
// a transtition that throws an error can be canceled?