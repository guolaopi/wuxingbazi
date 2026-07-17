import { describe, expect, it } from 'vitest'
import lunisolar from 'lunisolar'
import {
  MONTH_COMMANDS,
  SEASONAL_STATES,
  getDayMasterCommandStatus,
  getMonthCommand,
  getSeasonalState,
} from './season'

describe('月令', () => {
  it('将十二地支映射到月份、季节和五行', () => {
    expect(Object.keys(MONTH_COMMANDS)).toHaveLength(12)
    expect(getMonthCommand('寅')).toEqual({
      branch: '寅', lunarMonth: '正月', season: '春', element: '木',
    })
    expect(getMonthCommand('巳').season).toBe('夏')
    expect(getMonthCommand('申').season).toBe('秋')
    expect(getMonthCommand('亥').season).toBe('冬')
    expect(getMonthCommand('辰').season).toBe('季末')
  })

  it('使用日主五行及 counteracting 判断得令和失令', () => {
    const metal = lunisolar.Element5.create('金')
    expect(getDayMasterCommandStatus(metal, '金')).toBe('得令')
    expect(getDayMasterCommandStatus(metal, '火')).toBe('失令')
    expect(getDayMasterCommandStatus(metal, '土')).toBeNull()
  })
})

describe('旺相休囚死', () => {
  it('完整保存五种月令的状态矩阵', () => {
    expect(SEASONAL_STATES).toEqual({
      木: { 木: '旺', 火: '相', 水: '休', 金: '囚', 土: '死' },
      火: { 火: '旺', 土: '相', 木: '休', 水: '囚', 金: '死' },
      金: { 金: '旺', 水: '相', 土: '休', 火: '囚', 木: '死' },
      水: { 水: '旺', 木: '相', 金: '休', 火: '囚', 土: '死' },
      土: { 土: '旺', 金: '相', 火: '休', 木: '囚', 水: '死' },
    })
  })

  it('按月令五行返回目标五行状态', () => {
    expect(getSeasonalState('火', '水')).toBe('囚')
    expect(getSeasonalState('金', '火')).toBe('死')
    expect(getSeasonalState('木', '木')).toBe('旺')
  })
})

