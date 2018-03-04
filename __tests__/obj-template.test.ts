import * as path from 'path'
import {
  transformTree,
  objTemplate
} from '../src'

import {
  runSandboxedCodeAt
} from 'run-sandboxed'

const filePath = path.join(__dirname, 'sandboxed.sjs')
const ctx = runSandboxedCodeAt(filePath)

const params = {
  author: 'Kristian',
  username: 'kmandrup',
  name: 'my-project'
}

const opts = {
  type: 'json',
  override: true,
}

const key = 'template'
const configOverride = {
  opts,
  params
}

const config = {
  params
}

describe('objTemplate', () => {
  describe('use template options', () => {
    it('runs treeDef on sandboxed code', () => {
      const result = objTemplate(filePath, config)
      expect(typeof result).toBe('string') // is js string
      expect(result).toMatch(/exports/)
    })
  })
  describe('override of template options with type: JSON', () => {

    it('applies override to return JSON', () => {
      const result = objTemplate(filePath, configOverride)
      expect(typeof result).toBe('string') // is JSON

      const obj = JSON.parse(result) // when JSON parsed author is Kristian
      expect(obj.author).toBe('Kristian')
    })
  })
})

describe('transformTree', () => {
  it('transforms treeDef to an object', () => {
    const result = transformTree(ctx[key], config)
    expect(result).toMatch(/exports/)
  })

  it('transforms treeDef to an object', () => {
    const result = transformTree(ctx[key], config)
    expect(result).toMatch(/exports/)
  })

})
