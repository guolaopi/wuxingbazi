import lunisolar from "lunisolar";
import { detectBaziPatterns, groupBaziPatterns } from "./patterns";
import { getPreferenceItems } from "./preferences";
import {
    getDayMasterCommandStatus,
    getMonthCommand,
    getSeasonalState,
} from "./season";

export const YEAR_RANGE = Object.freeze({ min: 1901, max: 2099 });
export const LUNAR_SUPPORTED_RANGE = Object.freeze({ min: 1901, max: 2099 });
export const ELEMENTS = Object.freeze(["木", "火", "土", "金", "水"]);
export const PILLAR_KEYS = Object.freeze(["year", "month", "day", "hour"]);
export const HEAVENLY_STEMS = Object.freeze(
    "甲乙丙丁戊己庚辛壬癸".split("").map((name, index) =>
        Object.freeze({
            name,
            element: ELEMENTS[Math.floor(index / 2)],
            polarity: index % 2 === 0 ? "阳" : "阴",
        }),
    ),
);

export const TEN_GOD_RULES = Object.freeze({
    印星: Object.freeze({ relation: "生我者", same: "偏印", different: "正印" }),
    官杀: Object.freeze({ relation: "克我者", same: "七杀", different: "正官" }),
    食伤: Object.freeze({ relation: "我生者", same: "食神", different: "伤官" }),
    财星: Object.freeze({ relation: "我克者", same: "偏财", different: "正财" }),
    比劫: Object.freeze({ relation: "同我者", same: "比肩", different: "劫财" }),
});

const TEN_GOD_CATEGORIES_BY_ELEMENT_RELATION = Object.freeze([
    "比劫",
    "食伤",
    "财星",
    "官杀",
    "印星",
]);

export function daysInMonth(year, month) {
    return new Date(Number(year), Number(month), 0).getDate();
}

export function getStemAttributes(stem) {
    const attributes = HEAVENLY_STEMS[stem.value];
    if (!attributes) throw new RangeError("无效的天干索引");
    return attributes;
}

export function formatStem(stem) {
    const { name, element, polarity } = getStemAttributes(stem);
    return `${name}-${element}-${polarity}`;
}

export function getTenGodDetail(dayStem, targetStem) {
    const elementRelation =
        (targetStem.e5.value - dayStem.e5.value + 5) % 5;
    const category = TEN_GOD_CATEGORIES_BY_ELEMENT_RELATION[elementRelation];
    const rule = TEN_GOD_RULES[category];
    const samePolarity =
        getStemAttributes(targetStem).polarity ===
        getStemAttributes(dayStem).polarity;

    return {
        category,
        relation: rule.relation,
        polarityRelation: samePolarity ? "同阴阳" : "异阴阳",
        name: samePolarity ? rule.same : rule.different,
    };
}

export function getTenGod(dayStem, targetStem) {
    return getTenGodDetail(dayStem, targetStem).name;
}

function getElementCounts(char8) {
    const counts = Object.fromEntries(
        ELEMENTS.map((element) => [
            element,
            { total: 0, heavenlyStems: 0, hiddenStems: 0 },
        ]),
    );

    const addElement = (element, source) => {
        counts[element][source] += 1;
        counts[element].total += 1;
    };

    PILLAR_KEYS.forEach((key) => {
        addElement(char8[key].stem.e5.name, "heavenlyStems");
        char8[key].branch.hiddenStems.forEach((stem) => {
            addElement(stem.e5.name, "hiddenStems");
        });
    });

    return counts;
}

function getTenGodCounts(char8) {
    const dayStem = char8.day.stem;
    const counts = Object.fromEntries(
        Object.entries(TEN_GOD_RULES).map(([category, rule]) => [
            category,
            Object.fromEntries(
                [rule.same, rule.different].map((name) => [
                    name,
                    { total: 0, heavenlyStems: 0, hiddenStems: 0 },
                ]),
            ),
        ]),
    );
    const visibleStems = PILLAR_KEYS.filter((key) => key !== "day").map(
        (key) => char8[key].stem,
    );
    const hiddenStems = PILLAR_KEYS.flatMap(
        (key) => char8[key].branch.hiddenStems,
    );

    const addTenGod = (stem, source) => {
        const { category, name } = getTenGodDetail(dayStem, stem);
        counts[category][name][source] += 1;
        counts[category][name].total += 1;
    };

    visibleStems.forEach((stem) => addTenGod(stem, "heavenlyStems"));
    hiddenStems.forEach((stem) => addTenGod(stem, "hiddenStems"));

    return counts;
}

function createPillar(char8, key, dayStem, gender, monthElement) {
    const pillar = char8[key];
    const stemAttributes = getStemAttributes(pillar.stem);
    const stemTenGod =
        key === "day"
            ? null
            : {
                  ...getTenGodDetail(dayStem, pillar.stem),
                  element: stemAttributes.element,
                  seasonalState: getSeasonalState(
                      stemAttributes.element,
                      monthElement,
                  ),
              };

    return {
        key,
        name: pillar.toString(),
        mainStar:
            key === "day"
                ? `元${gender === "male" ? "男" : "女"}`
                : stemTenGod.name,
        stem: {
            ...stemAttributes,
            display: formatStem(pillar.stem),
            tenGod: stemTenGod,
        },
        branch: {
            name: pillar.branch.toString(),
            element: pillar.branch.e5.name,
        },
        hiddenStems: pillar.branch.hiddenStems.map((stem) => {
            const attributes = getStemAttributes(stem);
            const tenGod = {
                ...getTenGodDetail(dayStem, stem),
                element: attributes.element,
                seasonalState: getSeasonalState(
                    attributes.element,
                    monthElement,
                ),
            };
            return {
                ...attributes,
                display: formatStem(stem),
                tenGod,
            };
        }),
    };
}

export function calculateBazi({ year, month, day, hour, gender }) {
    const numericYear = Number(year);
    if (numericYear > LUNAR_SUPPORTED_RANGE.max) {
        throw new RangeError(
            `lunisolar 农历数据目前仅支持到 ${LUNAR_SUPPORTED_RANGE.max} 年`,
        );
    }

    const dateText = `${numericYear}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:00`;
    const date = lunisolar(dateText);
    const { char8, lunar } = date;
    const dayStem = char8.day.stem;
    const monthCommand = getMonthCommand(char8.month.branch.toString());
    const dayMasterCommandStatus = getDayMasterCommandStatus(
        dayStem.e5,
        monthCommand.element,
    );
    const pillars = Object.fromEntries(
        PILLAR_KEYS.map((key) => [
            key,
            createPillar(
                char8,
                key,
                dayStem,
                gender,
                monthCommand.element,
            ),
        ]),
    );

    pillars.year.lunar = `${char8.year.toString()}年`;
    pillars.month.lunar = lunar.getMonthName();
    pillars.day.lunar = lunar.getDayName();
    pillars.hour.lunar = `${lunar.getHourName()}时`;
    const tenGodCounts = getTenGodCounts(char8);
    const patterns = detectBaziPatterns({
        tenGodCounts,
        dayStemName: dayStem.toString(),
        branchNames: PILLAR_KEYS.map((key) =>
            char8[key].branch.toString(),
        ),
        gender,
    });

    return {
        dateText,
        bazi: date.format("cY cM cD cH"),
        dayMaster: formatStem(dayStem),
        preferenceItems: getPreferenceItems(dayStem.e5),
        monthCommand,
        dayMasterCommandStatus,
        pillars,
        elementCounts: getElementCounts(char8),
        tenGodCounts,
        tenGodTotal: Object.values(tenGodCounts)
            .flatMap((category) => Object.values(category))
            .reduce((total, count) => total + count.total, 0),
        patterns,
        patternGroups: groupBaziPatterns(patterns),
    };
}
