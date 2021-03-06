'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const CurryMap = require('../lib/curry-map');

const myApi = CurryMap({
    _level1: CurryMap({
        _level2: CurryMap({
            _level3: CurryMap({
                _level4: (...curry) => curry
            }),
            _: CurryMap({
                _alt1: CurryMap({
                    proto: {
                        test: (...curry) => (...args) => [curry, args]
                    },
                    _: (...curry) => curry
                }),
                _alt2: (...curry) => curry,
                _alt3: CurryMap.deep(1, (...curry) => curry),
                _alt4: CurryMap.deep(3, (...curry) => curry)
            })
        }),
        _: CurryMap({
            _db1: CurryMap.deep(1, CurryMap({
                _db2: CurryMap({
                    _db3: (...curry) => curry
                })
            })),
            _multi: CurryMap.deep(3, CurryMap({
                _output: (...curry) => curry
            })),
            _prots1: CurryMap({
                proto: {
                    testing: (...curry) => (...args) => [curry, args]
                },
                _prots2: (...curry) => curry
            }),
            _output: (...curry) => curry
        })
    })
})();

describe('CurryMap', function() {
    describe('library', function() {
        it('creates a currymap', function () {
            expect(() => CurryMap({})()).to.not.throw();
        });
        it('throws on args not an object', function () {
            expect(() => CurryMap('oop')()).to.throw();
            expect(() => CurryMap(undefined)()).to.throw();
            expect(() => CurryMap(() => {})()).to.throw();
        });
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
    describe('prototype', function() {
        it('accepts prototype extensions', function () {
            const proto = { hooray: (...curry) => (arg1) => 'success ' + arg1 };
            expect(CurryMap({ proto })().hooray('yay')).to.equal('success yay');
        });
        it('throws on prototype not a function', function () {
            expect(() => CurryMap({ proto: { hello: 'oops' } })()).to.throw();
            expect(() => CurryMap({ proto: { hello: { hi: 'oops' } } })()).to.throw();
        });
        it('throws on restricted prototypes', function () {
            expect(() => CurryMap({ proto: { call: () => 'ooops' } })()).to.throw();
            expect(() => CurryMap({ proto: { bind: () => 'ooops' } })()).to.throw();
            expect(() => CurryMap({ proto: { apply: () => 'ooops' } })()).to.throw();
            expect(() => CurryMap({ proto: { toString: () => 'ooops' } })()).to.throw();
        });
        it('runs deep prototype extensions', function () {
            expect(myApi('_level1', '_level2', 'Testing!', '_alt1').test('arg-1', 'arg-2')).to.eql([['Testing!'], ['arg-1', 'arg-2']]);
            expect(myApi('_level1', 'foo', '_prots1').testing('arg-3', 'arg-4')).to.eql([['foo'], ['arg-3', 'arg-4']]);
        });
        it('can keep traversing past prototype extensions', function () {
            expect(myApi('_level1', 'hi', '_prots1', '_prots2')).to.eql(['hi']);
        });
    });
    describe('deep', function() {
        it('creates a currymap', function () {
            expect(() => CurryMap.deep(1, () => {})).to.not.throw();
        });
        it('thows on invalid number', function () {
            expect(() => CurryMap.deep({}, () => {})).to.throw();
            expect(() => CurryMap.deep('oops', () => {})).to.throw();
            expect(() => CurryMap.deep(undefined, () => {})).to.throw();
        });
        it('thows on invalid function', function () {
            expect(() => CurryMap.deep(1, 'oops')).to.throw();
            expect(() => CurryMap.deep(1, undefined)).to.throw();
            expect(() => CurryMap.deep(1, { nope: 'oop' })).to.throw();
        });
        it('captures and immediately returns', function() {
            expect(myApi('_level1', '_level2', 'Tammy cat', '_alt3', 'more-data')).to.eql(['Tammy cat', 'more-data']);
        });
        it('captures many and immediately returns', function() {
            expect(myApi('_level1', '_level2', 'cat', '_alt4', 1, 25, 6)).to.eql(['cat', 1, 25, 6]);
        });
        it('captures and continues to traverse', function() {
            expect(myApi('_level1', 'My car', '_db1', 'My dog', '_db2', '_db3')).to.eql(['My car', 'My dog']);
        });
        it('captures many and continues to traverse', function() {
            expect(myApi('_level1', 'My phone', '_multi', 'castle', 'My spear', 'A spider!', '_output')).to.eql(['My phone', 'castle', 'My spear', 'A spider!']);
        });
    });
});
