'use strict';

var TAG = 'parser.raw';

var Abstract = require('../abstract'),
	log = require('npmlog-ts'),
	Q = require('q');

var self = Object.create(Abstract, {
	parse: {
		value: function(val) {
			return Q.Promise(function(resolve, reject) {
				try {
					log.verbose(TAG, 'parse');
					log.info(TAG, 'parsing %j', val);

					self.base.parse(val);

					resolve(self);
				} catch (e) {
					log.error(TAG, e);

					reject(e);
				}
			});

		}
	},

	canParse: {
		value: function() {
			return Q.Promise(function(resolve, reject) {
				try {
					log.verbose(TAG, 'canParse');

					resolve(true);
				} catch (e) {
					log.error(TAG, e);

					reject(e);
				}
			});
		}
	},
	getUri: {
		value: function(val) {
			return Q.Promise(function(resolve, reject) {
				try {
					log.verbose(TAG, 'getUri');

					self.base.getUri(val);

					resolve('urn:epc:raw:' + self.getLength(val) + '.x' + val);
				} catch (e) {
					log.error(TAG, e);

					reject(e);
				}
			});
		}
	},

	getName: {
		value: function() {
			return Q.Promise(function(resolve, reject) {
				try {
					log.verbose(TAG, 'getName');

					resolve('raw');
				} catch (e) {
					log.error(TAG, e);

					reject(e);
				}
			});
		}
	}
});

module.exports = self;