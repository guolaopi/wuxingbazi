import { describe, expect, it } from 'vitest'
import { calculateBazi } from './bazi'
import {
  BAZI_PATTERN_CATEGORIES,
  BAZI_PATTERN_DEFINITIONS,
  detectBaziPatterns,
  groupBaziPatterns,
} from './patterns'

const TEN_GOD_CATEGORIES = {
  印星: ['正印', '偏印'],
  官杀: ['正官', '七杀'],
  食伤: ['食神', '伤官'],
  财星: ['正财', '偏财'],
  比劫: ['比肩', '劫财'],
}

const COMBINATION_CASES = [
  {
    category: '生类',
    name: '杀印相生',
    description: '化压力为权柄，压力逼出学识与地位，化敌为友',
    pairs: [['七杀', '正印'], ['七杀', '偏印']],
  },
  {
    category: '生类',
    name: '官印相生',
    description: '官星得印护，清贵权威，事业平稳，易得贵人提携',
    pairs: [['正官', '正印'], ['正官', '偏印']],
  },
  {
    category: '生类',
    name: '食神生财',
    description: '才华与技艺稳定变现，细水长流，稳健生财',
    pairs: [['食神', '正财'], ['食神', '偏财']],
  },
  {
    category: '生类',
    name: '伤官生财',
    description: '凭口才、创意、魄力开拓财源，求财主动，爆发力强',
    pairs: [['伤官', '正财'], ['伤官', '偏财']],
  },
  {
    category: '生类',
    name: '财生官杀',
    description: '以财养官，用资源换取地位，或因妻得贵',
    pairs: [
      ['正财', '正官'],
      ['正财', '七杀'],
      ['偏财', '正官'],
      ['偏财', '七杀'],
    ],
  },
  {
    category: '克/制类',
    name: '食神制杀',
    description: '以智谋化解危机，用才华驾驭压力，能力挽狂澜',
    pairs: [['食神', '七杀']],
  },
  {
    category: '克/制类',
    name: '伤官见官',
    description: '叛逆与规则冲突，易生口舌是非、官非，挑战权威',
    pairs: [['伤官', '正官']],
  },
  {
    category: '克/制类',
    name: '比劫夺财',
    description: '兄弟朋友分财，合伙易吃亏，开销大难储蓄',
    pairs: [
      ['比肩', '正财'],
      ['比肩', '偏财'],
      ['劫财', '正财'],
      ['劫财', '偏财'],
    ],
  },
  {
    category: '克/制类',
    name: '财星坏印',
    description: '因财失义，贪图利益损害名声、放弃原则',
    pairs: [
      ['正财', '正印'],
      ['正财', '偏印'],
      ['偏财', '正印'],
      ['偏财', '偏印'],
    ],
  },
  {
    category: '克/制类',
    name: '枭神夺食',
    description: '思虑过多，福气被夺，才华受困，事倍功半',
    pairs: [['偏印', '食神']],
  },
  {
    category: '同/助类',
    name: '比劫帮身',
    description: '朋友、兄弟姐妹共同分担压力，合作共赢',
    pairs: [['比肩', '日主'], ['劫财', '日主']],
  },
  {
    category: '同/助类',
    name: '印星护身',
    description: '有贵人提携，学历证书庇护，内心有安全感',
    pairs: [['正印', '日主'], ['偏印', '日主']],
  },
  {
    category: '同/助类',
    name: '官星护财',
    description: '地位守护财富，或配偶约束钱财不乱花',
    pairs: [
      ['正官', '正财'],
      ['正官', '偏财'],
      ['七杀', '正财'],
      ['七杀', '偏财'],
    ],
  },
  {
    category: '混杂类',
    name: '官杀混杂',
    description: '多个领导多头管理，事业方向摇摆，感情复杂',
    pairs: [['正官', '七杀']],
  },
  {
    category: '混杂类',
    name: '伤官配印',
    description: '才华被学识与贵气收服，变得稳重而有深度',
    pairs: [['伤官', '正印']],
  },
  {
    category: '混杂类',
    name: '劫财抗杀',
    description: '兄弟联手抵御大压力，合作攻坚克难',
    pairs: [['劫财', '七杀']],
  },
]

function normalizeCount(value = 0) {
  if (typeof value === 'number') {
    return { total: value, heavenlyStems: value, hiddenStems: 0 }
  }

  const heavenlyStems = value.heavenlyStems ?? 0
  const hiddenStems = value.hiddenStems ?? 0
  return {
    total: value.total ?? heavenlyStems + hiddenStems,
    heavenlyStems,
    hiddenStems,
  }
}

function createCounts(values = {}) {
  return Object.fromEntries(
    Object.entries(TEN_GOD_CATEGORIES).map(([category, names]) => [
      category,
      Object.fromEntries(
        names.map((name) => [name, normalizeCount(values[name])]),
      ),
    ]),
  )
}

function detect(values) {
  return detectBaziPatterns({
    tenGodCounts: createCounts(values),
    dayStemName: '庚',
    branchNames: [],
    gender: 'male',
  })
}

function detectedNames(values) {
  return detect(values).map(({ name }) => name)
}

function presentTenGods(pair) {
  return Object.fromEntries(
    pair.filter((name) => name !== '日主').map((name) => [name, 1]),
  )
}

describe('新版八字格局组合表', () => {
  it('保存四类、16 个唯一名称及对应简要特征', () => {
    expect(BAZI_PATTERN_CATEGORIES).toEqual([
      '生类',
      '克/制类',
      '同/助类',
      '混杂类',
    ])
    expect(BAZI_PATTERN_DEFINITIONS.map(({ category, name, description }) => ({
      category,
      name,
      description: description.replace(/。$/, ''),
    }))).toEqual(COMBINATION_CASES.map(({ category, name, description }) => ({
      category,
      name,
      description,
    })))

    const names = BAZI_PATTERN_DEFINITIONS.map(({ name }) => name)
    expect(names).toHaveLength(16)
    expect(new Set(names).size).toBe(16)
  })

  for (const { name, pairs } of COMBINATION_CASES) {
    it(`${name}：表中每个逗号分隔的组合均可独立命中`, () => {
      for (const pair of pairs) {
        expect(detectedNames(presentTenGods(pair)), pair.join(' & ')).toContain(name)
      }
    })
  }

  it('不满足完整 A & B 条件时不误报普通双十神格局', () => {
    const patternsWithOnlyOneSide = [
      ['杀印相生', { 七杀: 1 }],
      ['官印相生', { 正官: 1 }],
      ['食神生财', { 食神: 1 }],
      ['伤官生财', { 伤官: 1 }],
      ['财生官杀', { 正财: 1 }],
      ['食神制杀', { 七杀: 1 }],
      ['伤官见官', { 正官: 1 }],
      ['比劫夺财', { 偏财: 1 }],
      ['财星坏印', { 正印: 1 }],
      ['枭神夺食', { 偏印: 1 }],
      ['官星护财', { 七杀: 1 }],
      ['官杀混杂', { 正官: 1 }],
      ['伤官配印', { 伤官: 1, 偏印: 1 }],
      ['劫财抗杀', { 劫财: 1 }],
    ]

    for (const [name, values] of patternsWithOnlyOneSide) {
      expect(detectedNames(values), name).not.toContain(name)
    }
  })

  it('把日主视为固有条件，只要出现任一比劫或印星即可护身', () => {
    expect(detectedNames({ 比肩: 1 })).toContain('比劫帮身')
    expect(detectedNames({ 劫财: 1 })).toContain('比劫帮身')
    expect(detectedNames({ 正印: 1 })).toContain('印星护身')
    expect(detectedNames({ 偏印: 1 })).toContain('印星护身')
    expect(detectedNames({})).not.toContain('比劫帮身')
    expect(detectedNames({})).not.toContain('印星护身')
  })

  it('财与官杀共现时同时得到财生官杀和官星护财', () => {
    expect(detectedNames({ 偏财: 1, 七杀: 1 })).toEqual(expect.arrayContaining([
      '财生官杀',
      '官星护财',
    ]))
  })

  it('合并天干与藏干判断，任一来源各出现一方即可命中', () => {
    const firstInStem = detectedNames({
      伤官: { heavenlyStems: 2 },
      偏财: { hiddenStems: 3 },
    })
    const firstInHiddenStem = detectedNames({
      伤官: { hiddenStems: 2 },
      正财: { heavenlyStems: 3 },
    })

    expect(firstInStem).toContain('伤官生财')
    expect(firstInHiddenStem).toContain('伤官生财')
  })

  it('来源字段有记录时，即使汇总 total 未更新也能命中', () => {
    const names = detectBaziPatterns({
      tenGodCounts: {
        食伤: { 伤官: { total: 0, heavenlyStems: 1, hiddenStems: 0 } },
        财星: { 正财: { total: 0, heavenlyStems: 0, hiddenStems: 1 } },
      },
    }).map(({ name }) => name)

    expect(names).toContain('伤官生财')
  })

  it('同名的多个可选组合和重复十神同时存在时仍只输出一次', () => {
    const names = detectedNames({
      伤官: { heavenlyStems: 2, hiddenStems: 3 },
      正财: { heavenlyStems: 1, hiddenStems: 2 },
      偏财: { heavenlyStems: 4, hiddenStems: 1 },
    })

    expect(names.filter((name) => name === '伤官生财')).toHaveLength(1)
  })

  it('按新版四类分组且不复制格局项', () => {
    const patterns = detect({
      七杀: 1,
      正官: 1,
      正印: 1,
      食神: 1,
      伤官: 1,
      正财: 1,
      比肩: 1,
      劫财: 1,
    })
    const groups = groupBaziPatterns(patterns)

    expect(Object.keys(groups)).toEqual(BAZI_PATTERN_CATEGORIES)
    expect(Object.values(groups).flat()).toEqual(patterns)
  })

  it('真实排盘会共同统计天干与藏干，并按定义顺序返回一次', () => {
    const result = calculateBazi({
      year: 2022,
      month: 7,
      day: 18,
      hour: 14,
      gender: 'male',
    })

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
})
