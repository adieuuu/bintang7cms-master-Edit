import Link from 'next/link'
import TooltipTrigger from 'react-popper-tooltip'

export default (props) => {
    const Tooltip = ({arrowRef, tooltipRef, getArrowProps, getTooltipProps, placement}) => (
        <div {...getTooltipProps({ref: tooltipRef, className: 'tooltip-container'})}>
            <div {...getArrowProps({ref: arrowRef, className: 'tooltip-arrow', 'data-placement': placement})}/>
            {props.title}
        </div>
    )
    const Trigger = ({getTriggerProps, triggerRef}) => (
        <span 
            {...getTriggerProps({ref: triggerRef, className: 'trigger'})} 
            className="position-absolute d-block h-100"
            style={{width: props.width}}
        >
            { 
                props.iconName && !props.isNavOpen ? 
                    <i className={`${props.iconName} ${props.iconClassName} font-22 absolute-center`} /> 
                    : 
                    props.singleMenu ? 
                        <i className={`${props.iconName} ${props.iconClassName} font-22 absolute-center`} /> : "" 
            }
        </span>
    )
    return (
        <div className={`navListItem d-inline-block w-100 position-relative ${props.className} ${props.activePage === props.link ? "bg-primary" : ""}`}>
            <Link href={props.href} as={props.link}>
                <a 
                    className={`navItem animate-all position-relative d-inline-block w-100 ${props.activePage === props.link ? "text-white" : ""}`}
                    style={{paddingLeft: props.width}}
                    title={props.title}
                >
                    <span 
                        className="position-absolute d-block h-100"
                        style={{width: props.width}}
                    >
                        { 
                            props.iconName && !props.isNavOpen ? 
                                <i className={`${props.iconName} ${props.iconClassName} font-22 absolute-center`} /> 
                                : 
                                props.singleMenu ? 
                                    <i className={`${props.iconName} ${props.iconClassName} font-22 absolute-center`} /> : "" 
                        }
                    </span>
                    <TooltipTrigger placement="right" trigger={props.isNavOpen ? 'none' : 'hover'} tooltip={Tooltip}>{Trigger}</TooltipTrigger>
                    <span className="ml-1 h-100 d-flex">
                        <h5 className="info m-0 font-16">{props.title}</h5>
                    </span>
                </a>
            </Link>
        </div>
    )
}