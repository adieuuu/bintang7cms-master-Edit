export const utcToDateTime = (props, withDay, withTime) => {
    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]
    const newDate = new Date(props)
    const dates = newDate.getDate() > 9 ? newDate.getDate() : '0' + newDate.getDate()
    const months = newDate.getMonth() > 9 ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1)
    const hours = newDate.getHours() > 9 ? newDate.getHours() : '0' + newDate.getHours()
    const minutes = newDate.getMinutes() > 9 ? newDate.getMinutes() : '0' + newDate.getMinutes()
    const data = (withDay ? days[newDate.getDay()] + ", " : "") + newDate.getFullYear() + "-" + months + "-" + dates + (withTime ? " " + hours + ":" + minutes : "")
    return data
}