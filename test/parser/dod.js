'use strict';

var dod = require('../../parser/dod');

describe('dod', function() {
	it('canParse.  Failed.  Invalid format.', function() {
		var p = dod.canParse('123456789012345678ABCDEF');

		return p.should.become(false);
	});

	it('canParse', function() {
		var p = dod.canParse('2F0203253313934800000001');

		return p.should.become(true);
	});

	it('parse.  Failed.  Invalid format.', function() {
		var p = dod.parse('123456789012345678ABCDEF');

		return p.should.be.rejectedWith(Error);
	});

	it('parse', function() {
		return dod.parse('2F0203253313934800000001')
			.then(function(parsed) {
				global.expect(parsed.parts.Header).to.equal('00101111', 'Invalid header');
				global.expect(parsed.parts.Filter).to.equal(0, 'Invalid filter');
				global.expect(parsed.parts.CAGEOrDODAAC).to.equal('2S194', 'Invalid CAGE code');
				global.expect(parsed.parts.SerialNumber).to.equal(34359738369, 'Invalid serial number');
			});
	});

	it('getUri', function() {
		var p = dod.getUri('2F0203253313934800000001');

		return p.should.become('urn:epc:tag:usdod:2S194.34359738369');
	});

	it('getName', function() {
		var p = dod.getName()
			.fail(function(err) {
				throw err;
			});

		return p.should.become('dod');
	});
});