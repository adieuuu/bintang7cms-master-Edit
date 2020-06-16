export const timestampToDate = (props) => {
    const isUnix = props.toString().length === 13
    const newValue = isUnix ? props : props * 1000
    const newDate = new Date(newValue)
    const dates = newDate.getDate() > 9 ? newDate.getDate() : '0' + newDate.getDate()
    const months = newDate.getMonth() > 9 ? newDate.getMonth() : '0' + newDate.getMonth()
    return dates + "-" + months + "-" + newDate.getFullYear()
}