'use strict';

var gid = require('../../parser/gid');

describe('gid', function() {
	it('canParse.  Failed.  Invalid format.', function() {
		var p = gid.canParse('123456789012345678ABCDEF');

		return p.should.become(false);
	});

	it('canParse', function() {
		var p = gid.canParse('358000001800001800000001');

		return p.should.become(true);
	});

	it('parse.  Failed.  Invalid format.', function() {
		var p = gid.parse('123456789012345678ABCDEF');

		return p.should.be.rejectedWith(Error);
	});

	it('parse', function() {
		return gid.parse('358000001800001800000001')
			.then(function(parsed) {
				global.expect(parsed.parts.Header).to.equal('00110101', 'Invalid header');
				global.expect(parsed.parts.ManagerNumber).to.equal(134217729, 'Invalid company prefix');
				global.expect(parsed.parts.ObjectClass).to.equal(8388609, 'Invalid item reference');
				global.expect(parsed.parts.SerialNumber).to.equal(34359738369, 'Invalid serial number');
			});
	});

	it('getUri', function() {
		var p = gid.getUri('358000001800001800000001');

		return p.should.become('urn:epc:tag:gid:134217729.8388609.34359738369');
	});

	it('getName', function() {
		global.assert.equal(gid.getName(), 'GID');
	});
});