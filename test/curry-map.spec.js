'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const CurryMap = require('../lib/curry-map');

const myApi = CurryMap({
    _level1: CurryMap({
        _level2: CurryMap({
            _level3: CurryMap({
                _level4: (...args) => args
            })
        }, CurryMap({
            _alt1: CurryMap({}, (...args) => args),
            _alt2: (...args) => args,
            _alt3: CurryMap.out(1, (...args) => args),
            _alt4: CurryMap.out(3, (...args) => args)
        }))
    }, CurryMap({
        _db1: CurryMap.capture(1, {
            _db2: CurryMap({
                _db3: (...args) => args
            })
        }),
        _multi: CurryMap.capture(3, {
            _output: (...args) => args
        }),
        _output: (...args) => args
    }))
})();

describe('CurryMap', function() {
    describe('library', function() {
        it('follows a valid argument', function() {
            expect(() => myApi('_level1')).to.not.throw();
        });
        it('throws on invalid argument', function() {
            expect(() => myApi('_does_not_exist')).to.throw();
        });
        it('traverses multiple arguments', function() {
            expect(myApi('_level1', '_level2', '_level3', '_level4')).to.eql([]);
            expect(myApi('_level1')('_level2')('_level3')('_level4')).to.eql([]);
            expect(myApi('_level1')('_level2', '_level3', '_level4')).to.eql([]);
            expect(myApi('_level1', '_level2')('_level3', '_level4')).to.eql([]);
            expect(myApi('_level1', '_level2', '_level3')('_level4')).to.eql([]);
        });
        it('captures default/any', function() {
            expect(myApi('_level1', '_level2', 'my data!', '_alt2')).to.eql(['my data!']);
        });
    });
    describe('out', function() {
        it('captures and immediately returns', function() {
            expect(myApi('_level1', '_level2', 'Tammy cat', '_alt3', 'more-data')).to.eql(['Tammy cat', 'more-data']);
        });
        it('captures many and immediately returns', function() {
            expect(myApi('_level1', '_level2', 'cat', '_alt4', 1, 25, 6)).to.eql(['cat', 1, 25, 6]);
        });
    });
    describe('capture', function() {
        it('captures and continues to traverse', function() {
            expect(myApi('_level1', 'My car', '_db1', 'My dog', '_db2', '_db3')).to.eql(['My car', 'My dog']);
        });
        it('captures many and continues to traverse', function() {
            expect(myApi('_level1', 'My phone', '_multi', 'castle', 'My spear', 'A spider!', '_output')).to.eql(['My phone', 'castle', 'My spear', 'A spider!']);
        });
    });
});
