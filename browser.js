/** Url-fragment-extender commander functions for JavaScript. @preserve Copyright (c) 2021 Manuel Lõhmus. */
'use strict';

(function (global, factory) {
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
        global.UFE = factory(global.UFE = {}));
}(this, (function (UFE) {

    if (UFE && UFE.name === "UFE") return UFE;
    else UFE.name = "UFE";

    function readHash() {

        location.hash.slice(1)
            .split(/[&|;]/g)
            .forEach(function (key_val) {
                UFE.Command(key_val, location.hash);
            });
    }
    UFE.ReadHash = readHash;
    UFE.Command = function (key_val, fragment) {

        var arr = key_val.split("=");
        var key = arr[0].trim().toLowerCase();
        var val = arr[1];

        if (typeof UFE.Commands[key] === "function")
            UFE.Commands[key](val, fragment);
        else if (typeof UFE.Commands[""] === "function")
            UFE.Commands[""](key, val, fragment);
    };
    UFE.Commands = {
        lang: function (val) { if (typeof val === "string") { document.documentElement.lang = val.trim().toLowerCase(); } },
        print: function () { window.print(); }
    };

    addEventListener("hashchange", UFE.ReadHash);
    var isLoaded = false;
    function start() {
        if (isLoaded) return;
        UFE.ReadHash();
        isLoaded = true;
    }
    UFE.AutoStart = function () { addEventListener("load", start); };

    return UFE;

})));