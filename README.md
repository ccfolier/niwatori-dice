# niwatori-dice
The javascript dice engine used in https://rc.folia.me.
If English of the document is wrong, please correct it if you ok.

## Motivation
Why does not use BCDice or other one? You will have doubts.

- BCDice is a bit slow. because it written in ruby.
- Many libraries use built-in random functions. It is difficult to test.
- Client applications can easily impersonate dice number. We need a means to verify.

niwatori-dice will have the same results as long as the given seed is the same.
If you use timestamp for seed, you can verify that it is a spoofed dice by verifying with other clients using the same timestamp.

## Usage
```bash
$ npm install niwatori-dice
```
```js
// import { NiwatoriDice } from 'niwatori-dice'
const { NiwatoriDice } = require('niwatori-dice')
const roll = NiwatoriDice()

roll('1d100') // => { result: 60, verbose: [{ type: 'dice', formula: '1d100', reesult: 60, text:'' }] }
```

### NiwatoriDice(oparators)
You can expand grammar freely by the oparators.
Input is converted to inverse Polish notation once and processed.
The meaning is that you can implement operators such as `add` and` sum` yourself.

eg.
```js
const roll = NiwatoriDice({
  'add': {
    priority: 10,
    argsLen: 2,
    fn(a, b) {
      return a + b
    }
  }
})

roll('1 add 2') // => { result: 3, verbose: [] }
```

##### oparators[].priority (require)
The one with the larger value takes precedence

##### oparators[].fn (require)
It receives and executes stack as much as specified by argsLen.
When fn runs it has references to `rand` and` verbose` through this.

eg.
```js
const { createVerbose } = require('niwatori-dice')
// createVerbose(type, formula, result, extendText)
...

const roll = NiwatoriDice({
  'fortune': {
    priority: -1,
    argsLen: 0,
    fn() {
      const { rand, verbose } = this
      const stars = rand.next().value % 5 + 1
      verbose.push(createVerbose('original', 'fortune', stars, `You are ${stars} stars.`))
      return stars
    }
  }
})

roll('fortune')
// => { result: 5, verbose: [{ type: 'original', formula: 'fortune', result: 5, text: 'You are 5 stars.' }] }
```

##### oparators[].argLen (default: 2)
The number of arguments.

eg.
```js
const roll = NiwatoriDice({
  'concat': {
    priority: 10,
    argsLen: 5,
    fn(a, b, c, d, e) {
      return a + b + c + d + e
    }
  }
})

roll('concat 1 1 1 1 1') // => 5
roll('concat(1,1,1,1,1)') // => 5
```

## Contribute
Everyone's power is necessary to deal with various TRPG rules!
You can create the new oparators to `./src/plugins`.

## Test
```js
$ npm run test
```

## License
MIT

