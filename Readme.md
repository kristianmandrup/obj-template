# Object Templator

*Object Templator* is a new type of template engine specifically designed to create nested structures such as `js`, `JSON`, `YAML` or `XML` data structures without the unnatural fit of traditional text based templates.

Uses sandboxed `js` via [run-sandboxed](https://www.npmjs.com/package/run-sandboxed)

## Usage

Here is how it looks in action for generating part of a `package.json` file.

```js
// sandboxed.sjs
ctx.template = {
  opts: {
    type: 'js',
    indent: 4
  },
  base: {
    // baseline object (static)
    private: true,
    license: 'MIT'
  },
  parts: {
    // root level of object
    $root$({name}) {
      return {
        name
      }
    },
    // dynamic entries of object...
    author({
      author
    }) {
      return return author === 'unknown' ? undefined : { name: _.humanize(author) }
    },
    repo({
      username,
      name
    }) {
      return {
        url: `github:${_.lowercase(username)}/${name}.git`
      }
    }
  }
}
```

## Filtering out parts

You can have a part return `null` or `undefined` in order to completely filter out that part.
In the example above, in the `author` part, we return `undefined` if author is `unknown` in order to filter out that part entirely in that particular case.

You can pass an options `keepAllParts: true` to override this filtering behavior, to keep the output of all parts no matter what. We don't (yet) support partial filtering of parts. Either you opt to filter them out (default) or not.

### API

```js
const {
  objTemplate
} = require('object-templator')

const filePath = path.join(__dirname, 'sandboxed.sjs')

const params = {
  author: 'Kristian',
  username: 'kmandrup',
  name: 'my-project'
}

return objTemplate(filePath, params, {
  override: true,
  type: 'json'
})
```

`sandboxed.sjs` is run securely as javascript in a [vm2 sandbox](https://www.npmjs.com/package/vm2).

[powerdash](https://www.npmjs.com/package/powerdash) functions are made available via `_` so you have all the power of [lodash](https://www.npmjs.com/package/lodash), [string.js](https://www.npmjs.com/package/string) and [underscore.string](https://www.npmjs.com/package/underscore.string) that act as extensions to the *lodash* API.

Sending the params:

```js
{
  name: 'power-lib',
  author: 'kristian mandrup',
  username: 'Kmandrup'
}
```

Will produce the following

### js result

```js
module.exports = {
  name: 'power-lib',
  private: true,
  license: 'MIT',
  author: 'Kristian Mandrup',
  repo: {
    url: 'github:kmandrup/power-lib.git'
  }
}
```

### JSON result

```js
{
  "name": "power-lib",
  "private": true,
  "license": "MIT",
  "author": "Kristian Mandrup",
  "repo": {
    "url": "github:kmandrup/power-lib.git"
  }
}
```

### YAML result

```js
---
name: power-lib
private: true
license: MIT
author: Kristian Mandrup
repo:
  url: github:kmandrup/power-lib.git
```

## Options

You can use the `mode` option to split params by parts of the template, so that you can send specific params to specific parts of the object.

Use `override` to have your opts override those of the object template defintion, such as the `indent` to use on the JSON result (so as to fit your particular code formating conventions).

```js
const params = {
  $root$: {
    name: 'kristian mandrup'
  }
  author: {
    name: 'kristian mandrup',
    email: 'kmandrup@gmail.com'
  },
  repo: {
    username: 'kmandrup'
  }
}

// map of custom transformation functions by type
const transform = {
  xml(obj) {
    return objToXml(obj)
  }
}

const result = transformTree(ctx.treeDef, params, {
  mode: 'split',
  override: true,
  transform, // pass map of custom transformation functions
  indent: 4
})
```

## Advanced options

### key

Set the `key` used to place the result in the `ctx` object. The default key is `template`

### transform

Pass a custom map of transformation functions.

```js
const transform = {
  xml(obj) {
    return objToXml(obj)
  }
}

transformTree(ctx.template, params, {
  transform
})
```

### transformObj(obj, type, options)

Pass a custom `transformObj` function to transform the result object.
Note that the `defaults` option contains the default `transformObj` function, which can be used as a fallback.

```js
function transformObj(obj, type, options) {
  switch (type) {
    case 'swagger':
      // ...
      return toSwagger(obj)
    // more special cases ...

    default:
      return options.defaults.transformObj(obj, type, options)
  }
}
```

## transformTree

In some cases you might want to use the `transformTree` function directly, without going through loading the `treeDef` from a js VM sandbox.

```js
import {
  transformTree
} from 'object-templator'

transformTree(treeDef, params, opts)
```

## Alternatives

Some alternatives you could consider for simple object templating. These engines could be combined with [run-sandboxed](https://www.npmjs.com/package/run-sandboxed) and then transformed to the final result.

- [selecttransform](https://www.npmjs.com/package/stjs)
- [template-obj](https://www.npmjs.com/package/template-obj)
- [obj-template](https://www.npmjs.com/package/obj-template)

### select transform

See [selecttransform](https://selecttransform.github.io/site/)

```js
cons sel = ST.select(data, function(key, val){
      return key === 'sites';
    })
    .transformWith({
      "items": {
        "{{#each sites}}": {
          "tag": "<a href='{{url}}'>{{name}}</a>"
        }
      }
    })
```

### template obj

```js
var templateObj = require("template-obj");
return templateObj({
  key1: "value1",
  key2: "${key1} value2"
});
```

### obj template

```js
var objTemplate = require('obj-template');
var config = {
  baseURL: 'http://www.example.com',
  urls: [
    "<%= baseURL %>/homepage",
    "<%= baseURL %>/menu",
    "<%= baseURL %>/contacts"
  ]
};

return objTemplate(config);
```

- [template-object](https://github.com/leftclickben/template-object)

Runs underscore's `_.template` over an object structure

## License

MIT
