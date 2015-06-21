'use strict';

var giai = require('../../parser/giai');

describe('giai', function() {
	it('canParse.  Failed.  Invalid format.', function() {
		var p = giai.canParse('123456789012345678ABCDEF');

		return p.should.become(false);
	});

	it('canParse', function() {
		var p = giai.canParse('343407890200000000000001');

		return p.should.become(true);
	});

	it('parse.  Failed.  Invalid format.', function() {
		var p = giai.parse('123456789012345678ABCDEF');

		return p.should.be.rejectedWith(Error);
	});

	it('parse', function() {
		return giai.parse('343407890200000000000001')
			.then(function(parsed) {
				global.expect(parsed.parts.Header).to.equal('00110100', 'Invalid header');
				global.expect(parsed.parts.Filter).to.equal(1, 'Invalid filter');
				global.expect(parsed.parts.Partition).to.equal(5, 'Invalid partition');
				global.expect(parsed.parts.CompanyPrefix).to.equal('0123456', 'Invalid company prefix');
				global.expect(parsed.parts.IndividualAssetReference).to.equal('144115188075855873', 'Invalid individual asset reference');
			});
	});

	it('getUri', function() {
		var p = giai.getUri('343407890200000000000001');

		return p.should.become('urn:epc:tag:giai:0123456.144115188075855873');
	});

	it('getName', function() {
		var p = giai.getName()
			.fail(function(err) {
				throw err;
			});

		return p.should.become('giai');
	});
});