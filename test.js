/// <reference path="typings/mocha/mocha.d.ts"/>
'use strict';

var chai = require('chai'),
	chaiAsPromised = require("chai-as-promised"),
	//assert = chai.assert,
	expect = chai.expect,
	epc = require('./index.js'),
	raw = require('./parser/raw'),
	sgtin = require('./parser/sgtin');

var InvalidRFIDVal = require('./errors/InvalidRFIDVal');

chai.use(chaiAsPromised);

chai.should();

// describe('Array', function() {
//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal(-1, [1, 2, 3].indexOf(5));
//       assert.equal(0, [1, 2, 3].indexOf(1));
//     });
//   });
// });

describe('epc', function() {
	describe('parse', function() {
		describe('validation', function() {
			it('Failed.  Too short.', function() {
				var p = epc.parse('1234567890abcd')
					.fail(function(err) {
						throw err;
					});

				//return assert.isRejected(p, InvalidRFIDVal);

				return p.should.be.rejected;
			});

			it('Failed.  Too short, not hex.', function() {
				var p = epc.parse('bad')
					.fail(function(err) {
						throw err;
					});

				return p.should.be.rejectedWith(InvalidRFIDVal);
			});

			it('Failed.  24 characters, not hex.', function() {
				var p = epc.parse('12345678901234567890pppp')
					.fail(function(err) {
						throw err;
					});

				return p.should.be.rejectedWith(InvalidRFIDVal);
			});

			it('24 characters, hex, lowercase.', function() {
				var p = epc.parse('123456789012345678abcdef')
					.fail(function(err) {
						throw err;
					});

				return p.should.be.fulfilled;
			});

			it('24 characters, hex, uppercase.', function() {
				var p = epc.parse('123456789012345678ABCDEF')
					.fail(function(err) {
						throw err;
					});

				return p.should.be.fulfilled;
			});

		});

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
				var p = raw.getName()
					.fail(function(err) {
						throw err;
					});

				return p.should.become('raw');
			});
		});


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
						expect(parsed.parts.Header).to.equal('00110000', 'Invalid header');
						expect(parsed.parts.Filter).to.equal(1, 'Invalid filter');
						expect(parsed.parts.Partition).to.equal(5, 'Invalid partition');
						expect(parsed.parts.CompanyPrefix).to.equal('0123456', 'Invalid company prefix');
						expect(parsed.parts.ItemReference).to.equal('012345', 'Invalid item reference');
						expect(parsed.parts.SerialNumber).to.equal(137438953473, 'Invalid serial number');
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

	});
});


// describe('epc', function(){
//   describe('parse', function(){
//     it('Too short, not hex', function(done){
//       epc.parse('bad')    
//       .fail(function(err){
//         throw err;
//       })
//       .done(done);
//     });  
//   });
// });