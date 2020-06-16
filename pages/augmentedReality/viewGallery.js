/**
 * REQUIREMENTNYA BELUM PASTI
 */

import React from 'react'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
import { Container, Row, Col, Button, } from 'reactstrap'
import { auth } from '../../components/actions'

class ARViewGallery extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		let props = { showHeader: true, showFooter: true, pageName: "/view-gallery" }
		try {
			// await store.dispatch(galleriesListDummy())
		} catch (e) {
			props.error = 'Unable to fetch AsyncData on server'
		}
		return props
	}

	constructor(props) {
		super(props)
		this.state = {
			title: props.companyName,
			subTitle: "Content Management System",
			showHeader: props.showHeader,
			headerHeight: props.headerHeight,
			navIsOpen: props.navIsOpen,
			navMaxWidth: props.showHeader ? props.navMaxWidth : "0px",
			navMinWidth: props.showHeader ? props.navMinWidth : "0px",
			_listGallery: props.listGaleries,
			_selectedGallery: null,
			_showFormGallery: false,
			// FORM ADD ITEM
			payloadImage: '',
			payloadInformation: '',
			payloadRoomName: '',
			// END ADD ITEM
			
		}
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen
		})
	}

	renderModelAddNew() {
		
	}

	render() {
		const { showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, _listGallery } = this.state
		console.log("List", _listGallery)
		return (
			<div 
				role="main" 
				className="animate-all fast bg-light"
				style={{
					paddingTop: showHeader ? headerHeight : 0,
					paddingLeft: navMinWidth,
					overflowX: "hidden"
				}}
			>
				<Container
					fluid 
					className="contentContainer px-4 pt-4 pb-2"
					style={{
						marginLeft: navIsOpen ? navMaxWidth-navMinWidth : 0,
						width: navIsOpen ? `calc(100% - ${navMaxWidth-navMinWidth}px)` : '100%'
					}}
				>
					<Row>
						<Col lg="12" className="mb-2"><h1 className="text-primary">Gallery</h1></Col>
						<Col xs="12" className="d-flex justify-content-end mb-3">
							<Button size="sm" color="primary" className="py-2 px-3" ><i className="icon icon-plus" /> ADD NEW</Button>
						</Col>
						{
							_listGallery && _listGallery.map((gallery, index) => (
								<Col xs="12" key={index} className="mb-3">
									<div className="box">
										<div className="box-header">
											<h4>Room ID: {gallery.id}</h4>
										</div>
										<div className="box-body">
											<img style={{width: '100%'}} src={gallery.picture} alt="ROOM 360 PICTURE" />
										</div>
									</div>
								</Col>
							))
						}
					</Row>
				</Container>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		// getLineChart: bindActionCreators(getLineChart, dispatch),
		// galleriesListDummy: bindActionCreators(galleriesListDummy, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(ARViewGallery)