'use strict';

var sgtin = require('../../parser/sgtin');

describe('sgtin', function() {
	it('canParse.  Failed.  Invalid format.', function() {
		var p = sgtin.canParse('123456789012345678ABCDEF');

		return p.should.become(false);
	});

	it('canParse', function() {
		var p = sgtin.canParse('30344B5A1C78902000000001');

		return p.should.become(true);
	});

	it('parse.  Failed.  Invalid format.', function() {
		var p = sgtin.parse('123456789012345678ABCDEF');

		return p.should.be.rejectedWith(Error);
	});

	it('parse', function() {
		return sgtin.parse('30340789000C0E6000000001')
			.then(function(parsed) {
				global.expect(parsed.parts.Header).to.equal('00110000', 'Invalid header');
				global.expect(parsed.parts.Filter).to.equal(1, 'Invalid filter');
				global.expect(parsed.parts.Partition).to.equal(5, 'Invalid partition');
				global.expect(parsed.parts.CompanyPrefix).to.equal('0123456', 'Invalid company prefix');
				global.expect(parsed.parts.ItemReference).to.equal('012345', 'Invalid item reference');
				global.expect(parsed.parts.SerialNumber).to.equal(137438953473, 'Invalid serial number');
			});
	});

	it('getUri', function() {
		var p = sgtin.getUri('30340789000C0E6000000001');

		return p.should.become('urn:epc:tag:sgtin:0123456.012345.137438953473');
	});

	it('getName', function() {
		var p = sgtin.getName()
			.fail(function(err) {
				throw err;
			});

		return p.should.become('sgtin');
	});
});