export const MONTH_COMMANDS = Object.freeze({
    寅: Object.freeze({ lunarMonth: "正月", season: "春", element: "木" }),
    卯: Object.freeze({ lunarMonth: "二月", season: "春", element: "木" }),
    辰: Object.freeze({ lunarMonth: "三月", season: "季末", element: "土" }),
    巳: Object.freeze({ lunarMonth: "四月", season: "夏", element: "火" }),
    午: Object.freeze({ lunarMonth: "五月", season: "夏", element: "火" }),
    未: Object.freeze({ lunarMonth: "六月", season: "季末", element: "土" }),
    申: Object.freeze({ lunarMonth: "七月", season: "秋", element: "金" }),
    酉: Object.freeze({ lunarMonth: "八月", season: "秋", element: "金" }),
    戌: Object.freeze({ lunarMonth: "九月", season: "季末", element: "土" }),
    亥: Object.freeze({ lunarMonth: "十月", season: "冬", element: "水" }),
    子: Object.freeze({ lunarMonth: "十一月", season: "冬", element: "水" }),
    丑: Object.freeze({ lunarMonth: "十二月", season: "季末", element: "土" }),
});

export const SEASONAL_STATES = Object.freeze({
    木: Object.freeze({ 木: "旺", 火: "相", 水: "休", 金: "囚", 土: "死" }),
    火: Object.freeze({ 火: "旺", 土: "相", 木: "休", 水: "囚", 金: "死" }),
    金: Object.freeze({ 金: "旺", 水: "相", 土: "休", 火: "囚", 木: "死" }),
    水: Object.freeze({ 水: "旺", 木: "相", 金: "休", 火: "囚", 土: "死" }),
    土: Object.freeze({ 土: "旺", 金: "相", 火: "休", 木: "囚", 水: "死" }),
});

export function getMonthCommand(branchName) {
    const command = MONTH_COMMANDS[branchName];
    if (!command) throw new RangeError(`无效的月令地支：${branchName}`);
    return { branch: branchName, ...command };
}

export function getSeasonalState(element, monthElement) {
    const state = SEASONAL_STATES[monthElement]?.[element];
    if (!state) throw new RangeError(`无效的五行季节关系：${element}/${monthElement}`);
    return state;
}

export function getDayMasterCommandStatus(dayElement, monthElement) {
    if (dayElement.name === monthElement) return "得令";
    if (dayElement.counteracting().name === monthElement) return "失令";
    return null;
}

