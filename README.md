
<div class="row w-100">
<div class="col-lg-3 d-lg-inline">
<div class="sticky-top overflow-auto vh-lg-100">
<div id="list-headers" class="list-group mt-2 ms-lg-2 ms-4">

#### Table of contents
- [**URL Fragment Extender**](#url-fragment-extender)
- [**Description**](#description)
- [**Installation**](#installation)
- [**Usage**](#usage)
- [**License**](#license)
  
</div>
</div>
</div>
 
<div class="col-lg-9 mt-2">
<div class="ps-4 markdown-body" data-bs-spy="scroll" data-bs-target="#list-headers" data-bs-offset="0" tabindex="0">

# URL Fragment Extender
This allows for easy manipulation and extension of URL fragments, as well as handling custom events based on the URL hash.<br>
This manual is also available in [HTML5](https://manuel-lohmus.github.io/url-fragment-extender/README.html).

## Description
The module `url-fragment-extender` that provides functionality to read and manipulate URL fragments. 
It includes an event emitter to handle custom events and listens for changes in the URL hash.

## Installation

You can install `url-fragment-extender` using this command:

`npm install url-fragment-extender`

### browser:
`<script src="https://cdn.jsdelivr.net/npm/url-fragment-extender" ></script>`

### using tiny-https-server router:
or use ['tiny-https-server'](https://www.npmjs.com/package/tiny-https-server) router:
`<script async src="node_modules/url-fragment-extender@2"></script>`

## Usage 

Here is also a [DEMO](https://manuel-lohmus.github.io/url-fragment-extender/index.html)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>url-fragment-extender</title>
    <!-- STEP 1. Import the modules 'url-fragment-extender'.
        Import for an HTML page hosted on the server. -->
    <script async type="text/javascript" src="./browser.js"></script>
    <!-- STEP 1. Import the modules 'url-fragment-extender'.
        Import for a standalone HTML page. -->
    <!--<script async src="https://cdn.jsdelivr.net/npm/url-fragment-extender"></script>-->
    <script>

        // STEP 3. Import the module.
        importModules(['url-fragment-extender'], function (UFE) {

            UFE.on('', function (event) {
                $('#content').innerHTML = '';
                //I am live. Continue listening.
                return true;
            });

            UFE.on('temp_1', function (event) {
                $('#content').innerHTML = $('#temp_1').innerHTML;
                //I am live. Continue listening.
                return true;
            });

            UFE.on('temp_2', function (event) {
                $('#content').innerHTML = $('#temp_2').innerHTML;
                //I am live. Continue listening.
                return true;
            });

            UFE.on('temp_3', function (event) {
                $('#content').innerHTML = $('#temp_3').innerHTML;
                //I am live. Continue listening.
                return true;
            });
        });


        // STEP 2. Add module import function.
        /**
         * Module import function - step 2.
         * @param {string[]} importIdentifierArray Modules to import.
         * @param {(...importModules:any[]) => void} callback Callback function.
         */
        function importModules(importIdentifierArray, cb) {

            var thisScope = "undefined" != typeof globalThis
                ? globalThis
                : "undefined" != typeof window
                    ? window
                    : "undefined" != typeof global
                        ? global : "undefined" != typeof self
                            ? self
                            : {};

            if (!thisScope.modules) { thisScope.modules = {}; }

            waitModules();


            function waitModules() {

                if (importIdentifierArray.length) {

                    for (let i = 0; i < importIdentifierArray.length; i++) {

                        if (!thisScope.modules[importIdentifierArray[i]]) { return setTimeout(waitModules, 10); }
                    }
                }

                cb.call(thisScope, ...importIdentifierArray.map(function (id) { return thisScope.modules[id]; }));
            }
        }
        function $(selector, element) { return (element || document).querySelector(selector); }
    </script>
    <style>
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
            margin: 5px;
        }

            .button:hover {
                background-color: #0056b3;
            }
    </style>
</head>
<body>

    <div>
        <a class="button" href="#temp_1">template 1</a>
        <a class="button" href="#temp_2">template 2</a>
        <a class="button" href="#temp_3">template 3</a>
    </div>
    <br />
    <div id="content"></div>

    <template id="temp_1">
        <div style="background-color:darkgreen;color:whitesmoke"><h1>template 1</h1></div>
    </template>
    <template id="temp_2">
        <div style="background-color:burlywood;color:darkslateblue"><h2>template 2</h2></div>
    </template>
    <template id="temp_3">
        <div><h3>template 3</h3></div>
    </template>

</body>
</html>
```

## License

This project is licensed under the MIT License.

Copyright &copy; Manuel Lõhmus

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/donate?hosted_button_id=SA5RPUB5GKBB2)

Donations are welcome and will go towards further development of this project.

<br>
<br>
<br>
</div>
</div>
</div>