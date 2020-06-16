import { useState } from 'react'
import NavMenu from '../cards/NavMenuCard'
import NavTree from '../cards/NavTreeMenuCard'
import { logout } from '../actions'
import TooltipTrigger from 'react-popper-tooltip'

export default (props) => {
    const [openSubMenu, setToggleSubMenu] = useState({opened: null})
    const toggleSubMenu = (e) => {
        e.persist()
        if(!openSubMenu.opened) {
            setToggleSubMenu({opened: e.target.id})
        } else {
            setToggleSubMenu({opened: openSubMenu.opened != e.target.id ? e.target.id : null})
        }
    }
    // let flag_role = 0
    // console.log(props.user)
    // if(props.user.account && props.user.account.roles.length > 0) {
    //     const isSuperUser = props.user.account.roles.findIndex(_role => _role.name == "ROLE_SUPERUSER")
    //     const isAdminMarketing = props.user.account.roles.findIndex(_role => _role.name == "ROLE_ADMIN")
    //     if(isSuperUser > -1) {
    //         flag_role = 1
    //     } else {
    //         if( isAdminMarketing > -1 ) {
    //             flag_role = 0
    //         }
    //     } 
    // }
    const { headerHeight, navIsOpen, navMaxWidth, navMinWidth, pageName } = props
    const LogOutTooltip = ({arrowRef, tooltipRef, getArrowProps, getTooltipProps, placement}) => (
        <div {...getTooltipProps({ref: tooltipRef, className: 'tooltip-container'})}>
            <div {...getArrowProps({ref: arrowRef, className: 'tooltip-arrow', 'data-placement': placement})}/>
            Logout
        </div>
    )
    const LogOutTooltipTrigger = ({getTriggerProps, triggerRef}) => (
        <span 
            {...getTriggerProps({ref: triggerRef, className: 'trigger'})}
            className="position-absolute d-block h-100"
            style={{width: navMinWidth}}
        >
            <i className="icon-power font-22 absolute-center" />
        </span>
    )
    return (
        <div 
            className="navList position-fixed d-block overflow-hidden border-right animate-width fast" 
            style={{width: navIsOpen ? navMaxWidth : navMinWidth}}
        >
            <div 
                className="navListWrapper pl-0 m-0"
                style={{
                    zIndex: 1, 
                    paddingTop: headerHeight,
                    width: navMaxWidth,
                    height: "100%"
                }} 
            >
                <NavMenu link="/dashboard" href="/dashboard" width={navMinWidth} title="Dashboard" iconName="icon-pin" activePage={pageName} isNavOpen={navIsOpen} singleMenu={true} />
                <NavTree 
                    listPages={["/customer", "/administrator"]}
                    activePage={pageName}
                    width={navMinWidth}
                    title="User Management"
                    iconName="icon-users1"
                    activeMenu={openSubMenu.opened}
                    isNavOpen={navIsOpen}
                    onClick={toggleSubMenu}
                >
                    <NavMenu link="/customer" href="/userManagement/customer" width={navMinWidth} title="Customer" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-theater_comedy" iconClassName="text-E6E6E6" />
                    <NavMenu link="/administrator" href="/userManagement/administrator" width={navMinWidth} title="Administrator" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-face" iconClassName="text-E6E6E6" />
                </NavTree>
                <NavTree 
                    listPages={["/register-factory", "/taman-herbal-plant", "/taman-herbal-hero"]}
                    activePage={pageName}
                    width={navMinWidth}
                    title="Factory"
                    iconName="icon-shop"
                    activeMenu={openSubMenu.opened}
                    isNavOpen={navIsOpen}
                    onClick={toggleSubMenu}
                >
                    <NavMenu link="/register-factory" href="/augmentedReality/registerFactory" width={navMinWidth} title="Factory Registration" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-open_in_browser" iconClassName="text-E6E6E6" />
                    <NavMenu link="/taman-herbal-plant" href="/augmentedReality/tamanHerbalTanaman" width={navMinWidth} title="Taman Herbal (Plant)" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-local_florist" iconClassName="text-E6E6E6" />
                    <NavMenu link="/taman-herbal-hero" href="/augmentedReality/tamanHerbalHero" width={navMinWidth} title="Taman Herbal (Hero)" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-slideshare" iconClassName="text-E6E6E6" />
                    {/* <NavMenu link="/view-gallery" href="/augmentedReality/viewGallery" width={navMinWidth} title="View Gallery" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-plus-square" iconClassName="text-E6E6E6" /> */}
                </NavTree>
                <NavTree 
                    listPages={["/master-food", "/master-product", "/master-package", "/master-schedule", "/master-location", "/master-settings"]}
                    activePage={pageName}
                    width={navMinWidth}
                    title="Factory Setting"
                    iconName="icon-cog"
                    activeMenu={openSubMenu.opened}
                    isNavOpen={navIsOpen}
                    onClick={toggleSubMenu}
                >
                    <NavMenu link="/master-location" href="/masterData/location" width={navMinWidth} title="Locations" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-location_onplaceroom" iconClassName="text-E6E6E6" />
                    <NavMenu link="/master-package" href="/masterData/package" width={navMinWidth} title="Packages" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-box1" iconClassName="text-E6E6E6" />
                    <NavMenu link="/master-schedule" href="/masterData/schedule" width={navMinWidth} title="Schedules" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-add_alarmalarm_add" iconClassName="text-E6E6E6" />
                    <NavMenu link="/master-food" href="/masterData/food" width={navMinWidth} title="Foods" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-local_restaurantrestaurant_menu" iconClassName="text-E6E6E6" />
                    <NavMenu link="/master-product" href="/masterData/product" width={navMinWidth} title="Products" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-loyalty" iconClassName="text-E6E6E6" />
                    <NavMenu link="/master-settings" href="/masterData/settings" width={navMinWidth} title="Settings" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-cog" iconClassName="text-E6E6E6" />
                </NavTree>
                <NavTree 
                    listPages={["/term-and-condition", "/faq", "/main-banner", "/campaign-banner"]}
                    activePage={pageName}
                    width={navMinWidth}
                    title="General Setting"
                    iconName="icon-tools"
                    activeMenu={openSubMenu.opened}
                    isNavOpen={navIsOpen}
                    onClick={toggleSubMenu}
                >
                    <NavMenu link="/term-and-condition" href="/generalSetting/termCondition" width={navMinWidth} title="Term &amp; Condition" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-policy" iconClassName="text-E6E6E6" />
                    <NavMenu link="/faq" href="/generalSetting/faq" width={navMinWidth} title="FAQ" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-emoji_objects" iconClassName="text-E6E6E6" />
                    <NavMenu link="/main-banner" href="/generalSetting/mainBanner" width={navMinWidth} title="Main Banner" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-image-inverted" iconClassName="text-E6E6E6" />
                    <NavMenu link="/campaign-banner" href="/generalSetting/campaignBanner" width={navMinWidth} title="Campaign Banner" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-images1" iconClassName="text-E6E6E6" />
                </NavTree>
                <NavTree 
                    listPages={["/audit-trail"]}
                    activePage={pageName}
                    width={navMinWidth}
                    title="Report"
                    iconName="icon-hour-glass"
                    activeMenu={openSubMenu.opened}
                    isNavOpen={navIsOpen}
                    onClick={toggleSubMenu}
                >
                    <NavMenu link="/audit-trail" href="/logTransaction/auditTrail" width={navMinWidth} title="Audit Trail" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-activity" iconClassName="text-E6E6E6" />
                </NavTree>
                <NavTree 
                    listPages={["/edit-profile", "/change-profile-password"]}
                    activePage={pageName}
                    width={navMinWidth}
                    title="My Account"
                    iconName="icon-user1"
                    activeMenu={openSubMenu.opened}
                    isNavOpen={navIsOpen}
                    onClick={toggleSubMenu}
                >
                    <NavMenu link="/edit-profile" href="/profile/editProfile" width={navMinWidth} title="Edit Profile" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-assignment_ind" iconClassName="text-E6E6E6" />
                    <NavMenu link="/change-profile-password" href="/profile/changeProfilePassword" width={navMinWidth} title="Change Password" activePage={pageName} isNavOpen={navIsOpen} iconName="icon-vpn_key" iconClassName="text-E6E6E6" />
                </NavTree>
                <NavMenu link="/sample-mobil" href="/sampleMobil" width={navMinWidth} title="Sample Mobil" iconName="icon-hash" />
                <div className="navListItem d-inline-block w-100" onClick={logout}>
                    <div 
                        className="navItem animate-all position-relative d-inline-block w-100"
                        style={{paddingLeft: navMinWidth, cursor: "pointer"}}
                    >
                        <TooltipTrigger placement="right" trigger={navIsOpen ? 'none' : 'hover'} tooltip={LogOutTooltip}>{LogOutTooltipTrigger}</TooltipTrigger>
                        <span className="ml-1 h-100 d-flex">
                            <h5 className="info m-0 font-16">Logout</h5>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}