import { describe, expect, it } from 'vitest'
import { getInitialFormValues } from './query'

const NOW = new Date(2025, 10, 30, 9, 15)

describe('URL 初始参数', () => {
  it('读取有效的性别、年月日时参数', () => {
    expect(getInitialFormValues(
      '?_year=2026&_month=7&_day=16&_hour=17&_gender=1',
      NOW,
    )).toEqual({
      gender: 'male',
      year: 2026,
      month: 7,
      day: 16,
      hour: 17,
    })
  })

  it('缺失参数时使用当前时间和性别 1', () => {
    expect(getInitialFormValues('', NOW)).toEqual({
      gender: 'male',
      year: 2025,
      month: 11,
      day: 30,
      hour: 9,
    })
  })

  it('非法参数逐项回退默认值并校验所选月份天数', () => {
    expect(getInitialFormValues(
      '?_year=text&_month=2&_day=31&_hour=24&_gender=invalid',
      NOW,
    )).toEqual({
      gender: 'male',
      year: 2025,
      month: 2,
      day: 28,
      hour: 9,
    })
  })

  it('兼容 0 或 2 表示女性', () => {
    expect(getInitialFormValues('?_gender=0', NOW).gender).toBe('female')
    expect(getInitialFormValues('?_gender=2', NOW).gender).toBe('female')
  })

  it('允许 0 时并在午夜使用当前 0 时作为默认值', () => {
    expect(getInitialFormValues('?_hour=0', NOW).hour).toBe(0)
    expect(getInitialFormValues('', new Date(2025, 10, 30, 0, 15)).hour).toBe(0)
  })
})
