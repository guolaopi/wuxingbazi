export const BAZI_PATTERN_CATEGORIES = Object.freeze([
    "吉格 / 顺境类",
    "凶格 / 逆境类",
    "杂格 / 可变类",
]);

const definitions = [
    {
        category: "吉格 / 顺境类",
        name: "官印相生",
        involved: "正官 & 正印",
        requirements: [["正官"], ["正印"]],
        description:
            "贵气之格，主清贵、廉洁、有权威，品行端正，易得长辈提携或官方赏识。",
    },
    {
        category: "吉格 / 顺境类",
        name: "财官双美",
        involved: "正官 & 正财",
        requirements: [["正官"], ["正财"]],
        description:
            "富贵之格，主守法守信，通过正当事业致富，家庭事业两相宜。",
    },
    {
        category: "吉格 / 顺境类",
        name: "食神佩印",
        involved: "食神 & 正印",
        requirements: [["食神"], ["正印"]],
        description:
            "贵格，主温文尔雅，才华得以正用，在文化、教育领域易获声望。",
    },
    {
        category: "吉格 / 顺境类",
        name: "食神生财",
        involved: "食神 & 正财",
        requirements: [["食神"], ["正财"]],
        description:
            "富格，主以技艺、口才生财，财源安稳，是稳健的创业者或专业人士。",
    },
    {
        category: "吉格 / 顺境类",
        name: "伤官生财",
        involved: "伤官 & 偏财",
        requirements: [["伤官"], ["偏财"]],
        description:
            "富格，主以智谋、创新求财，思维活跃，善于发现商机，能获暴利。",
    },
    {
        category: "吉格 / 顺境类",
        name: "食神制杀",
        involved: "食神 & 七杀",
        requirements: [["食神"], ["七杀"]],
        description:
            "大贵之格，主以智谋、技艺驾驭权威与压力，化杀为权，在高压领域成就非凡。",
    },
    {
        category: "吉格 / 顺境类",
        name: "羊刃驾杀",
        involved: "七杀 & 羊刃",
        requirements: [["七杀"], ["羊刃"]],
        description:
            "武贵之格，主刚猛、权威，羊刃与七杀相互制约，反成大器，多成就于竞争激烈的环境。",
    },
    {
        category: "吉格 / 顺境类",
        name: "杀印相生",
        involved: "七杀 & 正印",
        requirements: [["七杀"], ["正印"]],
        description:
            "化杀为权之格，主有力、有谋略，七杀的压力被正印转化，变为学识与权威。",
    },
    {
        category: "吉格 / 顺境类",
        name: "伤官配印",
        involved: "伤官 & 正印",
        requirements: [["伤官"], ["正印"]],
        description:
            "贵格，主才华横溢而不张扬，叛逆被正印约束，使才华循正途发挥。",
    },
    {
        category: "吉格 / 顺境类",
        name: "财滋弱杀",
        involved: "偏财 & 七杀",
        requirements: [["偏财"], ["七杀"]],
        description:
            "富而后贵之格，以财富滋养七杀权威，用金钱或资源换取地位与权力。",
    },
    {
        category: "凶格 / 逆境类",
        name: "伤官见官",
        involved: "伤官 & 正官",
        requirements: [["伤官"], ["正官"]],
        description:
            "大凶之格，主悖逆、官非、口舌，挑战规则与权威，事业多阻，女命不利婚姻。",
    },
    {
        category: "凶格 / 逆境类",
        name: "枭神夺食",
        involved: "偏印 & 食神",
        requirements: [["偏印"], ["食神"]],
        description:
            "大凶之格，主困顿、灾病，才思受堵，福气被克，易有饮食问题、精神抑郁等。",
    },
    {
        category: "凶格 / 逆境类",
        name: "群比夺财",
        involved: "劫财 & 财星",
        requirements: [["劫财"], ["正财", "偏财"]],
        description:
            "破格，主破财、克妻或克父，易因合作、担保等事导致财富被分夺。",
    },
    {
        category: "凶格 / 逆境类",
        name: "官杀混杂",
        involved: "正官 & 七杀",
        requirements: [["正官"], ["七杀"]],
        description:
            "浊格，主心性不定、事业驳杂、感情混乱，女命尤主婚姻不顺。",
    },
    {
        category: "凶格 / 逆境类",
        name: "财星坏印",
        involved: "偏财 & 正印",
        requirements: [["偏财"], ["正印"]],
        description:
            "破格，主贪财毁誉、背信弃义，为利益放弃原则，损害贵人运。",
    },
    {
        category: "凶格 / 逆境类",
        name: "比劫争夫",
        involved: "劫财 & 正官",
        requirements: [["劫财"], ["正官"]],
        gender: "female",
        description:
            "婚姻破格，主丈夫被夺，情路竞争，易遇第三者。",
    },
    {
        category: "杂格 / 可变类",
        name: "伤官合杀",
        involved: "伤官 & 七杀",
        requirements: [["伤官"], ["七杀"]],
        description:
            "以凶制凶之格，主智慧、权威与手段，用才智合制七杀凶暴，成败起伏大。",
    },
    {
        category: "杂格 / 可变类",
        name: "弃命从财",
        involved: "日主极弱 & 满盘财星",
        allTenGodsIn: ["正财", "偏财"],
        description:
            "从格，主大富，日主放弃自身属性顺从财星，能获巨大财富，但六亲缘薄。",
    },
    {
        category: "杂格 / 可变类",
        name: "弃命从杀",
        involved: "日主极弱 & 满盘官杀",
        allTenGodsIn: ["正官", "七杀"],
        description:
            "从格，主大贵，日主顺从官杀旺势，能获极高地位与权威，但心性压力巨大。",
    },
];

export const BAZI_PATTERN_DEFINITIONS = Object.freeze(
    definitions.map((definition) => Object.freeze(definition)),
);

const YANG_BLADE_BRANCH_BY_DAY_STEM = Object.freeze({
    甲: "卯",
    乙: "寅",
    丙: "午",
    丁: "巳",
    戊: "午",
    己: "巳",
    庚: "酉",
    辛: "申",
    壬: "子",
    癸: "亥",
});

function getCountedTenGods(tenGodCounts) {
    return Object.values(tenGodCounts).flatMap((category) =>
        Object.entries(category).map(([name, count]) => ({
            name,
            total: count.total,
        })),
    );
}

export function detectBaziPatterns({
    tenGodCounts,
    dayStemName,
    branchNames,
    gender,
}) {
    const countedTenGods = getCountedTenGods(tenGodCounts);
    const presentTraits = new Set(
        countedTenGods
            .filter(({ total }) => total > 0)
            .map(({ name }) => name),
    );
    const bladeBranch = YANG_BLADE_BRANCH_BY_DAY_STEM[dayStemName];
    if (bladeBranch && branchNames.includes(bladeBranch)) {
        presentTraits.add("羊刃");
    }

    return BAZI_PATTERN_DEFINITIONS.filter((pattern) => {
        if (pattern.gender && pattern.gender !== gender) return false;

        if (pattern.allTenGodsIn) {
            const total = countedTenGods.reduce(
                (sum, tenGod) => sum + tenGod.total,
                0,
            );
            return (
                total > 0 &&
                countedTenGods.every(
                    ({ name, total: count }) =>
                        count === 0 || pattern.allTenGodsIn.includes(name),
                )
            );
        }

        return pattern.requirements.every((alternatives) =>
            alternatives.some((trait) => presentTraits.has(trait)),
        );
    });
}

export function groupBaziPatterns(patterns) {
    return Object.fromEntries(
        BAZI_PATTERN_CATEGORIES.map((category) => [
            category,
            patterns.filter((pattern) => pattern.category === category),
        ]),
    );
}

