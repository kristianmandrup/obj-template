result = {
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
      return author
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
