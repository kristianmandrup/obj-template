# Object Template

[![Greenkeeper badge](https://badges.greenkeeper.io/kristianmandrup/obj-template.svg)](https://greenkeeper.io/)

*Object Template* is a new type of template/transformer specifically designed to create nested structures such as `js`, `JSON` or `YAML` objects without the unnatural fit of traditional text based templates.

## Usage

Here is how it looks in action for generating part of a `package.json` file.

```js
ctx.treeDef = {
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
      return _.humanize(author)
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

This is pure JavaScript code, which is executed in a [vm2 sandbox](https://www.npmjs.com/package/vm2).

[powerdash](https://www.npmjs.com/package/powerdash) functions are made available via `_` so you have all the power of [lodash](https://www.npmjs.com/package/lodash), [string.js](https://www.npmjs.com/package/string) and [underscore.string](https://www.npmjs.com/package/underscore.string) that act as extensions to the *lodash* API.

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

### API

```js
const {
  transformTree,
  sandboxed
} = require('..')

const filePath = path.join(__dirname, 'sandboxed.sjs')
const ctx = runSandboxedCodeAt(filePath)

const params = {
  author: 'Kristian',
  username: 'kmandrup',
  name: 'my-project'
}

const result = transformTree(ctx.treeDef, params)

console.log('transformation', {
  result
})
```

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

const result = transformTree(ctx.treeDef, params, {
  mode: 'split',
  override: true,
  indent: 4
})
```
