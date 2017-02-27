CurryMap
===

Currying with pathways

### Install the module from npm

```
npm i curry-map --save
```

### How do I use this library?

Brace yourself. Not for the faint fo heart.

Okay maybe I'm exaggerating a bit, but it looks complicated bear with me. Currying is the ability to pass parameters to a function all at once or one at a time.

```javascript
// all equivalent
aCurriedFunc('my-arg-1', 'my-arg-2', 'my-arg-3');
aCurriedFunc('my-arg-1')('my-arg-2')('my-arg-3');
aCurriedFunc('my-arg-1')('my-arg-2', 'my-arg-3');
aCurriedFunc('my-arg-1', 'my-arg-2')('my-arg-3');
```

What if a different function were run depending on which arguments were passed, that is the goal of this library.

### Building a CurryMap

Your only task at this moment as a developer is to build a CurryMap. Each argument takes you closer to a end result but at which end result will you arrive?

```javascript
const CurryMap = require('curry-map');

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

myApi('joker', 'laugh');
```
```
#=> HaHAhahA
```

Note: One single `()` follows *only* the primary definition.

### Capturing input

`CurryMap` requires an object containing api endpoints as a first parameter. Optionally provide an `_` indicating any other input should it not be in the arguments list, for example a document id or database name should you need them. Things start to get complicated here be vigilant.

```javascript
const mySecondApi = CurryMap({
    batman: CurryMap({
        say_hi: () => 'I am the night.'
    }),
    _: CurryMap({
        say_hi: (name) => 'Hi ' + name + '!',
        say_goodbye: (name) => 'Goodbye ' + name + '! :('
    })
})();

mySecondApi('batman', 'say_hi');
mySecondApi('Jacob', 'say_hi');
mySecondApi('Brooke', 'say_goodbye');
```
```
#=> I am the night.
#=> Hi Jacob!
#=> Goodbye Brooke! :(
```

You can do this many times.

```javascript
const ageify = (name, age) => name + ' is ' + age;

const myThirdApi = CurryMap({ _: CurryMap({ _: ageify }) })();

myThirdApi('Felicity', 31);
```
```
#=> Felicity is 31
```

### Capture helper

The following is equivalent to above.

```javascript
const myFourthApi = CurryMap.deep(2, ageify)();

myFourthApi('Felicity', 31);
```
```
#=> Felicity is 31
```

You can also keep things going if you want to with another CurryMap.

```javascript
const myFifthApi = CurryMap.deep(2, CurryMap({ run: ageify }))();

myFifthApi('Ruddiger', 112, 'run');
```
```
#=> Ruddiger is 112
```

### Extending the prototype

Prototype extensions are passed with the `proto` keyword. It's an object whose values are functions which accept the curry followed by whatever you want to return.

```javascript
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

mySixthApi('superman', 'bad guy').threaten('You are out of time.');
mySixthApi('superman', 'bad guy', 'punch');
mySixthApi('superman', 'citizens').address('Celebrate!');
```
```
#=> Forsooth bad guy! You are out of time.
#=> WHAMMO
#=> Dearest citizens. Celebrate!
```

### General considerations

A `CurryMap` is a function accepting `(...curry)` as its parameters returning a function whch when run traverses further.

When you compile a complex CurryMap it's going to look a bit like big mess. I'm not sure what to tell you about how to fix that. Some kind of extreme discipline is probably required in order to keep it looking sane and manageable, or if you have a robot eye you may be able to understand all of the paths.

### Contribute

If you like what you see please feel encouraged to [get involved](https://github.com/Kequc/curry-map/issues) report problems and submit pull requests! As of the time of this writing the project is new with one maintainer.
