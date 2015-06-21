'use strict';

var gsrn = require('../../parser/gsrn');

describe('gsrn', function() {
	it('canParse.  Failed.  Invalid format.', function() {
		var p = gsrn.canParse('123456789012345678ABCDEF');

		return p.should.become(false);
	});

	it('canParse', function() {
		var p = gsrn.canParse('2D34078900075BCD15000000');

		return p.should.become(true);
	});

	it('parse.  Failed.  Invalid format.', function() {
		var p = gsrn.parse('123456789012345678ABCDEF');

		return p.should.be.rejectedWith(Error);
	});

	it('parse', function() {
		return gsrn.parse('2D34078900075BCD15000000')
			.then(function(parsed) {
				global.expect(parsed.parts.Header).to.equal('00101101', 'Invalid header');
				global.expect(parsed.parts.Filter).to.equal(1, 'Invalid filter');
				global.expect(parsed.parts.Partition).to.equal(5, 'Invalid partition');
				global.expect(parsed.parts.CompanyPrefix).to.equal('0123456', 'Invalid company prefix');
				global.expect(parsed.parts.ServiceReference).to.equal('0123456789', 'Invalid service reference');
			});
	});

	it('getUri', function() {
		var p = gsrn.getUri('2D34078900075BCD15000000');

		return p.should.become('urn:epc:tag:gsrn:0123456.0123456789');
	});

	it('getName', function() {
		var p = gsrn.getName()
			.fail(function(err) {
				throw err;
			});

		return p.should.become('gsrn');
	});
});