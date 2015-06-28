'use strict';

global.chai = require('chai');
global.chaiAsPromised = require("chai-as-promised");
global.assert = global.chai.assert;
global.expect = global.chai.expect;
// epc = require('../index.js'),
// raw = require('../parser/raw'),
// sgtin = require('../parser/sgtin');

//var InvalidRFIDVal = require('../errors/InvalidRFIDVal');

global.chai.use(global.chaiAsPromised);

global.chai.should();