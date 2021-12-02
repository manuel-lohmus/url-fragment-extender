# url-fragment-extender: Url fragment extender library for browser.

[![npm-version](https://badgen.net/npm/v/url-fragment-extender)](https://www.npmjs.com/package/url-fragment-extender)
[![npm-week-downloads](https://badgen.net/npm/dw/url-fragment-extender)](https://www.npmjs.com/package/url-fragment-extender)

Url fragment extender library for browser.

## Installing

`<script src="https://unpkg.com/url-fragment-extender" ></script>`

or

`<script src="https://cdn.jsdelivr.net/npm/url-fragment-extender" ></script>`

## Usage example

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title>Test</title>
    <script src="https://unpkg.com/url-fragment-extender" ></script>
    <script>
        addEventListener("load", function (ev) {
            // add your code here
            UFE.Commands.set_body = function (val) { document.body.innerHTML = val; };
        });
    </script>
</head>
<body>
    Test
</body>
</html>
```


Navigate to the URL: 
`'https://example.com/#set_body=body_content'` or 
`'https://example.com/#print'`

## License

[MIT](LICENSE)

Copyright (c) 2021 Manuel L&otilde;hmus <manuel@hauss.ee>


