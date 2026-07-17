import { YEAR_RANGE, daysInMonth } from "./bazi";

function parseInteger(params, key, minimum, maximum, fallback) {
    const rawValue = params.get(key);
    if (rawValue === null || !/^\d+$/.test(rawValue.trim())) return fallback;

    const value = Number(rawValue);
    return value >= minimum && value <= maximum ? value : fallback;
}

function parseGender(params) {
    const value = params.get("_gender");
    if (value === "0" || value === "2") return "female";
    return "male";
}

export function getInitialFormValues(search = "", now = new Date()) {
    const params = new URLSearchParams(search);
    const defaultYear = Math.min(
        Math.max(now.getFullYear(), YEAR_RANGE.min),
        YEAR_RANGE.max,
    );
    const defaultMonth = now.getMonth() + 1;
    const defaultHour = Math.min(Math.max(now.getHours(), 0), 23);
    const year = parseInteger(
        params,
        "_year",
        YEAR_RANGE.min,
        YEAR_RANGE.max,
        defaultYear,
    );
    const month = parseInteger(params, "_month", 1, 12, defaultMonth);
    const maximumDay = daysInMonth(year, month);
    const defaultDay = Math.min(now.getDate(), maximumDay);
    const day = parseInteger(params, "_day", 1, maximumDay, defaultDay);
    const hour = parseInteger(params, "_hour", 0, 23, defaultHour);

    return {
        gender: parseGender(params),
        year,
        month,
        day,
        hour,
    };
}
