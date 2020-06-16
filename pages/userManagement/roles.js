import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, Row, Col, Button, Card, CardImg, CardText, 
	CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import { auth, getRoleList } from '../../components/actions'
import AdvanceTableBox from '../../components/tables/advanceTable'

class UserRoles extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
        let props = { showHeader: true, showFooter: true, pageName: "/role", 
            current_page: 1,size: 10, sort: "name"}
		let stores = store.getState()
		try {
			if(!stores.listRoles) await store.dispatch(getRoleList(props.current_page,props.size,props.sort, ctx))
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
			listRoles: props.listRoles,
			tableHead: [
				{ id: "name", name: "Role Name" },
				{ id: "action", name: "Action" }
			],
			tableSortItems: [
				{ id: "name", name: "Role Name", order: "asc" }
			],
			fetchPage: props.current_page,
			fetchLen: props.size,
		}
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen
		})
	}

	render() {
		const { showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, 
			listRoles, tableHead } = this.state
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
						<Col lg="12" className="mb-2"><h1 className="text-primary">Role Management</h1></Col>
						
						<Col xs="12" className="d-flex justify-content-end mb-3">
							<Button size="sm" color="primary" className="py-2 px-3" ><i className="icon icon-plus" /> ADD NEW</Button>
						</Col>
						<Col xs="12">
						<AdvanceTableBox 
								isResponsive={true} 
								tHead={tableHead}
								listNumber={true}
								
							>
								{listRoles.content.map((role, i) => (
									<tr key={i}>
										<th scope="row" className="pt-2">{(i + 1) }</th>
                                        <td className="pt-2">
                                            {role.name}
                                        </td>
                                        <td className="pt-2">
                                            <div className="d-flex w-100">
												<Button 
													color='success' 
													size="sm" 
													className="d-flex mr-1 mb-1"
													onClick={() => void(0)}
												>
													Detail
													</Button>
													<Button 
														color="primary" 
														size="sm" 
														className="mr-1 mb-1" 
														onClick={() => void(0)}
													><i className="icon icon-edit-3"/> </Button>
													<Button color="danger" size="sm" className="mb-1" onClick={() => void(0)}><i className="icon icon-trash-2"/></Button>
											</div>
                                        </td>
									</tr>
								))}
							</AdvanceTableBox>
						</Col>

					</Row>
				</Container>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getRoleList: bindActionCreators(getRoleList, dispatch),
		// getGlobalChart: bindActionCreators(getGlobalChart, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(UserRoles)