export const numberWithDot = (str) => {
    return str.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}