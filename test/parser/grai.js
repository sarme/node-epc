'use strict';

var grai = require('../../parser/grai');

describe('grai', function() {
	it('canParse.  Failed.  Invalid format.', function() {
		var p = grai.canParse('123456789012345678ABCDEF');

		return p.should.become(false);
	});

	it('canParse', function() {
		var p = grai.canParse('33340789000134A000000001');

		return p.should.become(true);
	});

	it('parse.  Failed.  Invalid format.', function() {
		var p = grai.parse('123456789012345678ABCDEF');

		return p.should.be.rejectedWith(Error);
	});

	it('parse', function() {
		return grai.parse('33340789000134A000000001')
			.then(function(parsed) {
				global.expect(parsed.parts.Header).to.equal('00110011', 'Invalid header');
				global.expect(parsed.parts.Filter).to.equal(1, 'Invalid filter');
				global.expect(parsed.parts.Partition).to.equal(5, 'Invalid partition');
				global.expect(parsed.parts.CompanyPrefix).to.equal('0123456', 'Invalid company prefix');
				global.expect(parsed.parts.AssetType).to.equal('01234', 'Invalid asset type');
				global.expect(parsed.parts.SerialNumber).to.equal(137438953473, 'Invalid serial number');
			});
	});

	it('getUri', function() {
		var p = grai.getUri('33340789000134A000000001');

		return p.should.become('urn:epc:tag:grai:0123456.01234.137438953473');
	});

	it('getName', function() {
		global.assert.equal(grai.getName(), 'GRAI');
	});
});