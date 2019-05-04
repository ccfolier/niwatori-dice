const { createVerbose } = require('../index')

module.exports = {
  '-': {
    priority: 0,
    fn(a, b) {
      if (isNaN(a) || isNaN(b)) return null
      return a - b
    }
  },
  '+': {
    priority: 0,
    fn(a, b) {
      if (isNaN(a) || isNaN(b)) return null
      return a + b
    }
  },
  '/': {
    priority: 10,
    fn(a, b) {
      if (isNaN(a) || isNaN(b)) return null
      return a / b
    }
  },
  '*': {
    priority: 10,
    fn(a, b) {
      if (isNaN(a) || isNaN(b)) return null
      return a * b
    }
  },
  'd': {
    priority: 100,
    fn(a, b) {
      if (isNaN(a) || isNaN(b)) return null
      const { rand, verbose } = this;
      const res = []
      let i = 0
      while (i++ < a) {
        res.push(rand.next().value % b + 1)
      }
      res.forEach((r, i) => verbose.push(createVerbose(
        `dice ${b}`,
        `${a}d${b}` + (res.length > 1 ? `#${i+1}` : ''),
        r
      )))
      const val = res.reduce((current, num) => {
        return current + num
      }, 0)
      return val
    }
  },
  '<=': {
    priority: -1,
    fn(a, b) {
      if (isNaN(a) || isNaN(b)) return null
      return a <= b
    }
  },
  '>=': {
    priority: -1,
    fn(a, b) {
      if (isNaN(a) || isNaN(b)) return null
      return a >= b
    }
  }
}