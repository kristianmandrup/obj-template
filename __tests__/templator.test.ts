import * as path from 'path'
import {
  objTemplate
} from '../src'

const filePath = path.join(__dirname, 'sb-filter.sjs')

const opts = {
  json: {
    type: 'json',
    override: true,
  },
  js: {
    type: 'js',
    override: true,
  },
  yaml: {
    type: 'yaml',
    override: true,
  }
}

function create(params: any) {
  const js = {
    params,
    opts: opts.js
  }
  const json = {
    params,
    opts: opts.json
  }
  const yaml = {
    params,
    opts: opts.yaml
  }


  return {
    json,
    js,
    yaml
  }
}

function toObj(str: string) {
  return JSON.parse(str)
}

function allKeys(obj: any) {
  return Object.keys(obj)
}

function createHasKey(keys: string[]) {
  return function hasKey(name: string) {
    keys.includes('author')
  }
}

describe('objTemplate', () => {
  describe('author part returns undefined', () => {
    const author = 'unknown'
    const username = 'kmandrup'
    const name = 'my-project'

    const params = {
      author,
      username,
      name
    }

    it('filters out author section in result', () => {
      const result = objTemplate(filePath, create(params).json)
      expect(typeof result).toBe('string') // is js string
      const keys = allKeys(toObj(result))
      const hasKey = createHasKey(keys)
      expect(hasKey('author')).toBeFalsy()
    })
  })
})
