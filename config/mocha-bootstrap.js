const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSubset = require('chai-subset');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiSubset);

global.chai = chai;
global.should = chai.should();
global.assert = chai.assert;
global.expect = chai.expect;

global.sinon = sinon;