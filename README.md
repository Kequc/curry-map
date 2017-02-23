CurryMap
===

Currying with pathways

### Install the module from npm

```
npm i curry-map --save
```

### How do I use this library?

Brace yourself. Not for the faint fo heart. Okay maybe I'm exagerating a bit, but it looks complicated bear with me. Currying is the ability to pass parameters to a function all at once or one at a time.

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

### Capturing default input

The first parameter of `CurryMap` is always an object containing api endpoints. An optional second parameter indicates any other input should it not be in the arguments list, for example a document id or database name should you need them. Things start to get complicated here be vigilant.

```javascript
const capts = CurryMap({
    say_hi: (name) => 'Hi ' + name + '!',
    say_goodbye: (name) => 'Goodbye ' + name + '! :('
});

const mySecondApi = CurryMap(paths, capts)();

mySecondApi('batman', 'batarang');
mySecondApi('Keith', 'say_hi');
```
```
#=> shwiiiing
#=> Hi Keith!
```

Any default CurryMap captures input and delivers it to the endpoint, you can do this many times.

```javascript
const ageify = (name, age) => name + ' is ' + age;
const deep = {
    run: ageify
};

const myThirdApi = CurryMap({}, CurryMap({}, CurryMap(deep)))();

myThirdApi('Becca', 31, 'run');
```
```
#=> Becca is 31
```

### Capture helper to clean up

The following is equivalent to the above.

```javascript
const myFourthApi = CurryMap.capture(2, deep)();

myFourthApi('Ruddiger', 11, 'run');
```
```
#=> Ruddiger is 11
```

### Out helper to exit right away

If you would like to capture some input and exit right away.

```javascript
const myFifthApi = CurryMap.out(2, ageify)()

myFifthApi('Felix', 112);
```
```
#=> Felix is 112
```

### General considerations

When you compile a complex CurryMap it's going to look like a big huge mess. I'm not sure what to tell you about how to fix that. Some kind of extreme discipline is probably required in order to keep it looking sane and manageable, or if you have a robot eye you may be able to understand all of the paths.

### Contribute

If you like what you see please feel encouraged to [get involved](https://github.com/Kequc/curry-map/issues) report problems and submit pull requests! As of the time of this writing the project is new with one maintainer.
