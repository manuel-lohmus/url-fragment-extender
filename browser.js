/** Copyright (c) Manuel Lõhmus (MIT License). */

'use strict';

// browser support: /foo.html#strID -> The string ID of the DOM element.
// browser support: #:~:text=[prefix-,]textStart[,textEnd][,-suffix] -> The browser will highlight the text fragment in the document.
// browser support: /foo.mp4#t=10,20: The video or audio will start playing from the 10th second.
// / -> Load default template to content container.
// /# -> Load default template to content container.
// /#:urlPath -> Load urlPath template to content container.
// /#!urlPath -> Load iframe urlPath page to content container.
// event: 'key' -> { key, value, fragment } -> The key is the name of the event, value is the value of the key, and fragment is the full URL fragment.
// event: '-' -> { key, value, fragment } -> The key is the name of the event, value is the value of the key, and fragment is the full URL fragment.
// event: 'hrefActive' -> { href } -> The href is the name of the event, and href is the full URL fragment.
(function () {

    exportModule('url-fragment-extender', [], function factory() {

        var globalScope = this,
            isDebug = document && Array.from(document.scripts).find(function (s) { return s.src.includes('url-fragment-extender'); }).attributes.debug || false;

        globalScope.UFE = Object.create(null, {

            DB: { get: getDB, configurable: false, enumerable: false },

            indexContentURL: { value: 'templates/landing.html', writable: true, configurable: false, enumerable: false },

            mainContainerSelector: { value: '#main-container', writable: true, configurable: false, enumerable: false },

            navigationLinksContainerSelector: { value: '#navigation-links-container', writable: true, configurable: false, enumerable: false },

            alertMessageSelector: { value: '#alert-message-container', writable: true, configurable: false, enumerable: false },

            renderIndexContent: { value: function () { handleFragment(UFE.indexContentURL); }, writable: false, configurable: false, enumerable: false },

            handleFragment: { value: handleFragment, writable: false, configurable: false, enumerable: false },

            renderContent: { value: renderContent, writable: false, configurable: false, enumerable: false },

            renderIframe: { value: renderIframe, writable: false, configurable: false, enumerable: false },

            setMenuItemActive: { value: setMenuItemActive, writable: false, configurable: false, enumerable: false },

            openModal: { value: openModal, writable: false, configurable: false, enumerable: false },

            openModalHTML: { value: openModalHTML, writable: false, configurable: false, enumerable: false },

            modalHide: { value: function () { }, writable: true, configurable: false, enumerable: false },

            showAlert: { value: showAlert, writable: false, configurable: false, enumerable: false },

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

        addEventListener("hashchange", handleHash);
        waitForReadyState("complete", handleFragment);

        return globalScope.UFE;

        function getDB() { return globalScope.modules['data-context-binding'] || null }
        function waitForReadyState(state, cb) {

            if (document.readyState == state)
                setTimeout(cb, 50);
            else
                setTimeout(waitForReadyState, 0, state, cb);
        }
        function handleHash({ newURL, oldURL }) { return handleFragment(); }
        function handleFragment(fragment = location.hash) {

            var frgParts = fragment.slice(1).split(/[&|;]/g);


            if (!frgParts[0] && frgParts.length < 2) { renderContent(UFE.indexContentURL); }
            else if (frgParts[0].startsWith("!")) { renderIframe(frgParts[0].slice(1)); }
            else if (/^:(?![:~!])/.test(frgParts[0])) { renderContent(frgParts[0].slice(1)); }

            setTimeout(function () {

                setMenuItemActive(frgParts[0]);

                frgParts.forEach(function (key_val) {

                    var [key, val] = key_val.split('=');
                    UFE.emit(key, { key, value: val || '', fragment });
                    UFE.emit('-', { key, value: val || '', fragment });
                });
            });

            return fragment;
        }
        function renderContent(contentURL) {

            var containerElement = document.querySelector(UFE.mainContainerSelector),
                content_url = containerElement?.getAttribute('content_url');

            if (containerElement && content_url !== contentURL) {

                var contentContainer = clearElement(containerElement);
                contentContainer.setAttribute('content_url', contentURL);
                contentContainer.setAttribute('template', contentURL);
                getDB()?.bindAllElements(contentContainer);
            }
        }
        function renderIframe(pageURL) {

            var containerElement = document.querySelector(UFE.mainContainerSelector),
                contentid = containerElement?.getAttribute('content_url');

            if (containerElement && contentid !== pageURL) {

                    var contentContainer = clearElement(containerElement);
                    contentContainer.setAttribute('contentid', pageURL);
                    contentContainer.insertAdjacentHTML('beforeend', `<iframe src="${pageURL}"></iframe>`);
                }
        }
        function clearElement(element) {

            if (element) {

                element.removeAttribute('content_url');
                element.removeAttribute('template');
                element.innerHTML = '';
                element.bindingContext?.isActive(false);
            }

            return element;
        }
        function setMenuItemActive(href = '') {

            var containerElement = document.querySelector(UFE.navigationLinksContainerSelector),
                activeLinks = containerElement?.querySelectorAll(".active") || [];

            clearTimeout(setMenuItemActive.timeout);
            setMenuItemActive.counter = 0;
            activeLinks.forEach(function (old) { old.classList.remove('active'); });
            activeLink();


            function activeLink() {

                var deactiveLinks = containerElement?.querySelectorAll('[href="#' + encodeURI(href) + '"]') || [];

                // If the element is not found, wait for 200ms and try again.
                if (!deactiveLinks.length) {

                    setMenuItemActive.counter++;
                    if (setMenuItemActive.counter > 10) { return; }
                    setMenuItemActive.timeout = setTimeout(activeLink, 200);

                    return;
                }

                deactiveLinks.forEach(function (item) { item.classList.add('active'); });

                UFE.emit('hrefActive', { href });
            }
        }
        function openModal(template) {

            fetch(template).then(res => res.text().then(openModalHTML));
        }
        function openModalHTML(strHTML) {

            if (!strHTML) { return; }
            if (!bootstrap.Modal) { return; }

            var div = document.createElement('div');
            document.body.appendChild(div);
            div.innerHTML = strHTML;
            getDB()?.bindAllElements(div);
            var modalElement = div.querySelector('.modal');
            modalElement.addEventListener('hidden.bs.modal', function (event) {
                setTimeout(function () { document.body.removeChild(div); });
            });
            var modal = new bootstrap.Modal(modalElement);
            UFE.modalHide = function () { setTimeout(function (modal) { modal.hide(); }, 0, modal); };
            modal.show();
        }
        /**
         * Bootstrap Alerts
         * Example - showalert("Invalid Login","alert-danger")
         * Types of alerts -- "alert-danger","alert-success","alert-info","alert-warning"
         * @param {string} message
         * @param {string} alerttype "alert-danger" | "alert-success" | "alert-info" | "alert-warning"
         */
        function showAlert(message, alerttype = "alert-success") {

            if (!message || !UFE.alertMessageSelector) { return; }

            var containerElement = document.querySelector(UFE.alertMessageSelector);

            if (!containerElement) {

                pDebug(
                    'Alert container not found. ' +
                    'Please add an element with the ID \'alert-message-container\' to your HTML. ' + 
                    'Example: <div id="alert - message - container" class="position - fixed top - 0 start - 50 translate - middle - x w - 75  mt - 5 mx - 3" style="z - index: 1080"></div> ' +
                    'Or use the \'alertMessageSelector\' property to set a custom selector.'
                );

                return;
            }

            containerElement.insertAdjacentHTML('beforeend', `
<div class="alert ${alerttype} alert-dismissible fade show mb-1" role="alert">
                        <i class="bi ${icon(alerttype)} position-absolute"></i>
                        <div class="w-auto ms-4 text-center"><strong>${message}</strong></div>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
                        `);
            setTimeout(
                function (element) {

                    element.querySelector('.btn-close').click();
                },
                alerttype === "alert-success" ? 3000 : 6000,
                containerElement.lastElementChild
            );


            function icon(alerttype) {

                switch (alerttype) {
                    case "alert-danger": return "bi-exclamation-triangle-fill";
                    case "alert-success": return "bi-check-circle-fill";
                    case "alert-info": return "bi-info-square-fill";
                    case "alert-warning": return "bi-exclamation-square-fill";
                    default: return "bi-info-square-fill";
                }
            }
        }

        // Debugging
        function pDebug(...args) { if (isDebug) { console.log(`[ DEBUG ] `, ...args); } }
        function pError(...args) { if (isDebug) { console.error(`[ ERROR ] `, ...args); } }
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