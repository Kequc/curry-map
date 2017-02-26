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

        const myThirdApi = CurryMap({}, CurryMap({}, ageify))();

        expect(myThirdApi('Becca', 31)).to.equal('Becca is 31');

        const myFourthApi = CurryMap.deep(2, ageify)();

        expect(myFourthApi('Becca', 31)).to.equal('Becca is 31');

        const myFifthApi = CurryMap.deep(2, CurryMap({ run: ageify }))();

        expect(myFifthApi('Ruddiger', 112, 'run')).to.equal('Ruddiger is 112');

        const mySixthApi = CurryMap({
            superman: CurryMap({
                fly: () => 'Swoooosh',
                turn_back_time: () => 'Swoooooooooooosh',
                arms: CurryMap({
                    punch: () => 'WHAMMO'
                })
            }, CurryMap({}, {
                threaten: (who) => (words) => 'Forsooth ' + who + '! ' + words,
                address: (who) => (words) => 'Dearest ' + who + '. ' + words
            }))
        })();

        expect(mySixthApi('superman', 'bad guy').threaten('You are out of time.')).to.equal('Forsooth bad guy! You are out of time.');
        expect(mySixthApi('superman', 'arms', 'punch')).to.equal('WHAMMO');
        expect(mySixthApi('superman', 'citizens').address('Celebrate!')).to.equal('Dearest citizens. Celebrate!');
    });
});
