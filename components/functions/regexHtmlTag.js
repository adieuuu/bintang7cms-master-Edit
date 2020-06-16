export const regexHtmlTag = (text) => {
    return text.replace(/(<([^>]+)>)/ig, '')
}