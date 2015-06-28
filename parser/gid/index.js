'use strict';

var TAG = 'parser.gid';
var header = '00110101';

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

					var bh = new self.base.bitsHelper(val, 96);

					if (bh.bits.slice(0, 8) !== header)
						throw new Error(val + ' is not a valid GID.');

					self.parts.Header = bh.bits.slice(0, 8);
					self.parts.ManagerNumber = parseInt(bh.bits.slice(8, 36), 2);
					self.parts.ObjectClass = parseInt(bh.bits.slice(36, 60), 2);
					self.parts.SerialNumber = parseInt(bh.bits.slice(60), 2);

					resolve(self);
				} catch (e) {
					log.error(TAG, e);

					reject(e);
				}
			});
		}
	},

	canParse: {
		value: function(val) {
			return Q.Promise(function(resolve, reject) {
				try {
					log.verbose(TAG, 'canParse');

					var bh = new self.base.bitsHelper(val, 96);

					resolve(bh.bits.slice(0, 8) === header);
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

					self.parse(val)
						.then(function(parsed) {
							resolve('urn:epc:tag:gid:' + parsed.parts.ManagerNumber + '.' + parsed.parts.ObjectClass + '.' + parsed.parts.SerialNumber);
						});
				} catch (e) {
					log.error(TAG, e);

					reject(e);
				}
			});
		}
	},

	getName: {
		value: function() {
			log.verbose(TAG, 'getName');

			return 'GID';
		}
	}
});

module.exports = self;