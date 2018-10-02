const { NiwatoriDice } = require('../src/index')
const roll = new NiwatoriDice()

const TEST_SEED_1D100_60 = 1538254770938
const TEST_SEED_1D100_1 = 1538480153094

// let i = 0;
// let now = Date.now();
// while(i < 10000) {
//   const r = roll('1d100', {}, now+i)
//   if (r.result === 1) {
//     console.log(now+i);
//     break
//   }
//   i++
// }

test('1+2', () => {
  expect(roll('1+2', {}, TEST_SEED_1D100_60).result).toBe(3)
})

test('1+2*4', () => {
  expect(roll('1+2*4', {}, TEST_SEED_1D100_60).result).toBe(9)
})

test('(1+2)*4', () => {
  expect(roll('(1+2)*4', {}, TEST_SEED_1D100_60).result).toBe(12)
})

test('1d100', () => {
  expect(roll('1d100', {}, TEST_SEED_1D100_60).result).toBe(60)
})

test('3d3', () => {
  const dice = roll('3d3', {}, TEST_SEED_1D100_60)
  expect(dice.verbose[0].result).toBe(2)
  expect(dice.verbose[1].result).toBe(1)
  expect(dice.verbose[2].result).toBe(1)
})

test('1d100<={DEX}*5', () => {
  const dice = roll('1d100<={DEX}*5', {
    DEX: 10
  }, TEST_SEED_1D100_60)
  expect(dice.result).toBe(false)
  expect(dice.verbose[0].result).toBe(60)
})

test('1d100<={dex}*5', () => {
  const dice = roll('1d100<={dex}*5', {
    DEX: 10
  }, TEST_SEED_1D100_60)
  expect(dice.result).toBe(false)
  expect(dice.verbose[0].result).toBe(60)
})

test('ccb<=60', () => {
  const dice = roll('ccb<=60', {}, TEST_SEED_1D100_60)
  expect(dice.result).toBe(true)
  expect(dice.verbose[0].result).toBe(60)
})

test('ccb<=50 TEXT', () => {
  const dice = roll('ccb<=50 TEXT', {}, TEST_SEED_1D100_60)
  expect(dice.result).toBe(false)
  expect(dice.verbose[0].result).toBe(60)
})

test('TEXT ccb<=50', () => {
  const dice = roll('TEXT ccb<=50', {}, TEST_SEED_1D100_60)
  expect(dice.result).toBe(undefined)
  expect(dice.verbose[0]).toBe(undefined)
})

test('ＣＣＢ＜＝６０', () => {
  const dice = roll('ＣＣＢ＜＝６０', {}, TEST_SEED_1D100_60)
  expect(dice.result).toBe(true)
  expect(dice.verbose[0].result).toBe(60)
})

test('ccb<=10', () => {
  const dice = roll('ccb<=10', {}, TEST_SEED_1D100_1)
  expect(dice.result).toBe(true)
  expect(dice.verbose[0].result).toBe(1)
  expect(dice.verbose[0].text).toBe('Special!,Critical!!')
})

test('choice("a", "b", "c")', () => {
  const dice = roll('choice("a", "b", "c")', {}, TEST_SEED_1D100_60)
  expect(dice.result).toBe("\"b\"")
})

test("choice('1', '2', '3')", () => {
  const dice = roll("choice('1', '2', '3')", {}, TEST_SEED_1D100_60)
  expect(dice.result).toBe('\'2\'')
})

test("choice '1' '2' '3'", () => {
  const dice = roll("choice '1' '2' '3'", {}, TEST_SEED_1D100_60)
  expect(dice.result).toBe('\'2\'')
})

test('1d100 X 1d100 X 1d100', () => {
  const dice = roll("1d100 X 1d100 X 1d100", {}, TEST_SEED_1D100_60)
  expect(dice.result).toBe(60)
})
