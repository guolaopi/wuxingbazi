import { describe, expect, it } from "vitest";
import {
    PATTERN_REFERENCE_GROUPS,
    QUICK_REFERENCE_ELEMENTS,
    TEN_GOD_REFERENCE_ROWS,
    WUXING_REFERENCE_ROWS,
} from "./quick-reference";

describe("速查表静态数据", () => {
    it("完整保存五行全息对应表的五列和十二行", () => {
        expect(QUICK_REFERENCE_ELEMENTS).toEqual([
            "木",
            "火",
            "土",
            "金",
            "水",
        ]);
        expect(WUXING_REFERENCE_ROWS).toHaveLength(12);
        expect(WUXING_REFERENCE_ROWS).toEqual([
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

        WUXING_REFERENCE_ROWS.forEach(({ values }) => {
            expect(Object.keys(values)).toEqual(QUICK_REFERENCE_ELEMENTS);
        });
    });

    it("使用字符串数组保存五行表中的多行八卦单元格", () => {
        const bagua = WUXING_REFERENCE_ROWS.find(
            ({ category }) => category === "后天八卦",
        );
        expect(bagua.values.木).toEqual(["震（☳）东", "巽（☴）东南"]);
        expect(bagua.values.土).toEqual(["坤（☷）西南", "艮（☶）东北"]);
        expect(bagua.values.金).toEqual(["兑（☱）西", "乾（☰）西北"]);
        expect(bagua.values.火).toBe("离（☲）南");
        expect(bagua.values.水).toBe("坎（☵）北");
    });

    it("完整保存五行十神表的五行术语和通俗比喻", () => {
        expect(TEN_GOD_REFERENCE_ROWS).toHaveLength(5);
        expect(TEN_GOD_REFERENCE_ROWS).toEqual([
            {
                category: "印星",
                relation: "生我者",
                names: [
                    { name: "正印", qualifier: "（阴阳相异）" },
                    { name: "偏印 / 枭神", qualifier: "（阴阳相同）" },
                ],
                analogies: [
                    {
                        name: "正印",
                        text: "=亲妈，无私对你，给你知识、庇护、学历；",
                    },
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
    });

    it("按四个组合类型完整保存格局组合表的十七行", () => {
        expect(PATTERN_REFERENCE_GROUPS.map(({ type }) => type)).toEqual([
            "生类",
            "克/制类",
            "同/助类",
            "混杂类",
        ]);
        expect(PATTERN_REFERENCE_GROUPS.map(({ rows }) => rows.length)).toEqual(
            [5, 5, 3, 4],
        );
        expect(
            PATTERN_REFERENCE_GROUPS.flatMap(({ rows }) => rows),
        ).toHaveLength(17);
        expect(PATTERN_REFERENCE_GROUPS).toEqual([
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
    });

    it("深度冻结全部速查数据，避免运行时意外改写", () => {
        const allNodesFrozen = (value) => {
            if (!value || typeof value !== "object") return true;
            return (
                Object.isFrozen(value) &&
                Object.values(value).every(allNodesFrozen)
            );
        };

        expect(allNodesFrozen(QUICK_REFERENCE_ELEMENTS)).toBe(true);
        expect(allNodesFrozen(WUXING_REFERENCE_ROWS)).toBe(true);
        expect(allNodesFrozen(TEN_GOD_REFERENCE_ROWS)).toBe(true);
        expect(allNodesFrozen(PATTERN_REFERENCE_GROUPS)).toBe(true);
    });
});
