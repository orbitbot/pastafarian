(function () {
  'use strict';

  var thingamabob = {
    fsm : function() {

    },
  };


  if (typeof window !== 'undefined') {
    window.bob = thingamabob;
  } else if (typeof self !== 'undefined') {
    self.bob = thingamabob;
  } else {
    module.exports = thingamabob;
  }

}());