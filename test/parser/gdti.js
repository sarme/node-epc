'use strict';

var gdti = require('../../parser/gdti');

describe('gdti', function() {
	it('canParse.  Failed.  Invalid format.', function() {
		var p = gdti.canParse('123456789012345678ABCDEF');

		return p.should.become(false);
	});

	it('canParse', function() {
		var p = gdti.canParse('2C3407890009A50000000001');

		return p.should.become(true);
	});

	it('parse.  Failed.  Invalid format.', function() {
		var p = gdti.parse('123456789012345678ABCDEF');

		return p.should.be.rejectedWith(Error);
	});

	it('parse', function() {
		return gdti.parse('2C3407890009A50000000001')
			.then(function(parsed) {
				global.expect(parsed.parts.Header).to.equal('00101100', 'Invalid header');
				global.expect(parsed.parts.Filter).to.equal(1, 'Invalid filter');
				global.expect(parsed.parts.Partition).to.equal(5, 'Invalid partition');
				global.expect(parsed.parts.CompanyPrefix).to.equal('0123456', 'Invalid company prefix');
				global.expect(parsed.parts.DocumentType).to.equal('01234', 'Invalid document type');
				global.expect(parsed.parts.SerialNumber).to.equal(1099511627777, 'Invalid serial number');
			});
	});

	it('getUri', function() {
		var p = gdti.getUri('2C3407890009A50000000001');

		return p.should.become('urn:epc:tag:gdti:0123456.01234.1099511627777');
	});

	it('getName', function() {
		global.assert.equal(gdti.getName(), 'GDTI');
	});
});