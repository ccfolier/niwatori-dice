const { createVerbose } = require('../index')

module.exports = {
  'choice': {
    priority: -1,
    argsLen: 30, // max length
    fn(...args) {
      const { rand } = this
      const len = args.length
      const index = rand.next().value % len
      return args[index]
    }
  }
}