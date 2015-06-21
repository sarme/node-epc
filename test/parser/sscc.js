'use strict';

var sscc = require('../../parser/sscc');

describe('sscc', function() {
	it('canParse.  Failed.  Invalid format.', function() {
		var p = sscc.canParse('123456789012345678ABCDEF');

		return p.should.become(false);
	});

	it('canParse', function() {
		var p = sscc.canParse('313407890200000001000000');

		return p.should.become(true);
	});

	it('parse.  Failed.  Invalid format.', function() {
		var p = sscc.parse('123456789012345678ABCDEF');

		return p.should.be.rejectedWith(Error);
	});

	it('parse', function() {
		return sscc.parse('313407890200000001000000')
			.then(function(parsed) {
				global.expect(parsed.parts.Header).to.equal('00110001', 'Invalid header');
				global.expect(parsed.parts.Filter).to.equal(1, 'Invalid filter');
				global.expect(parsed.parts.Partition).to.equal(5, 'Invalid partition');
				global.expect(parsed.parts.CompanyPrefix).to.equal('0123456', 'Invalid company prefix');
				global.expect(parsed.parts.SerialReference).to.equal(8589934593, 'Invalid serial reference');
			});
	});

	it('getUri', function() {
		var p = sscc.getUri('313407890200000001000000');

		return p.should.become('urn:epc:tag:sscc:0123456.8589934593');
	});

	it('getName', function() {
		var p = sscc.getName()
			.fail(function(err) {
				throw err;
			});

		return p.should.become('sscc');
	});
});