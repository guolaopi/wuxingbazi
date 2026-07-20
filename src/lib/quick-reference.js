function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) {
        return value;
    }

    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
}

export const QUICK_REFERENCE_ELEMENTS = deepFreeze([
    "木",
    "火",
    "土",
    "金",
    "水",
]);

export const WUXING_REFERENCE_ROWS = deepFreeze([
    {
        category: "阳天干",
        values: { 木: "甲", 火: "丙", 土: "戊", 金: "庚", 水: "壬" },
    },
    {
        category: "阴天干",
        values: { 木: "乙", 火: "丁", 土: "己", 金: "辛", 水: "癸" },
    },
    {
        category: "地支",
        values: {
            木: "寅、卯、辰（余气）",
            火: "巳、午、未（余气）",
            土: "辰、戌、丑、未（本气）",
            金: "申、酉、戌（余气）",
            水: "亥、子、丑（余气）",
        },
    },
    {
        category: "后天八卦",
        values: {
            木: ["震（☳）东", "巽（☴）东南"],
            火: "离（☲）南",
            土: ["坤（☷）西南", "艮（☶）东北"],
            金: ["兑（☱）西", "乾（☰）西北"],
            水: "坎（☵）北",
        },
    },
    {
        category: "方位",
        values: {
            木: "东方、东南方",
            火: "南方",
            土: "中央、西南、东北",
            金: "西方、西北方",
            水: "北方",
        },
    },
    {
        category: "季节",
        values: {
            木: "春（正月、二月）",
            火: "夏（四月、五月）",
            土: "长夏（四季末各18天）",
            金: "秋（七月、八月）",
            水: "冬（十月、十一月）",
        },
    },
    {
        category: "颜色",
        values: {
            木: "青、绿、碧",
            火: "红、赤、紫、橙",
            土: "黄、棕、米、咖",
            金: "白、银、灰、金",
            水: "黑、蓝、深灰",
        },
    },
    {
        category: "身体（五脏）",
        values: {
            木: "肝、胆",
            火: "心、小肠",
            土: "脾、胃",
            金: "肺、大肠",
            水: "肾、膀胱",
        },
    },
    {
        category: "身体（五官/组织）",
        values: {
            木: "眼睛、筋骨、指甲",
            火: "舌头、血脉、脸色",
            土: "嘴唇、肌肉、四肢",
            金: "鼻子、皮毛、牙齿",
            水: "耳朵、骨髓、头发",
        },
    },
    {
        category: "情志（中医）",
        values: { 木: "怒", 火: "喜", 土: "思", 金: "悲", 水: "恐" },
    },
    {
        category: "五味",
        values: {
            木: "酸",
            火: "苦",
            土: "甘（甜）",
            金: "辛（辣）",
            水: "咸",
        },
    },
    {
        category: "五常（伦理）",
        values: { 木: "仁", 火: "礼", 土: "信", 金: "义", 水: "智" },
    },
]);

export const TEN_GOD_REFERENCE_ROWS = deepFreeze([
    {
        category: "印星",
        relation: "生我者",
        names: [
            { name: "正印", qualifier: "（阴阳相异）" },
            { name: "偏印 / 枭神", qualifier: "（阴阳相同）" },
        ],
        analogies: [
            { name: "正印", text: "=亲妈，无私对你，给你知识、庇护、学历；" },
            {
                name: "偏印",
                text: "=后妈/继母，给你技能但有点冷，容易让你钻牛角尖。",
            },
        ],
    },
    {
        category: "官杀",
        relation: "克我者",
        names: [
            { name: "正官", qualifier: "（阴阳相异）" },
            { name: "七杀 / 偏官", qualifier: "（阴阳相同）" },
        ],
        analogies: [
            {
                name: "正官",
                text: "=慈父/直属领导，管你但讲道理，给你规则和晋升；",
            },
            {
                name: "七杀",
                text: "=严厉教官/大反派，管得狠，压力大，但能逼你成长。",
            },
        ],
    },
    {
        category: "食伤",
        relation: "我生者",
        names: [
            { name: "伤官", qualifier: "（阴阳相异）" },
            { name: "食神", qualifier: "（阴阳相同）" },
        ],
        analogies: [
            {
                name: "伤官",
                text: "=才子/艺术家，聪明、傲气、表达犀利，容易得罪人；",
            },
            {
                name: "食神",
                text: "=美食家/开心果，温和、有口福、懂享受、人缘好。",
            },
        ],
    },
    {
        category: "财星",
        relation: "我克者",
        names: [
            { name: "正财", qualifier: "（阴阳相异）" },
            { name: "偏财", qualifier: "（阴阳相同）" },
        ],
        analogies: [
            {
                name: "正财",
                text: "=工资/结发妻子，稳定、细水长流、靠劳力换；",
            },
            {
                name: "偏财",
                text: "=外快/情人/奖金，来路广、数额大但波动大，靠机遇。",
            },
        ],
    },
    {
        category: "比劫",
        relation: "同我者",
        names: [
            { name: "比肩", qualifier: "（阴阳相同）" },
            { name: "劫财", qualifier: "（阴阳相异）" },
        ],
        analogies: [
            {
                name: "比肩",
                text: "=亲兄弟/闺蜜，公平竞争，帮你但也要分你一杯羹；",
            },
            {
                name: "劫财",
                text: "=酒肉朋友/竞争者，跟你抢资源，但关键时候能出力。",
            },
        ],
    },
]);

export const PATTERN_REFERENCE_GROUPS = deepFreeze([
    {
        type: "生类",
        rows: [
            {
                name: "杀印相生",
                tenGods: "七杀 + 正印/偏印",
                meaning: "压力逼你读书考证，化敌为友",
                tendency: "大吉",
            },
            {
                name: "官印相生",
                tenGods: "正官 + 正印/偏印",
                meaning: "领导赏识你，还给你资源",
                tendency: "大吉",
            },
            {
                name: "食神生财",
                tenGods: "食神 + 正财/偏财",
                meaning: "靠手艺、口才、技术稳赚钱",
                tendency: "吉",
            },
            {
                name: "伤官生财",
                tenGods: "伤官 + 正财/偏财",
                meaning: "靠创意、冒险、偏门赚大钱",
                tendency: "吉（但波动大）",
            },
            {
                name: "财生官杀",
                tenGods: "正财/偏财 + 正官/七杀",
                meaning: "用钱开路换地位，或娶妻得贵",
                tendency: "吉（但累）",
            },
        ],
    },
    {
        type: "克/制类",
        rows: [
            {
                name: "食神制杀",
                tenGods: "食神 + 七杀",
                meaning: "用智慧化解大压力",
                tendency: "吉（能力体现）",
            },
            {
                name: "伤官见官",
                tenGods: "伤官 + 正官",
                meaning: "才子顶撞领导，容易惹事",
                tendency: "凶",
            },
            {
                name: "比劫夺财",
                tenGods: "比肩/劫财 + 正财/偏财",
                meaning: "兄弟/朋友分走你的钱",
                tendency: "凶",
            },
            {
                name: "财星坏印",
                tenGods: "正财/偏财 + 正印/偏印",
                meaning: "为了赚钱放弃学历/名声/原则",
                tendency: "凶",
            },
            {
                name: "枭神夺食",
                tenGods: "偏印 + 食神",
                meaning: "后妈抢你饭碗，煮熟的鸭子飞了",
                tendency: "凶",
            },
        ],
    },
    {
        type: "同/助类",
        rows: [
            {
                name: "比劫帮身",
                tenGods: "比肩/劫财 + 日主（本身）",
                meaning: "朋友、兄弟姐妹、同事来帮你分担",
                tendency: "吉（身弱时）",
            },
            {
                name: "印星护身",
                tenGods: "正印/偏印 + 日主（本身）",
                meaning: "有贵人、有证书、有房子给你安全感",
                tendency: "大吉",
            },
            {
                name: "官星护财",
                tenGods: "正官/七杀 + 财星",
                meaning: "有了地位守住财，或老公管住钱不乱花",
                tendency: "吉",
            },
        ],
    },
    {
        type: "混杂类",
        rows: [
            {
                name: "官杀混杂",
                tenGods: "正官 + 七杀同时出现",
                meaning: "多个领导同时管你，两头受气",
                tendency: "凶",
            },
            {
                name: "伤官配印",
                tenGods: "伤官 + 正印（特指正印）",
                meaning: "才气被学识压制，变得稳重而贵气",
                tendency: "大吉",
            },
            {
                name: "食神制杀",
                tenGods: "食神 + 七杀",
                meaning: "智取压力",
                tendency: "吉",
            },
            {
                name: "劫财抗杀",
                tenGods: "劫财 + 七杀",
                meaning: "兄弟联手对抗大压力",
                tendency: "吉（但苦）",
            },
        ],
    },
]);

export const STEM_COMBINATION_ROWS = deepFreeze([
    {
        type: "甲己合土（甲合己）",
        dayMaster: "己土（阴）",
        partner: "甲木（阳）",
        result: "土",
        interpretation:
            "规则、权威、丈夫、事业与你天然绑定，你本能地“认同秩序”。",
        fortune: "日主弱则得助，日主强则被羁绊",
    },
    {
        type: "甲己合土（己合甲）",
        dayMaster: "甲木（阳）",
        partner: "己土（阴）",
        result: "土",
        interpretation: "你主动包容规则或伴侣，愿意为稳定付出。",
        fortune: "日主强则化土成功，日主弱则反被拖累",
    },
    {
        type: "乙庚合金（庚合乙）",
        dayMaster: "乙木（阴）",
        partner: "庚金（阳）",
        result: "金",
        interpretation: "你容易被强势的人或权威吸引，为正义感而妥协。",
        fortune: "身强则合化得权，身弱则被克",
    },
    {
        type: "乙庚合金（乙合庚）",
        dayMaster: "庚金（阳）",
        partner: "乙木（阴）",
        result: "金",
        interpretation: "你以柔克刚，用智慧或情商收服外界规则。",
        fortune: "金旺则成器，木旺则合而不化",
    },
    {
        type: "丙辛合水（辛合丙）",
        dayMaster: "丙火（阳）",
        partner: "辛金（阴）",
        result: "水",
        interpretation: "你为情感或利益而降温，容易在关系中妥协锋芒。",
        fortune: "化水则智，不化则纠结",
    },
    {
        type: "丙辛合水（丙合辛）",
        dayMaster: "辛金（阴）",
        partner: "丙火（阳）",
        result: "水",
        interpretation: "你容易被才华或热情感染，甘愿为欣赏而放下自我。",
        fortune: "水旺则通，火旺则争",
    },
    {
        type: "丁壬合木（壬合丁）",
        dayMaster: "丁火（阴）",
        partner: "壬水（阳）",
        result: "木",
        interpretation: "你与外界规则或男性之间有温柔的羁绊，为理想而妥协。",
        fortune: "木旺则仁，水旺则浮",
    },
    {
        type: "丁壬合木（丁合壬）",
        dayMaster: "壬水（阳）",
        partner: "丁火（阴）",
        result: "木",
        interpretation: "你主动用理性或情感驯化规则，适合管理与创意结合。",
        fortune: "木旺则达，火旺则躁",
    },
    {
        type: "戊癸合火（癸合戊）",
        dayMaster: "戊土（阳）",
        partner: "癸水（阴）",
        result: "火",
        interpretation: "你在责任与欲望之间拉扯，为稳定或财富付出情感。",
        fortune: "火旺则明，土旺则滞",
    },
    {
        type: "戊癸合火（戊合癸）",
        dayMaster: "癸水（阴）",
        partner: "戊土（阳）",
        result: "火",
        interpretation: "你容易为现实利益或安全感而合，需要警惕因财失义。",
        fortune: "火旺则贵，水旺则孤",
    },
]);

export const BRANCH_PAIR_ROWS = deepFreeze([
    {
        day: "子",
        partner: "丑",
        result: "土",
        interpretation:
            "你与伴侣之间容易黏在一起，但也可能因过度依赖而失去自我。",
    },
    {
        day: "丑",
        partner: "子",
        result: "土",
        interpretation: "你愿意为婚姻付出实际资源，但也容易变得保守。",
    },
    {
        day: "寅",
        partner: "亥",
        result: "木",
        interpretation: "伴侣是你的引路人，你们的关系像师生，共同成长。",
    },
    {
        day: "亥",
        partner: "寅",
        result: "木",
        interpretation: "你主动为关系注入智慧和策略，婚姻中斗而不破。",
    },
    {
        day: "卯",
        partner: "戌",
        result: "火",
        interpretation: "关系中有强烈的化学反应，但吵架时也很激烈。",
    },
    {
        day: "戌",
        partner: "卯",
        result: "火",
        interpretation: "你为关系注入热情和行动力，但也容易因太主动而失衡。",
    },
    {
        day: "辰",
        partner: "酉",
        result: "金",
        interpretation:
            "婚姻讲规则、讲分工，像商业合作伙伴，效率高但感情偏冷。",
    },
    {
        day: "酉",
        partner: "辰",
        result: "金",
        interpretation: "你主导关系节奏，习惯用讲道理代替谈感情。",
    },
    {
        day: "巳",
        partner: "申",
        result: "水",
        interpretation: "夫妻之间斗智斗勇，但互相欣赏对方的聪明。",
    },
    {
        day: "申",
        partner: "巳",
        result: "水",
        interpretation: "你善于在关系中制造惊喜和变化，但也容易让对方跟不上。",
    },
    {
        day: "午",
        partner: "未",
        result: "土/火",
        interpretation: "你为婚姻付出大量情感，容易燃烧自己照亮对方。",
    },
    {
        day: "未",
        partner: "午",
        result: "土/火",
        interpretation: "你习惯用照顾来表达爱，但对方可能觉得你控制欲强。",
    },
]);

export const THREE_HARMONY_ROWS = deepFreeze([
    {
        name: "申子辰合水",
        members: "申 + 子 + 辰",
        result: "水",
        core: "子（水帝旺）",
        interpretation: "智慧、流动、财源广进，但也代表漂泊不定。",
    },
    {
        name: "亥卯未合木",
        members: "亥 + 卯 + 未",
        result: "木",
        core: "卯（木帝旺）",
        interpretation: "生长、扩张、人脉壮大，但也容易过度乐观。",
    },
    {
        name: "寅午戌合火",
        members: "寅 + 午 + 戌",
        result: "火",
        core: "午（火帝旺）",
        interpretation: "热情、名声、爆发力强，但也容易急躁冲动。",
    },
    {
        name: "巳酉丑合金",
        members: "巳 + 酉 + 丑",
        result: "金",
        core: "酉（金帝旺）",
        interpretation: "决断、变革、权威确立，但也容易冷酷偏执。",
    },
]);

export const THREE_MEETING_ROWS = deepFreeze([
    {
        name: "寅卯辰会木",
        members: "寅 + 卯 + 辰",
        result: "木",
        season: "春季（正二三月）",
        interpretation: "团队、家族、根基雄厚，但也容易固执排外。",
    },
    {
        name: "巳午未会火",
        members: "巳 + 午 + 未",
        result: "火",
        season: "夏季（四五六月）",
        interpretation: "名声、舞台、曝光度高，但也容易树大招风。",
    },
    {
        name: "申酉戌会金",
        members: "申 + 酉 + 戌",
        result: "金",
        season: "秋季（七八九月）",
        interpretation: "权力、制度、执行力强，但也容易刻薄寡恩。",
    },
    {
        name: "亥子丑会水",
        members: "亥 + 子 + 丑",
        result: "水",
        season: "冬季（十十一十二月）",
        interpretation: "资源、人脉、暗流涌动，但也容易沉溺安逸。",
    },
]);
