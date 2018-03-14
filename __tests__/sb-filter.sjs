ctx.template = {
  opts: {
    type: 'js',
    indent: 4
  },
  base: {
    // baseline object
  },
  parts: {
    author({
      author
    }) {
      return author === 'unknown' ? undefined: { name: author }
    },
    repo({
      username,
      name
    }) {
      return {
        url: `github:${username}/${name}.git`
      }
    }
  }
}
