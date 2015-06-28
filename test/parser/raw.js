'use strict';

var raw = require('../../parser/raw');

describe('raw', function() {
	it('parse', function() {
		var p = raw.parse('123456789012345678ABCDEF');

		return p.should.be.fulfilled;
	});

	it('canParse', function() {
		var p = raw.canParse('123456789012345678ABCDEF');

		return p.should.become(true);
	});

	it('getUri', function() {
		var p = raw.getUri('123456789012345678ABCDEF');

		return p.should.become('urn:epc:raw:96.x123456789012345678ABCDEF');
	});

	it('getName', function() {
		global.assert.equal(raw.getName(), 'RAW');
	});
});