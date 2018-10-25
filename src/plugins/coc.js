const { createVerbose } = require('../index')

module.exports = {
  'cc<=': {
    priority: -1,
    fn(a) {
      const { rand, verbose } = this;
      const res = rand.next().value % 100 + 1
      let texts = []
      let result = ( res <= a )
      if (res == 1) {
        result = true
      }
      if (res == 100) {
        result = false
      }
      if (res <= a * 0.2) {
        texts.push('Special!')
      }
      verbose.push(createVerbose(
        'dice',
        `ccb<=${a}`,
        res,
        texts.join(',')
      ))
      return result
    }
  },
  'ccb<=': {
    priority: -1,
    fn(a) {
      const { rand, verbose } = this;
      const res = rand.next().value % 100 + 1
      let texts = []
      let result = ( res <= a )
      if (res == 1) {
        result = true
      }
      if (res == 100) {
        result = false
      }
      if (res <= a * 0.2) {
        texts.push('Special!')
      }
      if (res <= 5) {
        texts.push('Critical!!')
        result = true
      }
      if (res >= 96) {
        texts.push('Fumble!!')
        result = false
      }
      verbose.push(createVerbose(
        'dice',
        `ccb<=${a}`,
        res,
        texts.join(',')
      ))
      return result
    }
  },
  'res': {
    priority: -1,
    fn(_a) {
      const { rand, verbose } = this;
      const a =  50 + _a * 5
      const b = rand.next().value % 100 + 1
      verbose.push(createVerbose(
        'evaluation',
        `res(${_a})`,
        a >= b,
        `${a}%`
      ))
      return a >= b
    }
  }
}
