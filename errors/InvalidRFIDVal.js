'use strict';

module.exports = function InvalidRFIDVal(message) {
  this.name = 'InvalidRFIDVal';
  this.message = message || 'Expected 24 hexadecimal characters.';
};

require('util').inherits(module.exports, Error);