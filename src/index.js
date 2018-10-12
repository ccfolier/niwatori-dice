const CRC32 = require('crc-32')

function createFomulaRegExpString(operators) {
  const commons = ['\\(', '\\)', ',', '".+?"', "'.+?'", '\\d+']
  const keys = Object.keys(operators).map((key) => {
    return key.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  })
  return `(${[...keys, ...commons].join('\\s*|') + '\\s*'})`
}

function format(input, data) {
  if (!input) return ''
  const regex = /[Ａ-Ｚａ-ｚ０-９（）＊＋，－．／＜＝＞｛｝]/g
  let output = input.trim()
  output = output.replace(regex, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  })
  Object.keys(data).forEach((key) => {
    output = output.split(`{${key.toLowerCase()}}`).join(data[key])
    output = output.split(`{${key.toUpperCase()}}`).join(data[key])
  })
  return output.toLowerCase()
}

function tokenize(input, operators) {
  const fomula = createFomulaRegExpString(operators)
  const picker = new RegExp(`^${fomula}+(\\s|$)`, 'g')
  const separator = new RegExp(fomula, 'g')
  const matches = input.match(picker)
  if (matches) {
    return matches[0].match(separator).map((token) => {
      return token.trim()
    })
  } else {
    return []
  }
}

function parse(tokens, operators) {
  const stack = []
  const res = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const lastStack = stack[stack.length - 1]
    if (token === '(') {
      stack.push(token)
    }
    else if (token === ')') {
      const i = stack.indexOf('(')
      while (i > -1 && stack.length > i) {
        const t = stack.pop()
        if (t !== '(') {
          res.push(t)
        }
      }
    }
    else if (token === ',') {
      // nothing todo
    }
    else if (operators[token]) {
      if (lastStack && operators[lastStack]) {
        let a = operators[lastStack].priority
        let b = operators[token].priority
        if (a >= b) {
          while (stack.length > 0) {
            const t = stack.pop()
            if (!operators[t]) {
              stack.push(t)
              break
            }
            res.push(t)
          }
        }
      }
      stack.push(token)
    }
    else {
      res.push(token)
    }
  }
  while (stack.length > 0) {
    res.push(stack.pop())
  }
  return res
}

function* crc32gen(seed) {
  let val = Math.abs(CRC32.str(String(seed)))
  while (true) {
    val = Math.abs(CRC32.str(String(val)))
    yield val
  }
}
function calculate(tokens, operators, seed) {
  const stack = []
  const verbose = []
  const rand = crc32gen(seed)
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (operators[token]) {
      const argsLen = operators[token].argsLen || 2
      try {
        let output = operators[token].fn.apply({ rand, verbose }, stack.splice(argsLen * -1))
        stack.push(output)
      } catch (err) {
        console.error(err)
      }
    } else if (/^[0-9]+$/.test(token)) {
      stack.push(parseInt(token, 10))
    } else {
      stack.push(token)
    }
  }
  return { result: stack[0], verbose };
}

function createVerbose(typeName, formula, result, text = '') {
  return {
    type: typeName,
    formula,
    result,
    text
  }
}
exports.createVerbose = createVerbose

function PureDice(operators) {
  return function(input, vars = {}, seed = Date.now()) {
    return calculate(
      parse(
        tokenize(
          format(
            input, vars
          ), operators
        ), operators
      ), operators, seed
    )
  }
}
exports.PureDice = PureDice

const basicOperators = require('./plugins/basic')
function BasicDice(customOperators) {
  const operators = Object.assign(basicOperators, customOperators)
  return PureDice(operators)
}
exports.BasicDice = BasicDice

const allOperators = require('./plugins')
function NiwatoriDice(customOperators) {
  const operators = Object.assign(allOperators, customOperators)
  return PureDice(operators)
}
exports.NiwatoriDice = NiwatoriDice
