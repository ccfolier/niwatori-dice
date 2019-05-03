const { NiwatoriDice } = require('../../src/index')
const roll = new NiwatoriDice()

const TEST_SEED_1D100_100 = 1538480154085
const TEST_SEED_1D100_96 = 1538480153200
const TEST_SEED_1D100_95 = 1538480153194
const TEST_SEED_1D100_60 = 1538254770938
const TEST_SEED_1D100_15 = 1538480153173
const TEST_SEED_1D100_6 = 1538480153147
const TEST_SEED_1D100_5 = 1538480153101
const TEST_SEED_1D100_1 = 1538480153094

describe('syntax', () => {
  let commands = ['cc', 'ccb', 'ＣＣ', 'ＣＣＢ']
  let dice_eyes = TEST_SEED_1D100_15

  for(var i = 0, j = commands.length; i < j; i++){
    var command = commands[i]

    test(command, () => {
      const dice = roll(command, {}, dice_eyes)
      expect(dice.result).toBeUndefined()
    })

    test(command + '<=1', () => {
      const dice = roll(command + '<=1', {}, dice_eyes)
      expect(dice.result).toBeFalsy()
    })

    test(command + '<=1 TEXT', () => {
      const dice = roll(command + '<=1 TEXT', {}, dice_eyes)
      expect(dice.result).toBeFalsy()
    })

    test(command + '<=1 DEX*5', () => {
      const dice = roll(command + '<=1 DEX*5', {}, dice_eyes)
      expect(dice.result).toBeFalsy()
    })

    test('TEXT ' + command, () => {
      const dice = roll('TEXT ' + command, {}, dice_eyes)
      expect(dice.result).toBeUndefined()
    })

    test(command+'＜＝１', () => {
      const dice = roll(command + '＜＝１', {}, dice_eyes)
      expect(dice.result).toBeFalsy()
    })
  }
})

describe('result thresholds', () => {
  describe('as normal', () => {
    describe('dice_eyes:60', () => {
      let dice_eyes = TEST_SEED_1D100_60

      describe('target:59', () => {
        let target = 59

        test('cc to be failure', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeFalsy()
        })

        test('ccb to be failure', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeFalsy()
        })
      })

      describe('target:60', () => {
        let target = 60

        test('cc to be success', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
        })

        test('ccb to be success', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
        })
      })
    })
  })

  describe('as always failure', () => {
    describe('dice_eyes:1', () => {
      let dice_eyes = TEST_SEED_1D100_1

      describe('target:0', () => {
        let target = 0

        test('cc to be failure', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeFalsy()
        })

        test('ccb to be failure', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeFalsy()
        })
      })
    })

    describe('dice_eyes:100', () => {
      let dice_eyes = TEST_SEED_1D100_100

      describe('target:100', () => {
        let target = 100

        test('cc to be failure', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeFalsy()
        })

        test('ccb to be failure', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeFalsy()
        })
      })
    })
  })

  describe('as special', () => {
    describe('dice_eyes:15', () => {
      let dice_eyes = TEST_SEED_1D100_15

      describe('target:74', () => {
        let target = 74

        test('cc to be success without special', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe("")
        })

        test('ccb to be success without special', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe("")
        })
      })

      describe('target:75', () => {
        let target = 75

        test('cc to be success with special', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe('Special!')
        })

        test('ccb to be success with special', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe('Special!')
        })
      })
    })
  })

  describe('as critical-success', () => {
    describe('dice_eyes:5', () => {
      let dice_eyes = TEST_SEED_1D100_5

      describe('target:4', () => {
        let target = 4

        test('cc to be failure, without critical-success', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeFalsy()
          expect(dice.verbose[0].text).toBe("")
        })

        test('ccb to be failure, without critical-success', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeFalsy()
          expect(dice.verbose[0].text).toBe("")
        })
      })

      describe('target:5', () => {
        let target = 5

        test('cc to be success, without critical-success', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe("")
        })

        test('ccb to be success, with critical-success', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe('Critical!!')
        })
      })

      describe('and special', () => {
        describe('target:24', () => {
          let target = 24

          test('cc to be success, without critical-success', () => {
            const dice = roll('cc<=' + target, {}, dice_eyes)
            expect(dice.result).toBeTruthy()
            expect(dice.verbose[0].text).toBe("")
          })

          test('ccb to be success, with critical-success', () => {
            const dice = roll('ccb<=' + target, {}, dice_eyes)
            expect(dice.result).toBeTruthy()
            expect(dice.verbose[0].text).toBe('Critical!!')
          })
        })

        describe('target:25', () => {
          let target = 25

          test('cc to be success, with special, without critical-success', () => {
            const dice = roll('cc<=' + target, {}, dice_eyes)
            expect(dice.result).toBeTruthy()
            expect(dice.verbose[0].text).toBe("Special!")
          })

          test('ccb to be success, with critical-success', () => {
            const dice = roll('ccb<=' + target, {}, dice_eyes)
            expect(dice.result).toBeTruthy()
            expect(dice.verbose[0].text).toBe('Special!,Critical!!')
          })
        })
      })
    })

    describe('dice_eyes:6', () => {
      let dice_eyes = TEST_SEED_1D100_6

      describe('target:6', () => {
        let target = 6

        test('cc to be success, without critical-success', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe("")
        })

        test('ccb to be success, without critical-success', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe("")
        })
      })
    })
    
    describe('dice_eyes:1', () => {
      let dice_eyes = TEST_SEED_1D100_1

      describe('target:5', () => {
        let target = 5

        test('cc to be success, with special, with critical-success', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe("Special!,Critical!!")
        })

        test('ccb to be success, with special, with critical-success', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe('Special!,Critical!!')
        })
      })
    })
  })

  describe('as fumble', () => {
    describe('dice_eyes:95', () => {
      let dice_eyes = TEST_SEED_1D100_95

      describe('target:95', () => {
        let target = 95

        test('cc to be success without fumble', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe("")
        })

        test('ccb to be success without fumble', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe("")
        })
      })
    })

    describe('dice_eyes:96', () => {
      let dice_eyes = TEST_SEED_1D100_96

      describe('target:95', () => {
        let target = 95

        test('cc to be failure without fumble', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeFalsy()
          expect(dice.verbose[0].text).toBe("")
        })

        test('ccb to be failure with fumble', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(false).toBeFalsy()
          expect(dice.verbose[0].text).toBe('Fumble!!')
        })
      })

      describe('target:96', () => {
        let target = 96

        test('cc to be success without fumble', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe("")
        })

        test('ccb to be success without fumble', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeTruthy()
          expect(dice.verbose[0].text).toBe("")
        })
      })
    })

    describe('dice_eyes:100', () => {
      let dice_eyes = TEST_SEED_1D100_100

      describe('target:100', () => {
        let target = 100

        test('cc to be actually success, but fumble(failure)', () => {
          const dice = roll('cc<=' + target, {}, dice_eyes)
          expect(dice.result).toBeFalsy()
          expect(dice.verbose[0].text).toBe("Fumble!!")
        })

        test('ccb to be actually success, but fumble(failure)', () => {
          const dice = roll('ccb<=' + target, {}, dice_eyes)
          expect(dice.result).toBeFalsy()
          expect(dice.verbose[0].text).toBe("Fumble!!")
        })
      })
    })

  })
})
