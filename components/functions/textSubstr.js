export const textSubstr = (text, from, to) => {
    if(text.length > to) {
        return text.substring(from, to) + "...";
    }
    return text;
}