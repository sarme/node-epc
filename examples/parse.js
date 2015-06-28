'use strict';

var epc = require('../');
//var epc = require('node-epc');

// Parse by discovering the encoding
epc.parse('30344B5A1C78902000000001')
	.then(function(parsed) {
		console.log('Encoding = ' + parsed.getName());
		console.log('Company Prefix = ' + parsed.parts.CompanyPrefix);
		console.log('Item Reference = ' + parsed.parts.ItemReference);
		console.log('Serial Number = ' + parsed.parts.SerialNumber);
	})
	.fail(function(err) {
		console.error(err);
	});

// Parse using a specific encoding
epc.getParser('SGTIN')
	.then(function(sgtin) {
		sgtin.parse('30344B5A1C78902000000001')
			.then(function(parsed) {
				console.log('Encoding = ' + parsed.getName());
				console.log('Company Prefix = ' + parsed.parts.CompanyPrefix);
				console.log('Item Reference = ' + parsed.parts.ItemReference);
				console.log('Serial Number = ' + parsed.parts.SerialNumber);
			})
			.fail(function(err) {
				console.error(err);
			});
	});