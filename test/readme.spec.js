'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const CurryMap = require('../lib/index');

describe('readme', function() {
    it('can do everything in the readme', function() {
        const paths = {
            batman: CurryMap({
                batarang: () => 'shwiiiing',
                parents: () => '...'
            }),
            joker: CurryMap({
                laugh: () => 'HaHAhahA',
                do_taxes: () => 'HAhaHAHAHa'
            })
        };

        const myApi = CurryMap(paths)();

        expect(myApi('joker', 'laugh')).to.equal('HaHAhahA');

        const capts = CurryMap({
            say_hi: (name) => 'Hi ' + name + '!',
            say_goodbye: (name) => 'Goodbye ' + name + '! :('
        });

        const mySecondApi = CurryMap(paths, capts)();

        expect(mySecondApi('batman', 'batarang')).to.equal('shwiiiing');
        expect(mySecondApi('Keith', 'say_hi')).to.equal('Hi Keith!');

        const ageify = (name, age) => name + ' is ' + age;
        const deep = {
            run: ageify
        };

        const myThirdApi = CurryMap({}, CurryMap({}, CurryMap(deep)))();

        expect(myThirdApi('Becca', 31, 'run')).to.equal('Becca is 31');

        const myFourthApi = CurryMap.capture(2, deep)();

        expect(myFourthApi('Ruddiger', 11, 'run')).to.equal('Ruddiger is 11');

        const myFifthApi = CurryMap.out(2, ageify)()

        expect(myFifthApi('Felix', 112)).to.equal('Felix is 112');
    });
});
