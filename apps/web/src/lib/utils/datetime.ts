export const formatDate = (date: Date = new Date(), locale: string = 'en-US'): string => {
    const formatter = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    const weekday = parts.find((p) => p.type === 'weekday')?.value || '';
    let day = parts.find((p) => p.type === 'day')?.value || '';
    const month = parts.find((p) => p.type === 'month')?.value || '';
    const year = parts.find((p) => p.type === 'year')?.value || '';

    // For English locales, add an ordinal suffix.
    if (locale.startsWith('en')) {
        const d = Number(day);
        const suffix =
            d % 10 === 1 && d % 100 !== 11
                ? 'st'
                : d % 10 === 2 && d % 100 !== 12
                    ? 'nd'
                    : d % 10 === 3 && d % 100 !== 13
                        ? 'rd'
                        : 'th';
        day += suffix;
        return `${weekday}, the ${day} of ${month}. ${year}`;
    }

    let _weekday = weekday[0].toUpperCase() + weekday.substring(1);

    // For non-English locales, return a similar pattern without the ordinal logic.
    return `${_weekday}, ${day} ${month} ${year}`;
};