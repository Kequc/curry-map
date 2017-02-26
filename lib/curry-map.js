'use strict';

const RESTRICTED = [
    'apply bind call isGenerator toSource toString __proto__ __noSuchMethod__',
    'hasOwnProperty isPrototypeOf propertyIsEnumerable toSource toLocaleString',
    'unwatch valueOf watch'
].join(' ').split(' ');

const CurryMap = (args, defa, prot = {}) => {
    if (typeof args !== 'object') throw new Error('Expected an object.');
    if (typeof defa === 'object') {
        prot = defa;
        defa = undefined;
    }
    if (defa && typeof defa !== 'function') throw new Error('Expected a function.');
    if (typeof prot !== 'object') throw new Error('Expected prot to be an object.');

    for (const key of Object.keys(prot)) {
        if (RESTRICTED.includes(key)) throw new Error('Restricted prototype: ' + key);
        if (typeof prot[key] !== 'function') throw new Error('Expected a function: ' + key);
    }

    return (...curry) => _buildCurry(args, defa, prot, curry);
};

function _buildCurry(args, defa, prot, curry) {
    const func = (...params) => {
        let output = _traverse(args, defa, params.shift(), curry);
        for (const param of params) {
            output = output(param);
        }
        return output;
    };

    for (const key of Object.keys(prot)) {
        func[key] = prot[key](...curry);
    }

    return func;
}

function _traverse(args, defa, param, curry) {
    if (args[param])
        return args[param](...curry);
    if (defa)
        return defa(...curry.concat([param]));

    throw new Error('Invalid argument: ' + param + ', did you mean one of these? ' + JSON.stringify(args));
}

CurryMap.deep = (count, defa, prot) => {
    if (typeof count !== 'number' || count < 1) throw new Error('Expected a number over 0.');
    if (typeof defa !== 'function') throw new Error('Expected a function.');

    defa = CurryMap({}, defa, prot);
    while (count > 1) {
        defa = CurryMap({}, defa);
        count--;
    }

    return defa;
};

module.exports = CurryMap;
