**What is it, in summary?**

It's a little DSL for mapping the DOM to Javascript variables.

**Dependencies**

jQuery (`$` needs to be available as a global/window property)

**How is it installed?**

Easiest way is to `npm install --save static_dom` after initializing a
`package.json` for the project.

However the source is only three functions and < 40 lines so it can easily
be taken straight from Github:

- `static_dom_COFFEE.coffee` is the source;
- `static_dom_NODE.js` is for plain JS requiring
- `static_dom_BROWSER.js` is for use in the browser with no compiler.

**What does the API look like** 

There is only one required function to call, with one input and one output.

The input is a hash which maps the elements on the DOM:

```js
tree = {
  body: {
    selector: "body",
    children: {
      navbar: { selector: "#navbar" },
      main_content: { selector: "#main-content }
    }
  }
}
```

This is structured like so:

```txt
tree = <generated function name>: {
  selector: <css selector>,
  children: <another tree, optional>
}
```

Here's how this would be used:

```js
var StaticDom = require("static_dom");
tree = { ... }; // shown above
dsl = StaticDom.build_dom_methods(tree)
```

Now the `dsl` has functions `navbar`, `body`, and `main_content`.

The generated functions have the DOM lookup scoped to the parent and are
cached by default.

This generated function can be configured in one of two ways:

1. passing a `false` argument when it's invoked, to disable cache
2. by overwriting it completely

What follows is the default function, which can be overwritten by reassigning
`StaticDom.build_fn` (this source code is in coffeescript, by the way,
but the version pushed to NPM is plain JS). It's a higher-level function
(a function that returns a function). The returned function is the one added to
the DSL.

The arguments are:

- _memo_ (object), where the function should be added to, also a way to call
previously added functions
- _name_ (string) name of the function to be added
- _selector_ (string) css selector
- _parent_ (string) function name of the parent (will already be a function)

```coffee
  @build_fn = (memo, name, selector, parent) =>
    (allow_cache = true) =>
      get_val = =>
        val = if parent then memo[parent]().find(selector) else $(selector)
        @missing_dom_element(selector) if val.length < 1    
        val
      if allow_cache then (memo["_#{name}"] ||= get_val()) else get_val()
```

The other configurable method is only invoked from the default `build_fn`:
it's `missing_dom_element(selector)` which, in it's default state, just prints
a warning message to the console when the length of a jQuery result is 0.
This can be helpful in development, but can be easily disabled using
`StaticDom.missing_dom_element = function(){}`

To give an example of all this, here's how the generated function could be 
customized to not cache or precaution against empty result sets; this would make
it more suitable for dynamic content:

```js
StaticDom.build_fn = function(memo, name, selector, parent) {
  return function() {
    if (parent){
      return $(selector)
    } else {
      return memo[parent]().find(selector)
    }
  }
}
```