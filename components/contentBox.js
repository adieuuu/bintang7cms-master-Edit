export default (props) => {
  const { title, titleClass, children, className } = props
  return (
      <div className={className}>
        {
          title ? 
            <h5 className={titleClass ? titleClass : 'font-16 text-primary mb-3'}>{title}</h5> : ""
        }
        {children}
      </div>
  )
}