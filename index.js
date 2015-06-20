/// <reference path="typings/node/node.d.ts"/>
'use strict';

var TAG = 'main';

var log = require('npmlog-ts'),
	Q = require('q'),
	InvalidRFIDVal = require('./errors/InvalidRFIDVal');

log.heading = 'node-epc';
log.timestamp = true;
log.level = 'error'; // default logging level

// set logging level according to environment
if (process.env.NODE_ENV) {
	switch (process.env.NODE_ENV) {
		case 'test':
			log.level = 'silent';
			break;
		case 'development':
			log.level = 'verbose';
			break;
	}
}

// main
module.exports = {
	parse: function(val) {
		return Q.Promise(function(resolve, reject) {
			try {
				log.verbose(TAG, 'parse');

				var result = val.match(/[0-9a-fA-F]{24}/i);

				if (!result)
					throw new InvalidRFIDVal('"' + val + '" is an invalid value.  Expected 24 hexadecimal characters.');

				resolve();
			} catch (e) {
				log.error(TAG, e);

				reject(e);
			}
		});
	}
};