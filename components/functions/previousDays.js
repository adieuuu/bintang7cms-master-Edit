export const previousDays = (date, days) => {
    var result = new Date(date)
    result.setDate(result.getDate() - days)
    return result
}