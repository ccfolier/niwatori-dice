const { NiwatoriDice } = require('../src/index')
const roll = new NiwatoriDice()

const TEST_SEED = 1538254770938

test('1+2', () => {
  expect(roll('1+2', {}, TEST_SEED).result).toBe(3)
})

test('1+2*4', () => {
  expect(roll('1+2*4', {}, TEST_SEED).result).toBe(9)
})

test('(1+2)*4', () => {
  expect(roll('(1+2)*4', {}, TEST_SEED).result).toBe(12)
})

test('1d100', () => {
  expect(roll('1d100', {}, TEST_SEED).result).toBe(60)
})

test('3d3', () => {
  const dice = roll('3d3', {}, TEST_SEED)
  expect(dice.verbose[0].result).toBe(2)
  expect(dice.verbose[1].result).toBe(1)
  expect(dice.verbose[2].result).toBe(1)
})

test('1d100<={DEX}*5', () => {
  const dice = roll('1d100<={DEX}*5', {
    DEX: 10
  }, TEST_SEED)
  expect(dice.result).toBe(false)
  expect(dice.verbose[0].result).toBe(60)
})

test('1d100<={dex}*5', () => {
  const dice = roll('1d100<={dex}*5', {
    DEX: 10
  }, TEST_SEED)
  expect(dice.result).toBe(false)
  expect(dice.verbose[0].result).toBe(60)
})

test('ccb<=60', () => {
  const dice = roll('ccb<=60', {}, TEST_SEED)
  expect(dice.result).toBe(true)
  expect(dice.verbose[0].result).toBe(60)
})

test('ccb<=50 TEXT', () => {
  const dice = roll('ccb<=50 TEXT', {}, TEST_SEED)

  expect(dice.result).toBe(false)
  expect(dice.verbose[0].result).toBe(60)
})

test('TEXT ccb<=50', () => {
  const dice = roll('TEXT ccb<=50', {}, TEST_SEED)
  expect(dice.result).toBe(undefined)
  expect(dice.verbose[0]).toBe(undefined)
})

test('ＣＣＢ＜＝６０', () => {
  const dice = roll('ＣＣＢ＜＝６０', {}, TEST_SEED)
  expect(dice.result).toBe(true)
  expect(dice.verbose[0].result).toBe(60)
})

test('choice("a", "b", "c")', () => {
  const dice = roll('choice("a", "b", "c")', {}, TEST_SEED)
  expect(dice.result).toBe("\"b\"")
})

test("choice('1', '2', '3')", () => {
  const dice = roll("choice('1', '2', '3')", {}, TEST_SEED)
  expect(dice.result).toBe('\'2\'')
})

test("choice '1' '2' '3'", () => {
  const dice = roll("choice '1' '2' '3'", {}, TEST_SEED)
  expect(dice.result).toBe('\'2\'')
})

test('1d100 X 1d100 X 1d100', () => {
  const dice = roll("1d100 X 1d100 X 1d100", {}, TEST_SEED)
  expect(dice.result).toBe(60)
})
