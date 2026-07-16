<script setup>
import { computed, ref, watch } from "vue";
import {
    ELEMENTS,
    PILLAR_KEYS,
    YEAR_RANGE,
    calculateBazi,
    daysInMonth,
} from "./lib/bazi";
import { getInitialFormValues } from "./lib/query";

const now = new Date();
const initialValues = getInitialFormValues(
    typeof window === "undefined" ? "" : window.location.search,
    now
);
const gender = ref(initialValues.gender);
const year = ref(initialValues.year);
const month = ref(initialValues.month);
const day = ref(initialValues.day);
const hour = ref(initialValues.hour);
const result = ref(null);
const errorMessage = ref("");

const years = Array.from(
    { length: YEAR_RANGE.max - YEAR_RANGE.min + 1 },
    (_, index) => YEAR_RANGE.min + index
);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const hours = Array.from({ length: 23 }, (_, index) => index + 1);
const dayOptions = computed(() =>
    Array.from(
        { length: daysInMonth(year.value, month.value) },
        (_, index) => index + 1
    )
);

const pillarLabels = {
    year: "年柱",
    month: "月柱",
    day: "日柱",
    hour: "时柱",
};

const tenGodNames = Object.freeze({
    印星: ["正印", "偏印"],
    官杀: ["正官", "七杀"],
    食伤: ["食神", "伤官"],
    财星: ["正财", "偏财"],
    比劫: ["比肩", "劫财"],
});

const tenGodClassNames = Object.freeze({
    印星: "element-wood",
    官杀: "element-fire",
    食伤: "element-earth",
    财星: "element-metal",
    比劫: "element-water",
});

const elementClassNames = Object.freeze({
    木: "element-wood",
    火: "element-fire",
    土: "element-earth",
    金: "element-metal",
    水: "element-water",
});

watch([year, month], () => {
    const maximumDay = daysInMonth(year.value, month.value);
    if (day.value > maximumDay) day.value = maximumDay;
});

function calculate() {
    errorMessage.value = "";

    try {
        result.value = calculateBazi({
            year: year.value,
            month: month.value,
            day: day.value,
            hour: hour.value,
            gender: gender.value,
        });
    } catch (error) {
        result.value = null;
        errorMessage.value =
            error instanceof Error ? error.message : "测算失败，请检查所选日期";
    }
}

</script>

<template>
    <div class="page-shell">
        <header class="hero">
            <p class="eyebrow">传统历法 · 四柱排盘</p>
            <h1>五行八字</h1>
            <p class="subtitle">选择出生日期与时辰，查看四柱、五行和十神分布</p>
        </header>

        <main>
            <section class="calculator-card" aria-labelledby="form-title">
                <h2 id="form-title" class="sr-only">出生信息</h2>

                <fieldset class="gender-fieldset">
                    <legend>性别</legend>
                    <div class="gender-switch">
                        <label :class="{ active: gender === 'male' }">
                            <input v-model="gender" type="radio" value="male" />
                            男
                        </label>
                        <label :class="{ active: gender === 'female' }">
                            <input
                                v-model="gender"
                                type="radio"
                                value="female"
                            />
                            女
                        </label>
                    </div>
                </fieldset>

                <div class="form-grid">
                    <label class="select-field">
                        <span>出生年</span>
                        <span class="select-wrap">
                            <select v-model="year" aria-label="出生年">
                                <option
                                    v-for="option in years"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }} 年
                                </option>
                            </select>
                        </span>
                    </label>

                    <label class="select-field">
                        <span>出生月</span>
                        <span class="select-wrap">
                            <select v-model="month" aria-label="出生月">
                                <option
                                    v-for="option in months"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }} 月
                                </option>
                            </select>
                        </span>
                    </label>

                    <label class="select-field">
                        <span>出生日</span>
                        <span class="select-wrap">
                            <select v-model="day" aria-label="出生日">
                                <option
                                    v-for="option in dayOptions"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }} 日
                                </option>
                            </select>
                        </span>
                    </label>

                    <label class="select-field">
                        <span>出生时</span>
                        <span class="select-wrap">
                            <select v-model="hour" aria-label="出生时">
                                <option
                                    v-for="option in hours"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }} 时
                                </option>
                            </select>
                        </span>
                    </label>

                    <button
                        type="button"
                        class="calculate-button"
                        @click="calculate"
                    >
                        <span>开始测算</span>
                        <span aria-hidden="true">→</span>
                    </button>
                </div>

                <p v-if="errorMessage" class="error-message" role="alert">
                    {{ errorMessage }}
                </p>
                <p class="range-tip">
                    农历数据由 lunisolar 提供，当前可测算至 2099 年。
                </p>
            </section>

            <section v-if="result" class="result-section" aria-live="polite">
                <div class="result-heading">
                    <div>
                        <p class="eyebrow">命盘结果</p>
                        <h2>{{ result.bazi }}</h2>
                    </div>
                    <p class="solar-date">公历 {{ result.dateText }}</p>
                </div>

                <div class="table-scroll">
                    <table>
                        <caption class="sr-only">
                            四柱排盘测算结果
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col">排盘</th>
                                <th
                                    v-for="key in PILLAR_KEYS"
                                    :key="key"
                                    scope="col"
                                >
                                    {{ pillarLabels[key] }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">农历</th>
                                <td v-for="key in PILLAR_KEYS" :key="key">
                                    {{ result.pillars[key].lunar }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">主星</th>
                                <td
                                    v-for="key in PILLAR_KEYS"
                                    :key="key"
                                    class="star-cell"
                                >
                                    {{ result.pillars[key].mainStar }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">天干</th>
                                <td v-for="key in PILLAR_KEYS" :key="key">
                                    <strong class="stem-detail">
                                        <span>{{ result.pillars[key].stem.name }}-</span>
                                        <span
                                            class="element-mark"
                                            :class="
                                                elementClassNames[
                                                    result.pillars[key].stem.element
                                                ]
                                            "
                                            >{{
                                                result.pillars[key].stem.element
                                            }}</span
                                        >
                                        <span
                                            >-{{
                                                result.pillars[key].stem.polarity
                                            }}</span
                                        >
                                    </strong>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">地支</th>
                                <td v-for="key in PILLAR_KEYS" :key="key">
                                    <strong class="stem-branch">{{
                                        result.pillars[key].branch.name
                                    }}</strong>
                                    <span
                                        class="element-mark"
                                        :class="
                                            elementClassNames[
                                                result.pillars[key].branch.element
                                            ]
                                        "
                                        >{{
                                            result.pillars[key].branch.element
                                        }}</span
                                    >
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">藏干</th>
                                <td v-for="key in PILLAR_KEYS" :key="key">
                                    <span
                                        v-for="hiddenStem in result.pillars[key]
                                            .hiddenStems"
                                        :key="hiddenStem.name"
                                        class="hidden-stem"
                                    >
                                        <span class="hidden-stem-detail">
                                            <span>{{ hiddenStem.name }}-</span>
                                            <span
                                                class="element-mark"
                                                :class="
                                                    elementClassNames[
                                                        hiddenStem.element
                                                    ]
                                                "
                                                >{{ hiddenStem.element }}</span
                                            >
                                            <span>-{{ hiddenStem.polarity }}</span>
                                        </span>
                                        <small>{{ hiddenStem.tenGod.name }}</small>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="summary-grid">
                    <article class="summary-card day-master-card">
                        <span class="summary-kicker">日主</span>
                        <h3>{{ result.dayMaster }}</h3>
                        <p>以日柱天干为命盘核心，推算其余干支的十神关系。</p>
                    </article>

                    <article class="summary-card">
                        <div class="card-title-row">
                            <h3>五行分布</h3>
                        </div>
                        <ul class="count-list element-list">
                            <li v-for="element in ELEMENTS" :key="element">
                                <span
                                    class="count-name"
                                    :class="elementClassNames[element]"
                                    ><i :class="elementClassNames[element]" />{{
                                        element
                                    }}</span
                                >
                                <span class="element-breakdown">
                                    总数<strong class="count-value">{{
                                        result.elementCounts[element].total
                                    }}</strong
                                    >个，天干<strong class="count-value">{{
                                        result.elementCounts[element]
                                            .heavenlyStems
                                    }}</strong
                                    >个，藏干<strong class="count-value">{{
                                        result.elementCounts[element].hiddenStems
                                    }}</strong
                                    >个
                                </span>
                            </li>
                        </ul>
                    </article>

                    <article class="summary-card ten-god-card">
                        <div class="card-title-row">
                            <h3>十神分布</h3>
                        </div>
                        <ul class="count-list ten-god-list">
                            <li
                                v-for="(names, category) in tenGodNames"
                                :key="category"
                            >
                                <span
                                    class="count-name"
                                    :class="tenGodClassNames[category]"
                                    >{{ category }}</span
                                >
                                <span class="ten-god-breakdown">
                                    <span v-for="name in names" :key="name">
                                        {{ name }}总数<strong class="count-value">{{
                                            result.tenGodCounts[category][name].total
                                        }}</strong
                                        >个，天干<strong class="count-value">{{
                                            result.tenGodCounts[category][name]
                                                .heavenlyStems
                                        }}</strong
                                        >个，藏干<strong class="count-value">{{
                                            result.tenGodCounts[category][name]
                                                .hiddenStems
                                        }}</strong
                                        >个
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </article>

                    <article class="summary-card pattern-card">
                        <div class="card-title-row">
                            <h3>八字格局</h3>
                        </div>

                        <div v-if="result.patterns.length" class="pattern-groups">
                            <section
                                v-for="(patterns, category) in result.patternGroups"
                                v-show="patterns.length"
                                :key="category"
                                class="pattern-group"
                            >
                                <h4>{{ category }}</h4>
                                <ul class="pattern-list">
                                    <li
                                        v-for="pattern in patterns"
                                        :key="pattern.name"
                                    >
                                        <strong>{{ pattern.name }}：</strong>
                                        <span>{{ pattern.description }}</span>
                                    </li>
                                </ul>
                            </section>
                        </div>
                        <p v-else class="pattern-empty">
                            未发现常见格局组合。
                        </p>

                        <p class="pattern-note">
                            格局结果按天干与藏干中的十神共现作简化归纳；实际吉凶仍需结合全局平衡、五行喜忌及具体命局判断。
                        </p>
                    </article>
                </div>
            </section>
        </main>

        <footer>五行八字排盘 · 结果仅供传统文化研究参考</footer>
    </div>
</template>
