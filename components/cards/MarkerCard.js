export default (props) => {
    return (
        <div className={props.className} style={props.style}>
            <img width="100%" height="100%" src={props.imagePath} />
        </div>
    )
}