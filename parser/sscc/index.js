'use strict';

var TAG = 'parser.sscc';
var header = '00110001';
var partition = {
	bits: {
		company: [40, 37, 34, 30, 27, 24, 20],
		reference: [18, 21, 24, 28, 31, 34, 38]
	},
	digits: {
		company: [12, 11, 10, 9, 8, 7, 6],
		reference: [5, 6, 7, 8, 9, 10, 11]
	}
};

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
						throw new Error('Not a valid SSCC.');

					self.parts.Header = bh.bits.slice(0, 8);
					self.parts.Filter = parseInt(bh.bits.slice(8, 11), 2);
					self.parts.Partition = parseInt(bh.bits.slice(11, 14), 2);

					var companyPrefixEnd = 14 + partition.bits.company[self.parts.Partition];

					var company = parseInt(bh.bits.slice(14, companyPrefixEnd), 2).toString();
					company = Array(partition.digits.company[self.parts.Partition] - company.length + 1).join('0') + company;

					self.parts.CompanyPrefix = company;

					self.parts.SerialReference = parseInt(bh.bits.slice(companyPrefixEnd, companyPrefixEnd + partition.bits.reference[self.parts.Partition]), 2);

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
							resolve('urn:epc:tag:sscc:' + parsed.parts.CompanyPrefix + '.' + parsed.parts.SerialReference);
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
			return Q.Promise(function(resolve, reject) {
				try {
					log.verbose(TAG, 'getName');

					resolve('sscc');
				} catch (e) {
					log.error(TAG, e);

					reject(e);
				}
			});
		}
	}
});

module.exports = self;