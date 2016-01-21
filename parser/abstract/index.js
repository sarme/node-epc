'use strict';

var NotImplemented = require('../../errors/NotImplemented.js'),
	bigInt = require("big-integer");

var self = {
	epc: undefined,
	base: undefined,

	parse: function(val) {
		// reset all the default values for the parts object
		for (var p in self.parts)
			if (self.parts.hasOwnProperty(p))
				self.parts[p] = undefined;

			// store the original EPC value
		self.epc = val;
	},

	canParse: function(val) {
		void(val);
		throw new NotImplemented();
	},

	getUri: function(val) {
		if (!val)
			val = self.epc;
	},

	getName: function() {
		throw new NotImplemented();
	},

	getLength: function(val) {
		if (val)
			return val.length * 4;
		else
			return 0;
	},

	parts: {
		Header: undefined,
		Filter: undefined,
		Partition: undefined,
		CompanyPrefix: undefined,
		ItemReference: undefined,
		SerialNumber: undefined,
		SerialReference: undefined,
		LocationReference: undefined,
		Extension: undefined,
		AssetType: undefined,
		IndividualAssetReference: undefined,
		ServiceReference: undefined,
		DocumentType: undefined,
		ManagerNumber: undefined,
		ObjectClass: undefined,
		CAGEOrDODAAC: undefined
	},

	bitsHelper: function(val, len, valbase) {
		var self = this;

		self.val = val;
		self.bitlength = len;

		if (!valbase)
			valbase = 16;

		self.bits = bigInt(val, valbase).toString(2);
		self.bits = Array(len - self.bits.length + 1).join('0') + self.bits;
	}
};



self.base = self;

module.exports = self;