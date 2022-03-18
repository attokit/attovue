/**
 * attokit/attovue
 * working with VUE3
 * load vue files, and other required libs
 * 
 * https://github.com/attokit/attovue
 * 
 * @author  cgy
 * @email   cgy_design@126.com
 * @version 0.1.0
 * @date    2022-03-18
 * 
 * required libs:   axios, lodash, vue
 * optional libs:   vuex
 * 
 */

//import { _ } from "core-js";

const atto = Object.create(null);

/**
 * defineProperty / defineProperties
 * usage:
 *      atto.def('foo.bar', {v1:val1, ...})             => atto.foo.bar.v1 = val1, ...
 *      atto.def(foo.bar, {v1:val1, ...})               => foo.bar.v1 = val1, ...
 *      atto.def(foo.bar, 'jaz.tom', {v1:val1, ...})    => foo.bar.jaz.tom.v1 = val1, ...
 */
Object.defineProperty(atto, 'def', {
    value: (...args) => {
        if (args.length <= 0) return atto;
        if (_.isString(args[0]) || args.length <= 1) args.unshift(atto);
        if (!_.isPlainObject(args.slice(-1)[0])) return args[0];
        let target = args.shift(),
            values = args.pop(),
            props = args.length <= 0 ? [] : args.join('.').split('.');

        if (props.length > 0) {
            for (let i=0; i<props.length; i++){
                if (_.isUndefined(target[props[i]])) {
                    Object.defineProperty(target, props[i], {
                        value: Object.create(null)
                    });
                }
                target = target[props[i]];
            }
        }
        
        let descriptor = Object.create(null);
        for (let [k, v] of Object.entries(values)) {
            if (!_.isUndefined(target[k])) {
                let desc = Object.getOwnPropertyDescriptor(target, k);
                if (desc.writable !== true) continue;
            }
            if (_.isPlainObject(v) && !_.isUndefined(v.value)) {
                descriptor = v;
            } else {
                descriptor.value = v;
            }
            Object.defineProperty(target, k, descriptor);
            descriptor = Object.create(null);
        }
        
        return target;
    }
});

/**
 * type detective
 * using lodash _.isXxxx()
 */
Object.defineProperty(atto, 'is', {
    value: new Proxy(
        (any, ...optional) => {
            let types = [
                    'undefined',
                    'null',
                    'array',
                    'function',
                    'asyncfunction',
                    'boolean',
                    'string',
                    'number',
                    'symbol',
                    'set',
                    'map',
                    'element',
                    'object',
                ],
                type = 'Unknown',
                m = '';
            for (let [i, t] of types.entries()) {
                m = `is${t.slice(0,1).toUpperCase()}${t.slice(1)}`;
                if (typeof _[m] == 'function' && _[m](any) === true) {
                    type = m.slice(2);
                    break;
                }
            }
            if (optional.length <= 0) return type;
            optional = optional.join('.').toLowerCase().split('.');
            return optional.includes(type.toLowerCase());
        },
        {
            get(target, property, receiver) {
                let keys = Object.keys(_),
                    iskeys = keys.filter(key => key.startsWith('is')),
                    types = Array.from(iskeys, key => key.slice(2)),
                    low = Array.from(types, type => type.toLowerCase());
                if (low.includes(property.toLowerCase())) {
                    let idx = low.indexOf(property.toLowerCase());
                    return _[iskeys[idx]];
                } else {
                    return property == '__all__' ? iskeys : () => false;
                }
            }
        }
    )
});

/**
 * root obj (self || window || global)
 */
atto.def({
    root() {
        return  !_.isUndefined(self) ? self :
                !_.isUndefined(window) ? window :
                !_.isUndefined(global) ? global : undefined;
    }
});

/**
 * import libs (es6 module)
 * @param String src    lib cdn address
 * @return Promise
 */





/**
 * use in webpage
 */
atto.def(atto.root(), {
    atto
});

/**
 * es6 export
 */
export default {
    atto
}
