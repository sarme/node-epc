'use strict';

var NotImplemented = require('../../errors/NotImplemented.js'),
	bigInt = require("big-integer");

var self = {
	epc: undefined,
	base: undefined,

	parse: function(val) {
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
		IndividulAssetReference: undefined,
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

// function Abstract(){
// 	this.self = this;
// 	this.epc = '1234';
// }

// Abstract.prototype.parse = function(val) {
//   void(val); throw new NotImplemented();
// };

// Abstract.prototype.canParse = function(val) {
//   void(val); throw new NotImplemented();
// };

// Abstract.prototype.getUri = function() {
//   throw new NotImplemented();
// };

// Abstract.prototype.getName = function() {
//   throw new NotImplemented();
// };

// Abstract.prototype.getUri = function() {
//   throw new NotImplemented();
// };

// Abstract.prototype.parts = {
// 		CompanyPrefix: undefined,
// 		ItemReference: undefined,
// 		SerialNumber: undefined,
// 		SerialReference: undefined,
// 		LocationReference: undefined,
// 		Extension: undefined,
// 		AssetType: undefined,
// 		IndividulAssetReference: undefined,
// 		ServiceReference: undefined,
// 		DocumentType: undefined,
// 		ManagerNumber: undefined,
// 		ObjectClass: undefined,
// 		CAGEOrDODAAC: undefined
// 	};

// module.exports = {
// 	epc: undefined,
// 	canParse: function(val) { void(val); return false; },	
// 	parse: function(val) { void(val); throw new NotImplemented("Test"); },
// 	getUri: function() { throw new NotImplemented("Test"); },
// 	getName: function() { throw new NotImplemented("Test"); },
// 	getLength: function() { return 96; },
// 	parts: {
// 		CompanyPrefix: undefined,
// 		ItemReference: undefined,
// 		SerialNumber: undefined,
// 		SerialReference: undefined,
// 		LocationReference: undefined,
// 		Extension: undefined,
// 		AssetType: undefined,
// 		IndividulAssetReference: undefined,
// 		ServiceReference: undefined,
// 		DocumentType: undefined,
// 		ManagerNumber: undefined,
// 		ObjectClass: undefined,
// 		CAGEOrDODAAC: undefined
// 	}	  
// };

//module.exports = Abstract;