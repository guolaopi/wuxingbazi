import { describe, expect, it } from 'vitest'
import lunisolar from 'lunisolar'
import { FIVE_ELEMENT_DETAILS, getPreferenceItems } from './preferences'

describe('喜忌余项', () => {
  it('保存五行对应的八卦、方位、季节和颜色', () => {
    expect(Object.keys(FIVE_ELEMENT_DETAILS)).toEqual(['木', '火', '土', '金', '水'])
    expect(FIVE_ELEMENT_DETAILS.木).toEqual({
      bagua: '震（☳）、巽（☴）',
      direction: '东、东南',
      season: '春',
      color: '青/绿',
    })
    expect(FIVE_ELEMENT_DETAILS.土.season).toBe('四季月（季末）')
  })

  it('以木日主按旺相休囚死顺序生成五行关系', () => {
    const wood = lunisolar.Element5.create('木')
    expect(getPreferenceItems(wood)).toEqual([
      { state: '旺', element: '木', ...FIVE_ELEMENT_DETAILS.木 },
      { state: '相', element: '火', ...FIVE_ELEMENT_DETAILS.火 },
      { state: '休', element: '水', ...FIVE_ELEMENT_DETAILS.水 },
      { state: '囚', element: '金', ...FIVE_ELEMENT_DETAILS.金 },
      { state: '死', element: '土', ...FIVE_ELEMENT_DETAILS.土 },
    ])
  })

  it('每种日主都生成五种不重复状态与五行', () => {
    Object.keys(FIVE_ELEMENT_DETAILS).forEach((element) => {
      const items = getPreferenceItems(lunisolar.Element5.create(element))
      expect(items.map(({ state }) => state)).toEqual(['旺', '相', '休', '囚', '死'])
      expect(new Set(items.map((item) => item.element)).size).toBe(5)
    })
  })
})

