'use strict';

var TAG = 'parser.gdti';
var header = '00101100';
var partition = {
	bits: {
		company: [40, 37, 34, 30, 27, 24, 20],
		reference: [1, 4, 7, 11, 14, 17, 21]
	},
	digits: {
		company: [12, 11, 10, 9, 8, 7, 6],
		reference: [0, 1, 2, 3, 4, 5, 6]
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
						throw new Error(val + ' is not a valid GDTI.');

					self.parts.Header = bh.bits.slice(0, 8);
					self.parts.Filter = parseInt(bh.bits.slice(8, 11), 2);
					self.parts.Partition = parseInt(bh.bits.slice(11, 14), 2);

					var companyPrefixEnd = 14 + partition.bits.company[self.parts.Partition];

					var company = parseInt(bh.bits.slice(14, companyPrefixEnd), 2).toString();
					company = Array(partition.digits.company[self.parts.Partition] - company.length + 1).join('0') + company;

					self.parts.CompanyPrefix = company;

					var doctype = parseInt(bh.bits.slice(companyPrefixEnd, companyPrefixEnd + partition.bits.reference[self.parts.Partition]), 2).toString();
					doctype = Array(partition.digits.reference[self.parts.Partition] - doctype.length + 1).join('0') + doctype;

					self.parts.DocumentType = doctype;
					self.parts.SerialNumber = parseInt(bh.bits.slice(55), 2);

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
							resolve('urn:epc:tag:gdti:' + parsed.parts.CompanyPrefix + '.' + parsed.parts.DocumentType + '.' + parsed.parts.SerialNumber);
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

			return 'GDTI';
		}
	}
});

module.exports = self;