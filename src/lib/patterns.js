export const BAZI_PATTERN_CATEGORIES = Object.freeze([
    "生类",
    "克/制类",
    "同/助类",
    "混杂类",
]);

const definitions = [
    {
        category: "生类",
        name: "杀印相生",
        involved: "七杀 & 正印, 七杀 & 偏印",
        requirements: [["七杀"], ["正印", "偏印"]],
        description:
            "化压力为权柄，压力逼出学识与地位，化敌为友",
    },
    {
        category: "生类",
        name: "官印相生",
        involved: "正官 & 正印, 正官 & 偏印",
        requirements: [["正官"], ["正印", "偏印"]],
        description:
            "官星得印护，清贵权威，事业平稳，易得贵人提携",
    },
    {
        category: "生类",
        name: "食神生财",
        involved: "食神 & 正财, 食神 & 偏财",
        requirements: [["食神"], ["正财", "偏财"]],
        description:
            "才华与技艺稳定变现，细水长流，稳健生财",
    },
    {
        category: "生类",
        name: "伤官生财",
        involved: "伤官 & 正财, 伤官 & 偏财",
        requirements: [["伤官"], ["正财", "偏财"]],
        description:
            "凭口才、创意、魄力开拓财源，求财主动，爆发力强",
    },
    {
        category: "生类",
        name: "财生官杀",
        involved:
            "正财 & 正官, 正财 & 七杀, 偏财 & 正官, 偏财 & 七杀",
        requirements: [["正财", "偏财"], ["正官", "七杀"]],
        description:
            "以财养官，用资源换取地位，或因妻得贵",
    },
    {
        category: "克/制类",
        name: "食神制杀",
        involved: "食神 & 七杀",
        requirements: [["食神"], ["七杀"]],
        description:
            "以智谋化解危机，用才华驾驭压力，能力挽狂澜",
    },
    {
        category: "克/制类",
        name: "伤官见官",
        involved: "伤官 & 正官",
        requirements: [["伤官"], ["正官"]],
        description:
            "叛逆与规则冲突，易生口舌是非、官非，挑战权威",
    },
    {
        category: "克/制类",
        name: "比劫夺财",
        involved:
            "比肩 & 正财, 比肩 & 偏财, 劫财 & 正财, 劫财 & 偏财",
        requirements: [["比肩", "劫财"], ["正财", "偏财"]],
        description:
            "兄弟朋友分财，合伙易吃亏，开销大难储蓄",
    },
    {
        category: "克/制类",
        name: "财星坏印",
        involved:
            "正财 & 正印, 正财 & 偏印, 偏财 & 正印, 偏财 & 偏印",
        requirements: [["正财", "偏财"], ["正印", "偏印"]],
        description:
            "因财失义，贪图利益损害名声、放弃原则",
    },
    {
        category: "克/制类",
        name: "枭神夺食",
        involved: "偏印 & 食神",
        requirements: [["偏印"], ["食神"]],
        description:
            "思虑过多，福气被夺，才华受困，事倍功半",
    },
    {
        category: "同/助类",
        name: "比劫帮身",
        involved: "比肩 & 日主, 劫财 & 日主",
        requirements: [["比肩", "劫财"], ["日主"]],
        description:
            "朋友、兄弟姐妹共同分担压力，合作共赢",
    },
    {
        category: "同/助类",
        name: "印星护身",
        involved: "正印 & 日主, 偏印 & 日主",
        requirements: [["正印", "偏印"], ["日主"]],
        description:
            "有贵人提携，学历证书庇护，内心有安全感",
    },
    {
        category: "同/助类",
        name: "官星护财",
        involved: "正官 & 财星, 七杀 & 财星",
        requirements: [["正官", "七杀"], ["正财", "偏财"]],
        description:
            "地位守护财富，或配偶约束钱财不乱花",
    },
    {
        category: "混杂类",
        name: "官杀混杂",
        involved: "正官 & 七杀",
        requirements: [["正官"], ["七杀"]],
        description:
            "多个领导多头管理，事业方向摇摆，感情复杂",
    },
    {
        category: "混杂类",
        name: "伤官配印",
        involved: "伤官 & 正印",
        requirements: [["伤官"], ["正印"]],
        description:
            "才华被学识与贵气收服，变得稳重而有深度",
    },
    {
        category: "混杂类",
        name: "劫财抗杀",
        involved: "劫财 & 七杀",
        requirements: [["劫财"], ["七杀"]],
        description:
            "兄弟联手抵御大压力，合作攻坚克难",
    },
];

export const BAZI_PATTERN_DEFINITIONS = Object.freeze(
    definitions.map((definition) => Object.freeze(definition)),
);

function getCountedTenGods(tenGodCounts = {}) {
    return Object.values(tenGodCounts ?? {}).flatMap((category) =>
        Object.entries(category ?? {}).map(([name, count = {}]) => {
            const total = Number(count?.total) || 0;
            const sourceTotal =
                (Number(count?.heavenlyStems) || 0) +
                (Number(count?.hiddenStems) || 0);

            return {
                name,
                total: Math.max(total, sourceTotal),
            };
        }),
    );
}

export function detectBaziPatterns({ tenGodCounts = {} } = {}) {
    const presentTraits = new Set(
        getCountedTenGods(tenGodCounts)
            .filter(({ total }) => total > 0)
            .map(({ name }) => name),
    );
    // 日主不参与十神统计，但始终是“比劫帮身/印星护身”的固定一方。
    presentTraits.add("日主");

    return BAZI_PATTERN_DEFINITIONS.filter((pattern) =>
        pattern.requirements.every((alternatives) =>
            alternatives.some((trait) => presentTraits.has(trait)),
        ),
    );
}

export function groupBaziPatterns(patterns) {
    return Object.fromEntries(
        BAZI_PATTERN_CATEGORIES.map((category) => [
            category,
            patterns.filter((pattern) => pattern.category === category),
        ]),
    );
}
