import { describe, expect, it } from 'vitest'
import {
  BAZI_PATTERN_DEFINITIONS,
  detectBaziPatterns,
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

function detect(values, options = {}) {
  return detectBaziPatterns({
    tenGodCounts: createCounts(values),
    dayStemName: options.dayStemName ?? '庚',
    branchNames: options.branchNames ?? [],
    gender: options.gender ?? 'male',
  }).map(({ name }) => name)
}

describe('八字格局定义', () => {
  it('包含表格中的全部 19 个唯一格局', () => {
    const names = BAZI_PATTERN_DEFINITIONS.map(({ name }) => name)
    expect(names).toHaveLength(19)
    expect(new Set(names).size).toBe(19)
    expect(names).toEqual([
      '官印相生', '财官双美', '食神佩印', '食神生财', '伤官生财',
      '食神制杀', '羊刃驾杀', '杀印相生', '伤官配印', '财滋弱杀',
      '伤官见官', '枭神夺食', '群比夺财', '官杀混杂', '财星坏印',
      '比劫争夫', '伤官合杀', '弃命从财', '弃命从杀',
    ])
  })

  it('同一组合无论出现多少次都只返回一次', () => {
    const names = detect({ 伤官: 3, 偏财: 4 })
    expect(names.filter((name) => name === '伤官生财')).toHaveLength(1)
  })

  it('支持财星泛指、女性限定和羊刃地支条件', () => {
    const malePatterns = detect({ 劫财: 1, 正财: 1, 正官: 1, 七杀: 1 })
    expect(malePatterns).toContain('群比夺财')
    expect(malePatterns).not.toContain('比劫争夫')

    const femalePatterns = detect(
      { 劫财: 1, 正官: 1 },
      { gender: 'female' },
    )
    expect(femalePatterns).toContain('比劫争夫')

    const bladePatterns = detect(
      { 七杀: 1 },
      { dayStemName: '甲', branchNames: ['卯'] },
    )
    expect(bladePatterns).toContain('羊刃驾杀')
  })

  it('满盘条件只在全部十神属于目标类别时成立', () => {
    expect(detect({ 正财: 8, 偏财: 7 })).toContain('弃命从财')
    expect(detect({ 正财: 8, 偏财: 6, 比肩: 1 })).not.toContain('弃命从财')
    expect(detect({ 正官: 7, 七杀: 8 })).toContain('弃命从杀')
  })
})

