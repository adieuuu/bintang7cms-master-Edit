export default (props) => {
    const { className, title, children } = props
    return (
        <div className={(className ? className : `bg-white`) + ` rounded-lg shadow-sm p-3 mb-4 overflow-auto`}>
          {title ? <h5 className="font-16 mb-3">{title}</h5> : ""}
          {children}
        </div>
    )
}