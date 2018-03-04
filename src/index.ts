import * as YAML from 'json2yaml'
import * as stringifyObject from 'stringify-object'
import * as deepmerge from 'deepmerge'

function merge(base: Object, ext: Object) {
  return Object.assign(base, ext || {})
}

import {
  runSandboxedCodeAt
} from 'run-sandboxed'

export function objTemplate(filePath: string, options: any = {}) {
  let {
    key
  } = options
  key = key || 'template'
  const ctx = runSandboxedCodeAt(filePath, options)
  return transformTree(ctx[key], options.params, options.opts)
}

export function transformTree(treeDef: any, params: any = {}, opts: any = {}) {
  const {
    base,
    parts,
    mode,
    transform
  } = treeDef
  const override = treeDef.override || opts.override

  const options: any = override ? merge(treeDef.opts, opts) : merge(opts, treeDef.opts)
  const keys = Object.keys(parts)
  const result = keys.reduce((acc, key) => {
    const partFun = parts[key]
    const $params = mode === 'split' ? params[key] || params : params
    const part = partFun($params)

    if (key === '$root$') {
      acc = deepmerge(acc, part)
    } else {
      acc[key] = part
    }
    return acc
  }, base)

  const type = options.type || 'json'

  switch (type) {
    case 'obj':
      return result
    case 'json':
      return JSON.stringify(result, null, options.indent || 2)
    case 'yaml':
    case 'yml':
      return YAML.stringify(result)
    case 'js':
      const prettyObj = stringifyObject(result, {
        indent: '  '
      })
      return `module.exports = ${prettyObj}`
    case 'default':
      const customTransform = transform[type]
      if (typeof customTransform !== 'function') {
        throw new Error(`Missing result transformation function for type: ${type}`)
      }
      return customTransform(result, options)
  }
}

