
/** Copyright (c) 2024, Manuel Lõhmus (MIT License). */

'use strict';

(function () {

    exportModule("url-fragment-extender", [], function factory() {

        var UFE = Object.create(null, {

            readHash: {
                writable: false, configurable: false, enumerable: false,

                value: function readHash() {

                    var hash = decodeURI(location.hash);

                    hash.slice(1)
                        .split(/[&|;]/g)
                        .forEach(function (key_val) {
                            var [key, val] = key_val.split('=');
                            UFE.emit(key, { key, value: val || '', fragment: hash });
                            UFE.emit('-', { key, value: val || '', fragment: hash });
                        });
                }
            },

            // EventEmitter
            _events: { value: {}, writable: false, configurable: false, enumerable: false },

            once: {
                writable: false, configurable: false, enumerable: false,
                /**
                * @param {string} eventName
                * @param {(...params:any)=>void} listener
                * @returns {DataContext}
                */
                value: function once(eventName, listener) {

                    return UFE.on(eventName, listener, false);
                }
            },

            on: {
                writable: false, configurable: false, enumerable: false,

                /**
                * @param {string} eventName
                * @param {(...params:any)=>void} listener
                * @param {boolean|()=>boolean|Node} isActive If false then adds a one-time listener function for the event named eventName. The next time eventName is triggered, this listener is removed and then invoked.
                * @returns {DataContext}
                */
                value: function on(eventName, listener, isActive = true) {

                    if (!UFE._events[eventName]) { UFE._events[eventName] = []; }

                    UFE._events[eventName].push(listener);
                    isActive && (listener.isActive = isActive);

                    return UFE;
                }
            },

            emit: {
                writable: false, configurable: false, enumerable: false,

                value: function emit(eventName, ...params) {

                    var ret = false;
                    var arr = UFE._events[eventName] || [];
                    var index = 0;

                    while (index < arr.length) {

                        var listener = arr[index];

                        if (arr[index] === listener &&
                            (typeof listener.isActive === "function" && !listener.isActive()
                                || listener.isActive?.isConnected === false
                                || listener.isActive === undefined
                                || !listener.isActive === true)) {

                            arr.splice(index, 1);
                        }

                        if (typeof listener.isActive === "function" && listener.isActive()
                            || listener.isActive?.isConnected === true
                            || listener.isActive === undefined
                            || listener.isActive === true) {

                            ret = true;

                            if (!listener.call("undefined" != typeof window && listener.isActive instanceof window.Node && listener.isActive, ...params)) {

                                arr.splice(index, 1);
                            }
                        }

                        if (arr[index] === listener) { index++; }
                    }

                    if (UFE._events[eventName] && !UFE._events[eventName].length) {

                        delete UFE._events[eventName];
                    }

                    return ret;
                }
            }
        });

        waitForReadyState("complete", UFE.readHash);
        addEventListener("hashchange", UFE.readHash);

        return UFE;


        function waitForReadyState(state, cb) {

            if (document.readyState == state)
                setTimeout(cb, 50);
            else
                setTimeout(waitForReadyState, 0, state, cb);
        }
    });

    /**
     * Exporting the library as a module.
     * @param {string} exportIdentifier Export identifier
     * @param {string[]} importIdentifierArray Import identifier array
     * @param {any} factory Factory function
     * @returns {void}
     */
    function exportModule(exportIdentifier, importIdentifierArray, factory) {

        var thisScope = "undefined" != typeof globalThis
            ? globalThis
            : "undefined" != typeof window
                ? window
                : "undefined" != typeof global
                    ? global : "undefined" != typeof self
                        ? self
                        : {};

        if (!thisScope.modules) { thisScope.modules = {}; }

        // Browser
        waitModules();


        function waitModules() {

            if (importIdentifierArray.length) {

                for (let i = 0; i < importIdentifierArray.length; i++) {

                    if (!thisScope.modules[importIdentifierArray[i]]) { return setTimeout(waitModules, 10); }
                }
            }

            thisScope.modules[exportIdentifier] = factory.call(thisScope, ...importIdentifierArray.map(function (id) { return thisScope.modules[id]; }));
        }
    }
})();