'use strict';

module.exports = function NotImplemented(message) {
  /*INHERITANCE*/
    Error.call(this); //super constructor
    Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object
  
  this.name = 'NotImplemented';
  this.message = message || 'Not implemented.';
};

require('util').inherits(module.exports, Error);