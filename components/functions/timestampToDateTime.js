export const timestampToDateTime = (props, withDay) => {
    const isUnix = props.toString().length === 13
    const newValue = isUnix ? props : props * 1000
    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]
    const newDate = new Date(newValue)
    const dates = newDate.getDate() > 9 ? newDate.getDate() : '0' + newDate.getDate()
    const months = newDate.getMonth() > 9 ? newDate.getMonth() : '0' + newDate.getMonth()
    const hours = newDate.getHours() > 9 ? newDate.getHours() : '0' + newDate.getHours()
    const minutes = newDate.getMinutes() > 9 ? newDate.getMinutes() : '0' + newDate.getMinutes()
    const data = (withDay ? days[newDate.getDay()] + ", " : "") + dates + "-" + months + "-" + newDate.getFullYear() + " " + hours + ":" + minutes
    return data
}