import React from 'react'

export default class Footer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            licensed: props.cmsLicensed,
            showFooter: props.showFooter ? props.showFooter : false,
            navIsOpen: props.navIsOpen,
            navMaxWidth: props.showHeader ? props.navMaxWidth : "0px",
            navMinWidth: props.showHeader ? props.navMinWidth : "0px"
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
            navIsOpen: nextProps.navIsOpen, 
            showFooter: nextProps.showFooter
        })
	}
    render() {
        const { licensed, showFooter, navIsOpen, navMaxWidth, navMinWidth } = this.state
        return (
            showFooter ? 
                <div 
                    className="footer bg-light text-center text-secondary pt-0 pb-4"
                    style={{
                        paddingLeft: navIsOpen ? navMaxWidth : navMinWidth
                    }} 
                >
                    <p className="font-12 m-0" dangerouslySetInnerHTML={{__html: licensed}} />
                </div> : ""
        )
    }
}