<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import {
    ELEMENTS,
    PILLAR_KEYS,
    YEAR_RANGE,
    calculateBazi,
    daysInMonth,
} from "./lib/bazi";
import {
    PATTERN_REFERENCE_GROUPS,
    QUICK_REFERENCE_ELEMENTS,
    TEN_GOD_REFERENCE_ROWS,
    WUXING_REFERENCE_ROWS,
    STEM_COMBINATION_ROWS,
    BRANCH_PAIR_ROWS,
    THREE_HARMONY_ROWS,
    THREE_MEETING_ROWS,
} from "./lib/quick-reference";
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
const toastMessage = ref("");
const resultSection = ref(null);
const isSavingImage = ref(false);
const quickReferenceTrigger = ref(null);
const quickReferenceDialog = ref(null);
const quickReferenceCloseButton = ref(null);
const isQuickReferenceOpen = ref(false);
let toastTimer;
let quickReferenceReturnFocus;
let bodyScrollLock;

const years = Array.from(
    { length: YEAR_RANGE.max - YEAR_RANGE.min + 1 },
    (_, index) => YEAR_RANGE.min + index
);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const hours = Array.from({ length: 24 }, (_, index) => index);
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

function showToast(message) {
    toastMessage.value = message;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
        toastMessage.value = "";
    }, 2000);
}

onBeforeUnmount(() => {
    window.clearTimeout(toastTimer);
    if (quickReferenceDialog.value?.open) {
        quickReferenceDialog.value.close();
    }
    restorePageScroll();
});

async function calculate() {
    errorMessage.value = "";

    try {
        result.value = calculateBazi({
            year: year.value,
            month: month.value,
            day: day.value,
            hour: hour.value,
            gender: gender.value,
        });
        await nextTick();
        if (typeof window !== "undefined") {
            showToast("测算结果请滑动页面查看");
        }
    } catch (error) {
        result.value = null;
        errorMessage.value =
            error instanceof Error ? error.message : "测算失败，请检查所选日期";
    }
}

function lockPageScroll() {
    if (bodyScrollLock || typeof document === "undefined") return;

    const body = document.body;
    const scrollbarWidth = Math.max(
        0,
        window.innerWidth - document.documentElement.clientWidth
    );
    const currentPaddingRight =
        Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    bodyScrollLock = {
        scrollY: window.scrollY,
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
    };

    body.style.position = "fixed";
    body.style.top = `-${bodyScrollLock.scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
        body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }
}

function restorePageScroll() {
    if (!bodyScrollLock || typeof document === "undefined") return;

    const body = document.body;
    const { scrollY, ...styles } = bodyScrollLock;

    Object.assign(body.style, styles);
    bodyScrollLock = null;
    window.scrollTo(0, scrollY);
}

async function openQuickReference() {
    const dialog = quickReferenceDialog.value;
    if (!dialog || dialog.open) return;

    quickReferenceReturnFocus = document.activeElement;
    isQuickReferenceOpen.value = true;
    lockPageScroll();

    try {
        dialog.showModal();
        await nextTick();
        quickReferenceCloseButton.value?.focus();
    } catch (error) {
        console.error("打开速查弹窗失败", error);
        isQuickReferenceOpen.value = false;
        restorePageScroll();
        showToast("速查弹窗打开失败，请稍后重试");
    }
}

function closeQuickReference() {
    if (quickReferenceDialog.value?.open) {
        quickReferenceDialog.value.close();
        return;
    }

    handleQuickReferenceClosed();
}

function handleQuickReferenceBackdrop(event) {
    if (event.target !== event.currentTarget) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const clickedInsideDialog =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

    if (!clickedInsideDialog) closeQuickReference();
}

function handleQuickReferenceClosed() {
    const returnFocus =
        quickReferenceReturnFocus || quickReferenceTrigger.value;

    isQuickReferenceOpen.value = false;
    quickReferenceReturnFocus = null;
    restorePageScroll();
    nextTick(() => returnFocus?.focus?.());
}

function getReferenceCellLines(value) {
    return Array.isArray(value) ? value : [value];
}

function getTendencyClass(tendency) {
    return tendency.includes("凶")
        ? "quick-reference-tendency-negative"
        : "quick-reference-tendency-positive";
}

function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
                return;
            }

            reject(new Error("无法生成图片文件"));
        }, "image/png");
    });
}

function getResultImageFileName() {
    const safeDateText = (result.value?.dateText || "命盘结果")
        .trim()
        .replace(/[\\/:*?"<>|\s]+/g, "-");
    return `五行八字命盘-${safeDateText}.png`;
}

async function saveResultAsImage() {
    if (!resultSection.value || isSavingImage.value) return;

    isSavingImage.value = true;

    try {
        await nextTick();
        if (document.fonts?.ready) await document.fonts.ready;

        const { default: html2canvas } = await import("html2canvas");
        const exportViewportWidth = Math.max(
            1200,
            document.documentElement.clientWidth
        );
        const canvas = await html2canvas(resultSection.value, {
            backgroundColor: "#f3efe6",
            logging: false,
            scale: 1.5,
            useCORS: true,
            windowWidth: exportViewportWidth,
            onclone(clonedDocument) {
                const clonedPageShell =
                    clonedDocument.querySelector(".page-shell");
                const clonedResult = clonedDocument.querySelector(
                    "[data-result-export]"
                );
                if (!clonedResult) return;

                if (clonedPageShell) {
                    clonedPageShell.style.overflow = "visible";
                }
                clonedResult.style.width = "1120px";
                clonedResult.style.maxWidth = "none";
                clonedResult.style.margin = "0";
                clonedResult
                    .querySelectorAll(".table-scroll, .preference-table-scroll")
                    .forEach((container) => {
                        container.scrollLeft = 0;
                        container.style.overflow = "visible";
                    });
            },
        });
        const imageBlob = await canvasToBlob(canvas);
        const imageUrl = URL.createObjectURL(imageBlob);
        const downloadLink = document.createElement("a");

        downloadLink.href = imageUrl;
        downloadLink.download = getResultImageFileName();
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        window.setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
        showToast("命盘图片已保存");
    } catch (error) {
        console.error("保存命盘图片失败", error);
        showToast("图片生成失败，请稍后重试");
    } finally {
        isSavingImage.value = false;
    }
}
</script>

<template>
    <div class="page-shell">
        <Transition name="toast">
            <div
                v-if="toastMessage"
                class="toast-message"
                role="status"
                aria-live="polite"
            >
                {{ toastMessage }}
            </div>
        </Transition>

        <button
            ref="quickReferenceTrigger"
            type="button"
            class="quick-reference-trigger"
            aria-label="打开速查表"
            aria-haspopup="dialog"
            aria-controls="quick-reference-dialog"
            :aria-expanded="isQuickReferenceOpen"
            @click="openQuickReference"
        >
            速查
        </button>

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
                        <span aria-hidden="true">↓</span>
                    </button>
                </div>

                <p v-if="errorMessage" class="error-message" role="alert">
                    {{ errorMessage }}
                </p>
                <p class="range-tip">
                    农历数据由 lunisolar 提供，当前可测算至 2099 年。
                </p>
            </section>

            <section
                v-if="result"
                ref="resultSection"
                class="result-section"
                aria-live="polite"
                data-result-export
            >
                <div class="result-heading">
                    <div class="result-heading-top">
                        <p class="eyebrow">命盘结果</p>
                        <button
                            type="button"
                            class="save-image-button"
                            :disabled="isSavingImage"
                            :aria-busy="isSavingImage"
                            data-html2canvas-ignore="true"
                            @click="saveResultAsImage"
                        >
                            {{ isSavingImage ? "生成中…" : "保存图片" }}
                        </button>
                    </div>
                    <div class="result-heading-main">
                        <h2>{{ result.bazi }}</h2>
                        <p class="solar-date">公历 {{ result.dateText }}</p>
                    </div>
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
                                    {{ result.pillars[key].mainStar
                                    }}<span
                                        v-if="result.pillars[key].stem.tenGod"
                                        >-{{
                                            result.pillars[key].stem.tenGod
                                                .seasonalState
                                        }}</span
                                    >
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">天干</th>
                                <td v-for="key in PILLAR_KEYS" :key="key">
                                    <strong class="stem-detail">
                                        <span
                                            >{{
                                                result.pillars[key].stem.name
                                            }}-</span
                                        >
                                        <span
                                            class="element-mark"
                                            :class="
                                                elementClassNames[
                                                    result.pillars[key].stem
                                                        .element
                                                ]
                                            "
                                            >{{
                                                result.pillars[key].stem.element
                                            }}</span
                                        >
                                        <span
                                            >-{{
                                                result.pillars[key].stem
                                                    .polarity
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
                                                result.pillars[key].branch
                                                    .element
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
                                            <span
                                                >-{{
                                                    hiddenStem.polarity
                                                }}</span
                                            >
                                        </span>
                                        <small
                                            >{{ hiddenStem.tenGod.name }}-{{
                                                hiddenStem.tenGod.seasonalState
                                            }}</small
                                        >
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="summary-grid">
                    <article class="summary-card day-master-card">
                        <span class="summary-kicker">日主</span>
                        <div class="day-master-row">
                            <h3>{{ result.dayMaster }}</h3>
                            <span class="month-command">
                                月令：{{ result.monthCommand.branch }}（{{
                                    result.monthCommand.season
                                }}·{{ result.monthCommand.element }}）
                            </span>
                            <span
                                v-if="result.dayMasterCommandStatus"
                                class="command-status"
                                :class="
                                    result.dayMasterCommandStatus === '得令'
                                        ? 'command-favorable'
                                        : 'command-unfavorable'
                                "
                                >{{ result.dayMasterCommandStatus }}</span
                            >
                        </div>
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
                                        result.elementCounts[element]
                                            .hiddenStems
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
                                        {{ name }}总数<strong
                                            class="count-value"
                                            >{{
                                                result.tenGodCounts[category][
                                                    name
                                                ].total
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

                        <div
                            v-if="result.patterns.length"
                            class="pattern-groups"
                        >
                            <section
                                v-for="(
                                    patterns, category
                                ) in result.patternGroups"
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
                        <p v-else class="pattern-empty">未发现常见格局组合。</p>

                        <p class="pattern-note">
                            格局结果按天干与藏干中的十神共现作简化归纳；实际吉凶仍需结合全局平衡、五行喜忌及具体命局判断。
                        </p>
                    </article>

                    <article class="summary-card preference-card">
                        <div class="card-title-row">
                            <h3>喜忌余项</h3>
                        </div>

                        <div class="preference-table-scroll">
                            <table class="preference-table">
                                <caption class="sr-only">
                                    日主五行旺相休囚死对应的八卦、方位、季节和颜色
                                </caption>
                                <thead>
                                    <tr>
                                        <th scope="col">旺克</th>
                                        <th scope="col">八卦（卦名/卦象）</th>
                                        <th scope="col">方位</th>
                                        <th scope="col">季节</th>
                                        <th scope="col">颜色</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="item in result.preferenceItems"
                                        :key="item.state"
                                    >
                                        <th
                                            scope="row"
                                            :class="
                                                elementClassNames[item.element]
                                            "
                                        >
                                            <span class="preference-state">{{
                                                item.state
                                            }}</span>
                                        </th>
                                        <td>{{ item.bagua }}</td>
                                        <td>{{ item.direction }}</td>
                                        <td>{{ item.season }}</td>
                                        <td>{{ item.color }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="pattern-note preference-notes">
                            <p>
                                同我者为旺，我生者为相，生我者为休，克我者为囚，我克者为死。
                            </p>
                            <p>旺克仅供五行参考，需根据命盘具体分析。</p>
                        </div>
                    </article>
                </div>
            </section>
        </main>

        <footer>五行八字排盘 · 结果仅供传统文化研究参考</footer>

        <Teleport to="body">
            <dialog
                id="quick-reference-dialog"
                ref="quickReferenceDialog"
                class="quick-reference-dialog"
                aria-modal="true"
                aria-labelledby="quick-reference-title"
                aria-describedby="quick-reference-description"
                @cancel.prevent="closeQuickReference"
                @close="handleQuickReferenceClosed"
                @click="handleQuickReferenceBackdrop"
            >
                <div class="quick-reference-panel">
                    <header class="quick-reference-header">
                        <div>
                            <p class="eyebrow">五行 · 十神 · 格局</p>
                            <h2 id="quick-reference-title">命理速查</h2>
                        </div>
                        <button
                            ref="quickReferenceCloseButton"
                            type="button"
                            class="quick-reference-close"
                            aria-label="关闭速查表"
                            @click="closeQuickReference"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </header>

                    <div class="quick-reference-body">
                        <p
                            id="quick-reference-description"
                            class="quick-reference-scroll-tip"
                        >
                            每张表均可左右滑动查看完整内容，滑动时分类列保持可见。
                        </p>

                        <section
                            class="quick-reference-section"
                            aria-labelledby="wuxing-reference-title"
                        >
                            <h3 id="wuxing-reference-title">五行全息对应表</h3>
                            <div
                                class="quick-reference-table-scroll"
                                role="region"
                                aria-label="五行全息对应表，可横向滚动查看"
                                tabindex="0"
                            >
                                <table
                                    class="quick-reference-table quick-reference-table-wuxing"
                                >
                                    <caption class="sr-only">
                                        五行全息对应表
                                    </caption>
                                    <colgroup>
                                        <col class="quick-col-category" />
                                        <col
                                            v-for="element in QUICK_REFERENCE_ELEMENTS"
                                            :key="element"
                                            class="quick-col-element"
                                        />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th scope="col">内容分类</th>
                                            <th
                                                v-for="element in QUICK_REFERENCE_ELEMENTS"
                                                :key="element"
                                                scope="col"
                                                :class="
                                                    elementClassNames[element]
                                                "
                                            >
                                                {{ element }}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="row in WUXING_REFERENCE_ROWS"
                                            :key="row.category"
                                        >
                                            <th scope="row">
                                                {{ row.category }}
                                            </th>
                                            <td
                                                v-for="element in QUICK_REFERENCE_ELEMENTS"
                                                :key="element"
                                            >
                                                <span
                                                    v-for="(
                                                        line, lineIndex
                                                    ) in getReferenceCellLines(
                                                        row.values[element]
                                                    )"
                                                    :key="`${row.category}-${element}-${lineIndex}`"
                                                    class="quick-reference-cell-line"
                                                >
                                                    {{ line }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section
                            class="quick-reference-section"
                            aria-labelledby="ten-god-reference-title"
                        >
                            <h3 id="ten-god-reference-title">十神表</h3>
                            <div
                                class="quick-reference-table-scroll"
                                role="region"
                                aria-label="十神表，可横向滚动查看"
                                tabindex="0"
                            >
                                <table
                                    class="quick-reference-table quick-reference-table-ten-gods"
                                >
                                    <caption class="sr-only">
                                        十神表
                                    </caption>
                                    <colgroup>
                                        <col class="quick-col-category" />
                                        <col class="quick-col-names" />
                                        <col class="quick-col-description" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th scope="col">类别</th>
                                            <th scope="col">
                                                十神名称（同阴阳）
                                            </th>
                                            <th scope="col">
                                                通俗比喻（一句话听懂）
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="row in TEN_GOD_REFERENCE_ROWS"
                                            :key="row.category"
                                        >
                                            <th scope="row">
                                                {{ row.category }}（{{
                                                    row.relation
                                                }}）
                                            </th>
                                            <td>
                                                <span
                                                    v-for="item in row.names"
                                                    :key="item.name"
                                                    class="quick-reference-cell-line"
                                                >
                                                    <strong>{{
                                                        item.name
                                                    }}</strong
                                                    >{{ item.qualifier }}
                                                </span>
                                            </td>
                                            <td
                                                class="quick-reference-description-cell"
                                            >
                                                <span
                                                    v-for="item in row.analogies"
                                                    :key="item.name"
                                                    class="quick-reference-cell-line"
                                                >
                                                    <strong>{{
                                                        item.name
                                                    }}</strong
                                                    >{{ item.text }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section
                            class="quick-reference-section"
                            aria-labelledby="pattern-reference-title"
                        >
                            <h3 id="pattern-reference-title">格局组合表</h3>
                            <div
                                class="quick-reference-table-scroll"
                                role="region"
                                aria-label="格局组合表，可横向滚动查看"
                                tabindex="0"
                            >
                                <table
                                    class="quick-reference-table quick-reference-table-patterns"
                                >
                                    <caption class="sr-only">
                                        格局组合表
                                    </caption>
                                    <colgroup>
                                        <col class="quick-col-type" />
                                        <col class="quick-col-name" />
                                        <col class="quick-col-ten-gods" />
                                        <col class="quick-col-meaning" />
                                        <col class="quick-col-tendency" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th scope="col">组合类型</th>
                                            <th scope="col">
                                                组合名称（术语）
                                            </th>
                                            <th scope="col">
                                                构成十神（A + B）
                                            </th>
                                            <th scope="col">
                                                通俗含义（一句话）
                                            </th>
                                            <th scope="col">吉凶倾向</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template
                                            v-for="group in PATTERN_REFERENCE_GROUPS"
                                            :key="group.type"
                                        >
                                            <tr
                                                v-for="(
                                                    row, rowIndex
                                                ) in group.rows"
                                                :key="`${group.type}-${row.name}`"
                                            >
                                                <th
                                                    v-if="rowIndex === 0"
                                                    class="quick-reference-group-cell"
                                                    scope="rowgroup"
                                                    :rowspan="group.rows.length"
                                                >
                                                    {{ group.type }}
                                                </th>
                                                <th scope="row">
                                                    {{ row.name }}
                                                </th>
                                                <td>{{ row.tenGods }}</td>
                                                <td
                                                    class="quick-reference-description-cell"
                                                >
                                                    {{ row.meaning }}
                                                </td>
                                                <td>
                                                    <span
                                                        class="quick-reference-tendency"
                                                        :class="
                                                            getTendencyClass(
                                                                row.tendency
                                                            )
                                                        "
                                                    >
                                                        {{ row.tendency }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section
                            class="quick-reference-section"
                            aria-labelledby="tian-gan-wu-he-reference-title"
                        >
                            <h3 id="tian-gan-wu-he-reference-title">
                                天干五合表
                            </h3>
                            <div
                                class="quick-reference-table-scroll"
                                role="region"
                                aria-label="天干五合表，可横向滚动查看"
                                tabindex="0"
                            >
                                <table
                                    class="quick-reference-table quick-reference-table-patterns"
                                >
                                    <thead>
                                        <tr>
                                            <th>合身类型</th>
                                            <th>日主（天干）</th>
                                            <th>合身方（月/时干）</th>
                                            <th>合化产物</th>
                                            <th>通俗解读</th>
                                            <th>吉凶倾向（视格局而定）</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr
                                            v-for="row in STEM_COMBINATION_ROWS"
                                            :key="row.type"
                                        >
                                            <th>{{ row.type }}</th>
                                            <td>{{ row.dayMaster }}</td>
                                            <td>{{ row.partner }}</td>
                                            <td>{{ row.result }}</td>
                                            <td>{{ row.interpretation }}</td>
                                            <td>{{ row.fortune }}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <ol class="quick-reference-ol">
                                    <li>
                                        合化条件：双方力量相近，且月令支持合化产物，否则为“羁绊”
                                    </li>
                                    <li>
                                        合身位置：仅限月干或时干与日主相合，年干不算合身
                                    </li>
                                    <li>
                                        合身影响：代表你与某种十神有天然粘性，吉凶需结合喜忌判断
                                    </li>
                                </ol>
                            </div>
                        </section>

                        <section
                            class="quick-reference-section"
                            aria-labelledby="di-zhi-he-gong-reference-title"
                        >
                            <h3 id="di-zhi-he-gong-reference-title">
                                地支合宫表
                            </h3>
                            <div
                                class="quick-reference-table-scroll"
                                role="region"
                                aria-label="地支合宫表，可横向滚动查看"
                                tabindex="0"
                            >
                                <table
                                    class="quick-reference-table quick-reference-table-patterns"
                                >
                                    <thead>
                                        <tr>
                                            <th>日支（夫妻宫）</th>
                                            <th>合方（月支/时支）</th>
                                            <th>合化产物</th>
                                            <th>
                                                对婚姻/内心的影响（通俗解读）
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr
                                            v-for="row in BRANCH_PAIR_ROWS"
                                            :key="`${row.day}-${row.partner}`"
                                        >
                                            <td>{{ row.day }}</td>
                                            <td>{{ row.partner }}</td>
                                            <td>{{ row.result }}</td>
                                            <td>{{ row.interpretation }}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <ol class="quick-reference-ol">
                                    <li>
                                        位置优先：只有月支或时支与日支相合，才算“合日支”，年支合日支为“远合”，力量减半
                                    </li>
                                    <li>
                                        化气需月令支持：六合能否“化气”，需看月令是否支持。合化产物的五行，必须得到月令的生扶，不能受月令克制，否则就是只合不化（关系密切，但各自的五行属性没变）
                                    </li>
                                    <li>
                                        合不一定吉：合日支代表“绑定”，吉凶取决于日支是喜神还是忌神
                                    </li>
                                </ol>
                            </div>
                        </section>

                        <section
                            class="quick-reference-section"
                            aria-labelledby="di-zhi-san-he-reference-title"
                        >
                            <h3 id="di-zhi-san-he-reference-title">
                                地支三合局
                            </h3>
                            <div
                                class="quick-reference-table-scroll"
                                role="region"
                                aria-label="地支三合表，可横向滚动查看"
                                tabindex="0"
                            >
                                <table
                                    class="quick-reference-table quick-reference-table-patterns"
                                >
                                    <thead>
                                        <tr>
                                            <th>三合局</th>
                                            <th>组成地支（三个）</th>
                                            <th>合化产物</th>
                                            <th>中神（核心）</th>
                                            <th>通俗解读</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr
                                            v-for="row in THREE_HARMONY_ROWS"
                                            :key="row.name"
                                        >
                                            <td>{{ row.name }}</td>
                                            <td>{{ row.members }}</td>
                                            <td>{{ row.result }}</td>
                                            <td>{{ row.core }}</td>
                                            <td>{{ row.interpretation }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section
                            class="quick-reference-section"
                            aria-labelledby="di-zhi-san-hui-reference-title"
                        >
                            <h3 id="di-zhi-san-hui-reference-title">
                                地支三会局
                            </h3>
                            <div
                                class="quick-reference-table-scroll"
                                role="region"
                                aria-label="地支三合表，可横向滚动查看"
                                tabindex="0"
                            >
                                <table
                                    class="quick-reference-table quick-reference-table-patterns"
                                >
                                    <thead>
                                        <tr>
                                            <th>三会局</th>
                                            <th>组成地支（三个）</th>
                                            <th>合化产物</th>
                                            <th>对应季节</th>
                                            <th>通俗解读</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr
                                            v-for="row in THREE_MEETING_ROWS"
                                            :key="row.name"
                                        >
                                            <td>{{ row.name }}</td>
                                            <td>{{ row.members }}</td>
                                            <td>{{ row.result }}</td>
                                            <td>{{ row.season }}</td>
                                            <td>{{ row.interpretation }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </dialog>
        </Teleport>
    </div>
</template>
