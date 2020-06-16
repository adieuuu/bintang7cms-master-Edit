import { Spinner } from 'reactstrap'

export default (props) => {
    const { style, className, loaderColor, loaderSize, loaderStyle, loaderType } = props
    return (
        <div className={className} style={style}>
            <div 
                className="position-absolute"
                style={{
                    top: "50%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)", 
                    WebkitTransform: "translate(-50%, -50%)"
                }}
            >
                <Spinner 
                    type={loaderType}
                    size={loaderSize ? loaderSize : "md"} 
                    color={loaderColor ? loaderColor : "primary"} 
                    style={loaderStyle}
                />
            </div>
        </div>
    )
}
