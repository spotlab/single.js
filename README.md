single.js
=======

single.js is a user-friendly replacement for select boxes with single attribute inspired by multi.js. We have keeped the design of multi.js.

Check out the [multi.js demo](http://fabianlindfors.se/multijs/).

Installation
-----

Via Yarn

```nodejs
yarn add spotlab/single.js
```

Or clone or download the repository to your project and include both files in the min directory.

```html
<link rel="stylesheet" type="text/css" href="singlejs/min/single.min.css">
<script src="singlejs/min/single.min.js"></script>
```

Usage
-----
single.js can be applied to any select element with the singleple attribute enabled.

```javascript
var select_element = document.getElementById( 'your_select_element' );
single( select_element );
```


To customize single a few options can be passed with the function call. Below are all the default values.

```javascript
single( select_element, {
    'enable_search': true,
    'search_placeholder': 'Search...',
});
```


single.js is fully native Javascript but also has jQuery support. If you have jQuery included single can be applied to a select element as follows:

```javascript
$( '#your_select_element' ).single();
```

License
-----
single.js is licensed under [MIT](https://github.com/spotlab/single.js/blob/master/LICENSE).
