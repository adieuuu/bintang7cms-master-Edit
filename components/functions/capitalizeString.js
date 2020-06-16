export const capitalizeString = (text) => {
    return text.replace(/(?:^|\s)\S/g, (a) => { return a.toUpperCase(); });
}