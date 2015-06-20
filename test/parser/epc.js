'use strict';

var epc = require('../../index.js'),
	InvalidRFIDVal = require('../../errors/InvalidRFIDVal');

describe('epc', function() {
	describe('parse', function() {
		it('Failed.  Too short.', function() {
			var p = epc.parse('1234567890abcd')
				.fail(function(err) {
					throw err;
				});

			//return assert.isRejected(p, InvalidRFIDVal);

			return p.should.be.rejected;
		});

		it('Failed.  Too short, not hex.', function() {
			var p = epc.parse('bad')
				.fail(function(err) {
					throw err;
				});

			return p.should.be.rejectedWith(InvalidRFIDVal);
		});

		it('Failed.  24 characters, not hex.', function() {
			var p = epc.parse('12345678901234567890pppp')
				.fail(function(err) {
					throw err;
				});

			return p.should.be.rejectedWith(InvalidRFIDVal);
		});

		it('24 characters, hex, lowercase.', function() {
			var p = epc.parse('123456789012345678abcdef')
				.fail(function(err) {
					throw err;
				});

			return p.should.be.fulfilled;
		});

		it('24 characters, hex, uppercase.', function() {
			var p = epc.parse('123456789012345678ABCDEF')
				.fail(function(err) {
					throw err;
				});

			return p.should.be.fulfilled;
		});
	});
});