Keypath = function() {
    var Keypath = {};

    var DEFAULTS = {
        assertionMessage: 'Assertion failed'
    };

    Keypath.VERSION = '0.1.9';

    Keypath.set = function(target, path, value) {
        if (!target) return undefined;

        var keys = path.split('.');
        path = keys.pop();
        keys.forEach(function(prop) {
            if (!target[prop]) target[prop] = {};
            target = target[prop];
        });

        Keypath._set(target, path, value); //target[path] = value;

        return target;
    };

    Keypath.get = function(target, path, defaultValue) {
        if (!target || !path) return false;

        path = path.split('.');
        var l = path.length,
            i = 0,
            p = '';
        for (; i < l; ++i) {
            p = path[i];
            if (target.hasOwnProperty(p)) target = target[p];
            else return Keypath._get(defaultValue);
        }
        return Keypath._get(target);
    };

    Keypath.has = function(target, path) {
        return this.get(target, path, '#$#NFV#$#') !== '#$#NFV#$#';
    };

    Keypath.assert = function(target, path, message) {
        message = message || Keypath.DEFAULTS.assertionMessage;
        var value = this.get(target, path, message);

        if (value !== message) return value;

        this.onError(message, path);

        return undefined;
    };

    Keypath.wrap = function(target, inject) {
        var wrapper = new Wrapper(target);
        if (!inject) return wrapper;
        if (typeof inject === 'function') inject(target, wrapper);
        if (typeof inject === 'string') Keypath.set(target, inject, wrapper);
        return wrapper;
    };


    Keypath.onError = console.error.bind(console);

    ///////////////////////////////////////////////////
    // PRIVATE METHODS
    ///////////////////////////////////////////////////
    Keypath._get = function(value) {
        return typeof value === 'function' ? value() : value;
    };

    Keypath._set = function(src, method, val) {
        if (typeof src[method] === 'function') return src[method].call(src, val);
        return src[method] = val;
    };

    ///////////////////////////////////////////////////
    // WRAPPER Internal Class
    ///////////////////////////////////////////////////
    /**
     * Wrapper Constructor
     * @param {Object} target Object to be wrapped
     */
    function Wrapper(target) {
        this.target = target;
    }

    Wrapper.prototype.set = function(path, value) {
        return Keypath.set(this.target, path, value);
    };

    Wrapper.prototype.get = function(path, defaultValue) {
        return Keypath.get(this.target, path, defaultValue);
    };

    Wrapper.prototype.has = function(path) {
        return Keypath.has(this.target, path);
    };

    Keypath.Wrapper = Wrapper;

    return Keypath;
}();
