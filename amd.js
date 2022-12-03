"use strict";
(window => {
    const define = (window.define || (window.define = _define));
    const modules = (_require.modules = define.modules = define.modules || {});
    const modulePromise = {};
    const BASENAME_REGEX = /\/?([^/]+)$/;
    const windowRequire = (window.require || _require);
    function dirname(path) {
        return path.replace(BASENAME_REGEX, '');
    }
    function normalize(path, basePath) {
        return new URL(basePath + '/' + (path.endsWith('.js') ? path : `${path}.js`), 'https://localhost').pathname.slice(1);
    }
    async function _requireAsync(path) {
        await Promise.resolve();
        const mod = modules[path] || modulePromise[path];
        if (mod)
            return mod;
        const modulePath = windowRequire.replace
            ? windowRequire.replace(path)
            : path;
        return (modulePromise[path] = _import(modulePath, path));
    }
    function _require(path, resolve, reject, basePath) {
        let actualPath = Array.isArray(path) ? path[0] : path;
        let mod = modules[actualPath];
        if (!mod) {
            if (typeof module !== 'undefined' && module.require) {
                try {
                    mod = module.require(actualPath);
                }
                catch (e) {
                }
            }
            if (!mod) {
                if (basePath)
                    actualPath = normalize(actualPath, basePath);
                mod = _requireAsync(actualPath);
            }
        }
        if (resolve) {
            if (mod instanceof Promise)
                mod.then(resolve, reject);
            else
                resolve(mod);
        }
        return mod;
    }
    function defineAsync(name, injects, module) {
        let isAsync = false;
        const moduleExports = {};
        const args = [];
        function resolve(newargs) {
            const mod = (window.module = {
                exports: moduleExports,
            });
            const result = module(...newargs);
            const resultMod = (modules[name] =
                result || mod.exports || moduleExports);
            delete modulePromise[name];
            return resultMod;
        }
        function findModule(modname) {
            if (modname === 'exports')
                return moduleExports;
            if (modname === 'require')
                return _require;
            if (modname.startsWith('.'))
                return _require(modname, undefined, undefined, dirname(name));
            return _require(modname);
        }
        for (const inject of injects) {
            const mod = findModule(inject);
            if (mod instanceof Promise)
                isAsync = true;
            args.push(mod);
        }
        return isAsync ? Promise.all(args).then(resolve) : resolve(args);
    }
    function defineNormalized(name, injects, module) {
        if (!modules[name])
            modulePromise[name] = defineAsync(name, injects, module);
        else
            throw new Error(`Module "${name}" already defined`);
    }
    function _define(name, injects, module) {
        if (Array.isArray(name) && injects && !Array.isArray(injects)) {
            defineNormalized(define.moduleName, name, injects);
        }
        else if (typeof name === 'function') {
            defineNormalized(define.moduleName, [], name);
        }
        else if (typeof name === 'string' && Array.isArray(injects) && module)
            defineNormalized(name, injects, module);
        else
            throw new Error('Invalid define');
    }
    function _import(url, moduleName) {
        return fetch(url)
            .then(res => (res.status === 200 ? res.text() : ''))
            .then(__src => {
            if (!__src)
                return (modules[moduleName] = {});
            define.moduleName = moduleName;
            delete modulePromise[moduleName];
            define.eval(`${__src}\n//# sourceURL=${moduleName}`);
            return modules[moduleName] || modulePromise[moduleName] || {};
        });
    }
    if (typeof require !== 'undefined')
        _require.resolve = require.resolve;
    window.require = window.require || _require;
    _define.amd = true;
})(typeof self === 'undefined' ? global : self);
define.eval || (define.eval = function (__source) {
    eval(__source);
});
//# sourceMappingURL=index.js.map