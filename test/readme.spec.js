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

        const mySecondApi = CurryMap({
            batman: CurryMap({
                say_hi: () => 'I am the night.'
            }),
            _: CurryMap({
                say_hi: (name) => 'Hi ' + name + '!',
                say_goodbye: (name) => 'Goodbye ' + name + '! :('
            })
        })();

        expect(mySecondApi('batman', 'say_hi')).to.equal('I am the night.');
        expect(mySecondApi('Jacob', 'say_hi')).to.equal('Hi Jacob!');
        expect(mySecondApi('Brooke', 'say_goodbye')).to.equal('Goodbye Brooke! :(');

        const ageify = (name, age) => name + ' is ' + age;

        const myThirdApi = CurryMap({ _: CurryMap({ _: ageify }) })();

        expect(myThirdApi('Felicity', 31)).to.equal('Felicity is 31');

        const myFourthApi = CurryMap.deep(2, ageify)();

        expect(myFourthApi('Felicity', 31)).to.equal('Felicity is 31');

        const myFifthApi = CurryMap.deep(2, CurryMap({ run: ageify }))();

        expect(myFifthApi('Ruddiger', 112, 'run')).to.equal('Ruddiger is 112');

        const superman = CurryMap({
            fly: () => 'Swoooosh',
            turn_back_time: () => 'Swoooooooooooosh',
            _: CurryMap({
                punch: (who) => 'WHAMMO',
                proto: {
                    threaten: (who) => (words) => 'Forsooth ' + who + '! ' + words,
                    address: (who) => (words) => 'Dearest ' + who + '. ' + words
                }
            })
        });

        const mySixthApi = CurryMap({ superman })();

        expect(mySixthApi('superman', 'bad guy').threaten('You are out of time.')).to.equal('Forsooth bad guy! You are out of time.');
        expect(mySixthApi('superman', 'bad guy', 'punch')).to.equal('WHAMMO');
        expect(mySixthApi('superman', 'citizens').address('Celebrate!')).to.equal('Dearest citizens. Celebrate!');
    });
});
