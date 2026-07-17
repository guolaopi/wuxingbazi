export const FIVE_ELEMENT_DETAILS = Object.freeze({
    木: Object.freeze({
        bagua: "震（☳）、巽（☴）",
        direction: "东、东南",
        season: "春",
        color: "青/绿",
    }),
    火: Object.freeze({
        bagua: "离（☲）",
        direction: "南",
        season: "夏",
        color: "赤/红",
    }),
    土: Object.freeze({
        bagua: "坤（☷）、艮（☶）",
        direction: "西南、东北",
        season: "四季月（季末）",
        color: "黄",
    }),
    金: Object.freeze({
        bagua: "兑（☱）、乾（☰）",
        direction: "西、西北",
        season: "秋",
        color: "白/金",
    }),
    水: Object.freeze({
        bagua: "坎（☵）",
        direction: "北",
        season: "冬",
        color: "黑/蓝",
    }),
});

export function getPreferenceItems(dayElement) {
    const relations = [
        ["旺", dayElement.name],
        ["相", dayElement.generating().name],
        ["休", dayElement.weakening().name],
        ["囚", dayElement.counteracting().name],
        ["死", dayElement.overcoming().name],
    ];

    return relations.map(([state, element]) => ({
        state,
        element,
        ...FIVE_ELEMENT_DETAILS[element],
    }));
}

