'use strict';

var TAG = 'parser.dod';
var header = '00101111';

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
						throw new Error(val + ' is not a valid DOD.');

					self.parts.Header = bh.bits.slice(0, 8);
					self.parts.Filter = parseInt(bh.bits.slice(8, 12), 2);
					self.parts.CAGEOrDODAAC = hex2a(parseInt(bh.bits.slice(12, 60), 2).toString(16)).trim();
					self.parts.SerialNumber = parseInt(bh.bits.slice(60), 2);

					resolve(self);
				} catch (e) {
					log.error(TAG, e);

					reject(e);
				}
			});

			// http://stackoverflow.com/questions/3745666/how-to-convert-from-hex-to-ascii-in-javascript
			function hex2a(hex) {
				var str = '';
				for (var i = 0; i < hex.length; i += 2)
					str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
				return str;
			}
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
							resolve('urn:epc:tag:usdod:' + parsed.parts.CAGEOrDODAAC + '.' + parsed.parts.SerialNumber);
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

			return 'DOD';
		}
	}
});

module.exports = self;