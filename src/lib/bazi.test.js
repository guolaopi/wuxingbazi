import { describe, expect, it } from 'vitest'
import lunisolar from 'lunisolar'
import {
  HEAVENLY_STEMS,
  calculateBazi,
  daysInMonth,
  formatStem,
  getTenGod,
  getTenGodDetail,
} from './bazi'

describe('天干阴阳五行', () => {
  it('按每两个天干一组映射木火土金水和阳阴', () => {
    expect(HEAVENLY_STEMS).toEqual([
      { name: '甲', element: '木', polarity: '阳' },
      { name: '乙', element: '木', polarity: '阴' },
      { name: '丙', element: '火', polarity: '阳' },
      { name: '丁', element: '火', polarity: '阴' },
      { name: '戊', element: '土', polarity: '阳' },
      { name: '己', element: '土', polarity: '阴' },
      { name: '庚', element: '金', polarity: '阳' },
      { name: '辛', element: '金', polarity: '阴' },
      { name: '壬', element: '水', polarity: '阳' },
      { name: '癸', element: '水', polarity: '阴' },
    ])
  })

  it('格式化为天干-五行-阴阳', () => {
    const char8 = lunisolar('2022/07/18 14:40').char8
    expect(formatStem(char8.year.branch.hiddenStems[0])).toBe('甲-木-阳')
    expect(formatStem(char8.month.stem)).toBe('丁-火-阴')
  })
})

describe('daysInMonth', () => {
  it('处理闰年二月', () => {
    expect(daysInMonth(2024, 2)).toBe(29)
    expect(daysInMonth(2023, 2)).toBe(28)
  })

  it('处理大小月', () => {
    expect(daysInMonth(2024, 4)).toBe(30)
    expect(daysInMonth(2024, 7)).toBe(31)
  })
})

describe('getTenGod', () => {
  const dayStem = lunisolar('2022/07/18 14:40').char8.day.stem

  it('根据壬日主计算同类与财星', () => {
    const char8 = lunisolar('2022/07/18 14:40').char8
    expect(getTenGod(dayStem, char8.year.stem)).toBe('比肩')
    expect(getTenGod(dayStem, char8.month.stem)).toBe('正财')
  })

  it('以庚金日主覆盖五类关系及阴阳同异', () => {
    const dayMaster = lunisolar.Stem.create('庚')
    const cases = {
      戊: ['印星', '生我者', '同阴阳', '偏印'],
      己: ['印星', '生我者', '异阴阳', '正印'],
      丙: ['官杀', '克我者', '同阴阳', '七杀'],
      丁: ['官杀', '克我者', '异阴阳', '正官'],
      壬: ['食伤', '我生者', '同阴阳', '食神'],
      癸: ['食伤', '我生者', '异阴阳', '伤官'],
      甲: ['财星', '我克者', '同阴阳', '偏财'],
      乙: ['财星', '我克者', '异阴阳', '正财'],
      庚: ['比劫', '同我者', '同阴阳', '比肩'],
      辛: ['比劫', '同我者', '异阴阳', '劫财'],
    }

    Object.entries(cases).forEach(([stemName, expected]) => {
      const detail = getTenGodDetail(dayMaster, lunisolar.Stem.create(stemName))
      expect([
        detail.category,
        detail.relation,
        detail.polarityRelation,
        detail.name,
      ]).toEqual(expected)
    })
  })
})

describe('calculateBazi', () => {
  it('生成文档示例的八字和动态排盘信息', () => {
    const result = calculateBazi({
      year: 2022,
      month: 7,
      day: 18,
      hour: 14,
      gender: 'male',
    })

    expect(result.bazi).toBe('壬寅 丁未 壬申 丁未')
    expect(result.pillars.day.mainStar).toBe('元男')
    expect(result.pillars.year.stem.display).toBe('壬-水-阳')
    expect(result.pillars.month.stem.display).toBe('丁-火-阴')
    expect(result.pillars.year.stem.tenGod.name).toBe('比肩')
    expect(result.pillars.year.stem.tenGod.seasonalState).toBe('死')
    expect(result.pillars.month.stem.tenGod.seasonalState).toBe('休')
    expect(result.pillars.day.stem.tenGod).toBeNull()
    expect(result.pillars.year.hiddenStems[0].tenGod.name).toBe('食神')
    expect(result.pillars.year.hiddenStems[0].tenGod.seasonalState).toBe('囚')
    expect(result.dayMaster).toBe('壬-水-阳')
    expect(result.monthCommand).toEqual({
      branch: '未', lunarMonth: '六月', season: '季末', element: '土',
    })
    expect(result.dayMasterCommandStatus).toBe('失令')
    expect(result.preferenceItems.map(({ state, element }) => [state, element])).toEqual([
      ['旺', '水'],
      ['相', '木'],
      ['休', '金'],
      ['囚', '土'],
      ['死', '火'],
    ])
    expect(result.pillars.year.hiddenStems.map(({ name }) => name)).toEqual(['甲', '丙', '戊'])
    expect(result.elementCounts).toEqual({
      木: { total: 3, heavenlyStems: 0, hiddenStems: 3 },
      火: { total: 5, heavenlyStems: 2, hiddenStems: 3 },
      土: { total: 4, heavenlyStems: 0, hiddenStems: 4 },
      金: { total: 1, heavenlyStems: 0, hiddenStems: 1 },
      水: { total: 3, heavenlyStems: 2, hiddenStems: 1 },
    })
    expect(Object.values(result.elementCounts).reduce(
      (sum, count) => sum + count.total,
      0,
    )).toBe(16)
    expect(result.tenGodCounts).toEqual({
      印星: {
        偏印: { total: 1, heavenlyStems: 0, hiddenStems: 1 },
        正印: { total: 0, heavenlyStems: 0, hiddenStems: 0 },
      },
      官杀: {
        七杀: { total: 2, heavenlyStems: 0, hiddenStems: 2 },
        正官: { total: 2, heavenlyStems: 0, hiddenStems: 2 },
      },
      食伤: {
        食神: { total: 1, heavenlyStems: 0, hiddenStems: 1 },
        伤官: { total: 2, heavenlyStems: 0, hiddenStems: 2 },
      },
      财星: {
        偏财: { total: 1, heavenlyStems: 0, hiddenStems: 1 },
        正财: { total: 4, heavenlyStems: 2, hiddenStems: 2 },
      },
      比劫: {
        比肩: { total: 2, heavenlyStems: 1, hiddenStems: 1 },
        劫财: { total: 0, heavenlyStems: 0, hiddenStems: 0 },
      },
    })
    expect(result.tenGodTotal).toBe(15)
    expect(result.patterns.map(({ name }) => name)).toEqual([
      '杀印相生',
      '官印相生',
      '食神生财',
      '伤官生财',
      '财生官杀',
      '食神制杀',
      '伤官见官',
      '比劫夺财',
      '财星坏印',
      '枭神夺食',
      '比劫帮身',
      '印星护身',
      '官星护财',
      '官杀混杂',
    ])
  })

  it('为超出 lunisolar 数据范围的年份提供明确错误', () => {
    expect(() => calculateBazi({
      year: 2199,
      month: 1,
      day: 1,
      hour: 1,
      gender: 'female',
    })).toThrow('仅支持到 2099 年')
  })
})
