'use strict';

function _traverse(args, defa, param, curry) {
    if (args[param])
        return args[param](...curry);
    if (defa)
        return defa(...curry.concat([param]));

    throw new Error('Invalid argument: ' + param + ', did you mean one of these? ' + JSON.stringify(Object.keys(args)));
}

const CurryMap = (args, defa) => (...curry) => (...params) => {
    if (typeof args !== 'object') throw new Error('Expected an object.');

    let output = _traverse(args, defa, params.shift(), curry);
    for (const param of params) {
        output = output(param);
    }
    return output;
};

CurryMap.out = (count, deep) => {
    if (typeof count !== 'number') throw new Error('Expected a number.');
    if (typeof deep !== 'function') throw new Error('Expected a function.');

    while (count > 0) {
        deep = CurryMap({}, deep);
        count--;
    }
    return deep;
};

CurryMap.capture = (count, args, defa) => {
    return CurryMap.out(count, CurryMap(args, defa));
};

module.exports = CurryMap;
