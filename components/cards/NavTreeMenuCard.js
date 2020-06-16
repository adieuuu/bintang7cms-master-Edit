import { removeAllWhiteSpaces } from '../functions'
import TooltipTrigger from 'react-popper-tooltip'

export default (props) => {
    const { width, listPages, activePage, children, title, iconName, activeMenu, onClick, isNavOpen } = props
    const Tooltip = ({arrowRef, tooltipRef, getArrowProps, getTooltipProps, placement}) => (
        <div {...getTooltipProps({ref: tooltipRef, className: 'tooltip-container'})}>
            <div {...getArrowProps({ref: arrowRef, className: 'tooltip-arrow', 'data-placement': placement})}/>
            {title}
        </div>
    )
    const Trigger = ({getTriggerProps, triggerRef}) => (
        <div 
            {...getTriggerProps({ref: triggerRef, className: 'trigger'})}
            id={removeAllWhiteSpaces(title)} 
            className="absolute-top-left d-block h-100 bg-transparent" 
            style={{
                height: "50px", 
                width: !isNavOpen ? width : "100%"
            }}
            onClick={onClick} 
        >
            {
                isNavOpen ?
                    activeMenu == removeAllWhiteSpaces(title) || listPages.indexOf(activePage) > -1 ?
                        <i className="icon icon-chevron-down font-20 absolute-center-right mr-2" />
                        :
                        <i className="icon icon-chevron-right font-20 absolute-center-right mr-2" />
                    : ""
            }
            
        </div> 
    )
    return (
        <div className="navListItem d-inline-block w-100 position-relative">
            <div 
                className={`navItem animate-all position-relative d-inline-block w-100 ${activeMenu == removeAllWhiteSpaces(title) || listPages.indexOf(activePage) > -1 ? "bg-dark text-white" : ""}`}
                style={{ paddingLeft: props.width, cursor: "pointer" }}
            >
                <span className="position-absolute d-block h-100" style={{width: width}}>
                    <i className={`icon ${iconName ? iconName : "icon-globe"} font-22 absolute-center`} />
                </span>
                <span className="ml-1 h-100 d-flex">
                    <h5 className="info m-0 font-16">{title}</h5>
                </span>
                <TooltipTrigger placement="right" trigger={isNavOpen ? 'none' : 'hover'} tooltip={Tooltip}>{Trigger}</TooltipTrigger>
            </div>
            {
                activeMenu == removeAllWhiteSpaces(title) || listPages.indexOf(activePage) > -1 ?
                    <div className={`position-relative d-block bg-light border-bottom`}>
                        {children}
                        <div className="position-absolute arrow arrow-down arrow-dark" style={{top: "-1px", left: "20px"}}></div>
                    </div> : ""
            }
            
        </div>
    )
}