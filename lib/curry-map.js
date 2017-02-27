'use strict';
const SPECIAL_ARGS = ['_', 'proto'];

const CurryMap = (args) => {
    // validate parameters
    if (typeof args !== 'object') throw new Error('Expected an object.');
    if (args.proto && typeof args.proto !== 'object') throw new Error('Expected proto to be an object.');
    if (args._ && typeof args._ !== 'function') throw new Error('Expected _ to be a function.');

    if (args.proto) {
        for (const key of Object.keys(args.proto)) {
            if (key in Function) throw new Error('Restricted prototype: ' + key);
            if (typeof args.proto[key] !== 'function') throw new Error('Expected a function: ' + key);
        }
    }

    // ok
    return (...curry) => _result(args, curry);
};

function _result(args, curry) {
    // returns a function
    const func = (...params) => {
        let output = _traverse(args, params.shift(), curry);
        for (const param of params) {
            output = output(param);
        }
        return output;
    };

    // extend the prototype
    if (args.proto) {
        for (const key of Object.keys(args.proto)) {
            func[key] = args.proto[key](...curry);
        }
    }

    // ok
    return func;
}

function _traverse(args, param, curry) {
    // valid arguments
    const validArgs = Object.keys(args).filter(key => !SPECIAL_ARGS.includes(key));

    // run
    if (validArgs.includes(param))
        return args[param](...curry);
    if (args._)
        return args._(...curry.concat([param]));

    // invalid param
    throw new Error('Invalid argument: ' + param + ', did you mean one of these? ' + JSON.stringify(validArgs));
}

CurryMap.deep = (count, func) => {
    // validate parameters
    if (typeof count !== 'number') throw new Error('Expected a number.');
    if (typeof func !== 'function') throw new Error('Expected a function.');

    // nest callback
    while (count > 0) {
        func = CurryMap({ _: func });
        count--;
    }

    // ok
    return func;
};

module.exports = CurryMap;
