import { describe, expect, it } from 'vitest'
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

function createCounts(values = {}) {
  return Object.fromEntries(
    Object.entries(TEN_GOD_CATEGORIES).map(([category, names]) => [
      category,
      Object.fromEntries(names.map((name) => [
        name,
        {
          total: values[name] ?? 0,
          heavenlyStems: values[name] ?? 0,
          hiddenStems: 0,
        },
      ])),
    ]),
  )
}

function detect(values) {
  return detectBaziPatterns({
    tenGodCounts: createCounts(values),
  }).map(({ name }) => name)
}

const pairCases = [
  ['杀印相生', [
    { 七杀: 1, 正印: 1 },
    { 七杀: 1, 偏印: 1 },
  ]],
  ['官印相生', [
    { 正官: 1, 正印: 1 },
    { 正官: 1, 偏印: 1 },
  ]],
  ['食神生财', [
    { 食神: 1, 正财: 1 },
    { 食神: 1, 偏财: 1 },
  ]],
  ['伤官生财', [
    { 伤官: 1, 正财: 1 },
    { 伤官: 1, 偏财: 1 },
  ]],
  ['财生官杀', [
    { 正财: 1, 正官: 1 },
    { 正财: 1, 七杀: 1 },
    { 偏财: 1, 正官: 1 },
    { 偏财: 1, 七杀: 1 },
  ]],
  ['食神制杀', [{ 食神: 1, 七杀: 1 }]],
  ['伤官见官', [{ 伤官: 1, 正官: 1 }]],
  ['比劫夺财', [
    { 比肩: 1, 正财: 1 },
    { 比肩: 1, 偏财: 1 },
    { 劫财: 1, 正财: 1 },
    { 劫财: 1, 偏财: 1 },
  ]],
  ['财星坏印', [
    { 正财: 1, 正印: 1 },
    { 正财: 1, 偏印: 1 },
    { 偏财: 1, 正印: 1 },
    { 偏财: 1, 偏印: 1 },
  ]],
  ['枭神夺食', [{ 偏印: 1, 食神: 1 }]],
  ['比劫帮身', [
    { 比肩: 1 },
    { 劫财: 1 },
  ]],
  ['印星护身', [
    { 正印: 1 },
    { 偏印: 1 },
  ]],
  ['官星护财', [
    { 正官: 1, 正财: 1 },
    { 正官: 1, 偏财: 1 },
    { 七杀: 1, 正财: 1 },
    { 七杀: 1, 偏财: 1 },
  ]],
  ['官杀混杂', [{ 正官: 1, 七杀: 1 }]],
  ['伤官配印', [{ 伤官: 1, 正印: 1 }]],
  ['劫财抗杀', [{ 劫财: 1, 七杀: 1 }]],
]

describe('八字格局定义', () => {
  it('按表格保存四类共 16 个唯一格局', () => {
    const names = BAZI_PATTERN_DEFINITIONS.map(({ name }) => name)

    expect(BAZI_PATTERN_CATEGORIES).toEqual([
      '生类', '克/制类', '同/助类', '混杂类',
    ])
    expect(names).toHaveLength(16)
    expect(new Set(names).size).toBe(16)
    expect(names).toEqual([
      '杀印相生', '官印相生', '食神生财', '伤官生财', '财生官杀',
      '食神制杀', '伤官见官', '比劫夺财', '财星坏印', '枭神夺食',
      '比劫帮身', '印星护身', '官星护财',
      '官杀混杂', '伤官配印', '劫财抗杀',
    ])
  })

  it.each(pairCases)('%s 支持表中列出的每一种十神组合', (name, combinations) => {
    combinations.forEach((combination) => {
      expect(detect(combination)).toContain(name)
    })
  })

  it('同一格局的多个组合和重复十神同时存在时只返回一次', () => {
    const names = detect({ 伤官: 3, 正财: 2, 偏财: 4 })

    expect(names.filter((name) => name === '伤官生财')).toHaveLength(1)
  })

  it('伤官配印特指正印，不由偏印触发', () => {
    expect(detect({ 伤官: 1, 正印: 1 })).toContain('伤官配印')
    expect(detect({ 伤官: 1, 偏印: 1 })).not.toContain('伤官配印')
  })

  it('不再返回表格之外的旧格局', () => {
    const names = BAZI_PATTERN_DEFINITIONS.map(({ name }) => name)
    const oldNames = [
      '财官双美', '食神佩印', '羊刃驾杀', '财滋弱杀',
      '群比夺财', '比劫争夫', '伤官合杀', '弃命从财', '弃命从杀',
    ]

    oldNames.forEach((name) => expect(names).not.toContain(name))
  })

  it('按组合类型对命中的格局分组', () => {
    const patterns = detectBaziPatterns({
      tenGodCounts: createCounts({ 劫财: 1, 七杀: 1 }),
    })
    const groups = groupBaziPatterns(patterns)

    expect(Object.keys(groups)).toEqual(BAZI_PATTERN_CATEGORIES)
    expect(groups['同/助类'].map(({ name }) => name)).toContain('比劫帮身')
    expect(groups['混杂类'].map(({ name }) => name)).toContain('劫财抗杀')
  })
})
