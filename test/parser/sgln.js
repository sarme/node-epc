'use strict';

var sgln = require('../../parser/sgln');

describe('sgln', function() {
	it('canParse.  Failed.  Invalid format.', function() {
		var p = sgln.canParse('123456789012345678ABCDEF');

		return p.should.become(false);
	});

	it('canParse', function() {
		var p = sgln.canParse('323407890009A50000000001');

		return p.should.become(true);
	});

	it('parse.  Failed.  Invalid format.', function() {
		var p = sgln.parse('123456789012345678ABCDEF');

		return p.should.be.rejectedWith(Error);
	});

	it('parse', function() {
		return sgln.parse('323407890009A50000000001')
			.then(function(parsed) {
				global.expect(parsed.parts.Header).to.equal('00110010', 'Invalid header');
				global.expect(parsed.parts.Filter).to.equal(1, 'Invalid filter');
				global.expect(parsed.parts.Partition).to.equal(5, 'Invalid partition');
				global.expect(parsed.parts.CompanyPrefix).to.equal('0123456', 'Invalid company prefix');
				global.expect(parsed.parts.LocationReference).to.equal('01234', 'Invalid location reference');
				global.expect(parsed.parts.Extension).to.equal(1099511627777, 'Invalid extension');
			});
	});

	it('getUri', function() {
		var p = sgln.getUri('323407890009A50000000001');

		return p.should.become('urn:epc:tag:sgln:0123456.01234.1099511627777');
	});

	it('getName', function() {
		global.assert.equal(sgln.getName(), 'SGLN');
	});
});