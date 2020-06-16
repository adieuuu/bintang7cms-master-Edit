import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import AdvanceTableBox from '../../components/tables/advanceTable'
import Pagination from '../../components/cards/PaginationCard'
import { Container, Row, Col, Button } from 'reactstrap'
import LoaderCard from '../../components/cards/LoaderCard'
import ModalBox from '../../components/cards/modalBoxCard'
import { auth, customerList, changeStatusUser } from '../../components/actions'
import { utcToDateTime } from '../../components/functions'

const tableLoaderProps = {
	className: "w-100 d-block mt-5",
	loaderColor: "primary",
	style: {
		top: 0,
		left: 0,
		backgroundColor: "rgba(255,255,255,0.75)",
		height: "120px",
		zIndex: 2
	}
}

class UserCustomer extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/customer", 
			page: 1, size: 10, sortBy: "created", orderBy: "desc", keyword: "", token: token
		}
		try {
			await store.dispatch(customerList(props.page, props.size, props.sortBy, props.orderBy, token, props.keyword))
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
			listCustomer: props.listUser_customer,
			fetchSort: props.sortBy,
			fetchOrder: props.orderBy,
			fetchSearchKey: props.keyword,
			fetchPage: props.page,
			fetchLen: props.size,
			onFetch: false,

			userSelected: null,
			showProfileModal: false,
			showChangeStatusConfirmModal: false,
			_statusType: "",

			showAlertModal: false, 
			alertModalMessage: ""
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			listCustomer: nextProps.listUser_customer
		})
	}

	showProfileModal = (data) => this.setState({showProfileModal: true, userSelected: data})
	closeProfileModal = () => this.setState({showProfileModal: false})

	onPaginationClick = (page) => {
		const { fetchSort, fetchOrder, fetchSearchKey, fetchLen, onFetch } = this.state
		const { customerList, token } = this.props
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await customerList(page, fetchLen, fetchSort, fetchOrder, JSON.stringify(token), fetchSearchKey)
					if(resp.status) {
						this.setState({ fetchPage: page, onFetch: false })
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onSortInit = (e) => {
		const { fetchLen, fetchOrder, fetchSearchKey, onFetch } = this.state
		const { customerList, token } = this.props
		const pages = 1, target = e.target, value = target.value
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchSort: value },
				async () => {
					const resp = await customerList(pages, fetchLen, value, fetchOrder, JSON.stringify(token), fetchSearchKey)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onTargetSortInit = (data) => {
		let page = 1, value = data.id
		const { fetchSort, fetchOrder, fetchSearchKey, fetchLen, onFetch } = this.state
		const { customerList, token } = this.props
		const orders = fetchSort != value ? 'desc' : fetchOrder == 'desc' ? 'asc' : 'desc'
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchSort: value, fetchOrder: orders },
				async () => {
					const resp = await customerList(page, fetchLen, value, orders, JSON.stringify(token), fetchSearchKey)
					if(resp.status) {
						this.setState({ fetchPage: page, onFetch: false })
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onSearchKeyInit = (keywords) => {
		let pages = 1, orders = "desc", sorts = "created"
		const { fetchLen, onFetch } = this.state
		const { customerList, token } = this.props
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchSearchKey: keywords, fetchSort: sorts, fetchOrder: orders },
				async () => {
					const resp = await customerList(pages, fetchLen, sorts, orders, JSON.stringify(token), keywords)
					if(resp.status) {
						this.setState({ fetchPage: pages, onFetch: false })
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	showChangeStatusModal = (data, _type) => this.setState({userSelected: data, _statusType: _type, showChangeStatusConfirmModal: true})
	closeChangeStatusModal = () => {
		this.setState({_statusType: "", showChangeStatusConfirmModal: false}, () => this.closeProfileModal())
	}
	initChangeStatusUser = () => {
		const { onFetch, userSelected, _statusType, fetchLen } = this.state
		if(!onFetch) {
			const { token, customerList } = this.props
			this.setState(
				{ onFetch: true },
				async () => {
					const opt = { enabled: _statusType == "Unlock" ? true : false }
					const fetch = await changeStatusUser(userSelected.account.id, opt, token)
					if(fetch.status) {
						let page = 1, sort = "created", order = "desc", keywrd = ""
						this.setState(
							{ fetchPage: page, fetchSort: sort, fetchOrder: order, fetchSearchKey: keywrd },
							async () => {
								this.closeChangeStatusModal()
								const resp = await customerList(page, fetchLen, sort, order, JSON.stringify(token), keywrd)
								if(resp.status) {
									this.setState({onFetch: false}, () => this.closeProfileModal())
								} else {
									this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
								}
							}
						)
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: fetch.message})
					}
				}
			)
		}
	}

	// START FUNCTION RENDER
	renderModalChangeStatusConfirmation() {
		const { onFetch, _statusType, userSelected, showChangeStatusConfirmModal } = this.state
		return (
			<ModalBox
				size="lg"
				title={(<div>Confirm to {_statusType} <b>{userSelected && userSelected.full_name ? userSelected.full_name : ''}</b>?</div>)}
				className="absolute-center" 
				showModal={showChangeStatusConfirmModal} 
				toogleModal={this.closeChangeStatusModal}
				body={(
					<div className="p-2" style={{minWidth: "300px"}}>
						<div>This will <b>{_statusType}</b> the user activities and status will be <b>{_statusType == "Lock" ? "Inactive" : "Active"}</b>.</div>
						<div className="mt-2 clearfix">Are you sure you want to continue?</div>
					</div>
				)}
			>
				<Button color="danger" className="mr-2" onClick={!onFetch ? this.initChangeStatusUser : () => {}}>Confirm</Button>
				<Button color="secondary" className="float-right" onClick={!onFetch ? this.closeChangeStatusModal : () => {}}>Cancel</Button>
			</ModalBox>
		)
	}

	renderProfileModal() {
		const { showProfileModal, userSelected } = this.state
		return (
			<ModalBox
				size="lg"
				title={(<div>USER PROFILE</div>)}
				className="absolute-center" 
				showModal={showProfileModal} 
				toogleModal={this.closeProfileModal}
				body={(
					<Container className="p-0" style={{minWidth: "380px", maxWidth: "800px"}}>
						{
							userSelected ?
								<div>
									<Row className="mb-3">
										<Col lg="12">
											<div
												className={`position-relative w-100 border-bottom overflow-hidden ${userSelected.links[0] && userSelected.links[0].url ? "bg-white" : "bg-light"}`}
												style={{paddingBottom: "100%"}}
											>
												{
													userSelected.links[0] && userSelected.links[0].url ?
														<img
															width="100%" 
															className="absolute-center"
															src={userSelected.links[0].url} 
															alt={userSelected.full_name} 
														/>
														:
														<i className="icon icon-user absolute-center text-999999" style={{fontSize: "18em"}}/>
												}
												
											</div>
										</Col>
									</Row>
									<Row>
										<Col lg="12" className="font-14">
											<Row>
												<Col sm="4" className="font-weight-bold pr-0">First Name <span className="d-block float-right mr-2">:</span></Col>
												<Col sm="8" className="text-wrap text-break pl-0">{userSelected.first_name ? userSelected.first_name : "-"}</Col>
											</Row>
											<hr />
											<Row>
												<Col sm="4" className="font-weight-bold pr-0">Middle Name <span className="d-block float-right mr-2">:</span></Col>
												<Col sm="8" className="text-wrap text-break pl-0">{userSelected.middle_name ? userSelected.middle_name : "-"}</Col>
											</Row>
											<hr />
											<Row>
												<Col sm="4" className="font-weight-bold pr-0">Last Name <span className="d-block float-right mr-2">:</span></Col>
												<Col sm="8" className="text-wrap text-break pl-0">{userSelected.last_name ? userSelected.last_name : "-"}</Col>
											</Row>
											<hr />
											<Row>
												<Col sm="4" className="font-weight-bold pr-0">Phone <span className="d-block float-right mr-2">:</span></Col>
												<Col sm="8" className="text-wrap text-break pl-0">{userSelected.phone_number ? userSelected.phone_number : "-"}</Col>
											</Row>
											<hr />
											<Row>
												<Col sm="4" className="font-weight-bold pr-0">Email <span className="d-block float-right mr-2">:</span></Col>
												<Col sm="8" className="text-wrap text-break pl-0">{userSelected.email ? userSelected.email : "-"}</Col>
											</Row>
											<hr />
											<Row>
												<Col sm="4" className="font-weight-bold pr-0">Join Date <span className="d-block float-right mr-2">:</span></Col>
												<Col sm="8" className="text-wrap text-break pl-0">{utcToDateTime(userSelected.created, true, true)}</Col>
											</Row>
										</Col>
									</Row>
								</div>
								:
								<LoaderCard {...tableLoaderProps} />
						}
					</Container>
				)}
			>
				{
					userSelected && userSelected.account.enabled ?
						<Button 
							color="danger" 
							onClick={() => this.showChangeStatusModal(userSelected, 'Lock')}
						><i className="icon icon-lock"/> Lock</Button>
						:
						<Button 
							color="warning" 
							onClick={() => this.showChangeStatusModal(userSelected, 'Unlock')}
						><i className="icon icon-unlock1"/> Unlock</Button>
				}
				<Button color="secondary" className="float-right" onClick={this.closeProfileModal}>Close</Button>
			</ModalBox>
		)
	}
	// GENERAL ALERT MODAL
	renderModalAlert() {
		const { showAlertModal, alertModalMessage } = this.state
		return (
			<ModalBox
				title={(<div>Warning</div>)}
				size="lg"
				className="absolute-center" 
				showModal={showAlertModal} 
				toogleModal={() => this.setState({showAlertModal: false})}
				body={(
					<div style={{minWidth: 310}}>{alertModalMessage}</div>
				)}
			>
				<Button color="secondary" className="mr-2 float-right" onClick={() => this.setState({showAlertModal: false})}>Close</Button>
			</ModalBox>
		)
	}
	// END FUNCTION RENDER

	render() {
		const { showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, onFetch, listCustomer, fetchPage, fetchLen, fetchSort, fetchOrder } = this.state
		// console.log(listCustomer)
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
						<Col lg="12" className="mb-5">
                            <h1 className="text-primary">List Customer</h1>
							<span><i className="icon-paperclip mx-1" />Total {listCustomer.total_elements} {listCustomer.total_elements > 1 ? 'Customers' : 'Customer'}</span>
                        </Col>
						<Col xs="12">
							<AdvanceTableBox 
								isResponsive={true} 
								tHead={[
									{ id: "first_name", name: "Full Name" },
									{ id: "phone_number", name: "Phone" },
									{ id: "email", name: "Email" },
									{ id: "created", name: "Register Date" },
									{ id: "user.enabled", name: "Status" },
									{ name: "Action" }
								]}
								listNumber={true}
								sortItems={[
									{ id: "first_name", name: "Full Name" }, 
									{ id: "phone_number", name: "Phone" },
									{ id: "email", name: "Email" }, 
									{ id: "created", name: "Register Date" },
									{ id: "user.enabled", name: "Status" }
								]}
								onSortClick={this.onSortInit}
								sortValue={fetchSort}
								orderValue={fetchOrder}
								onTargetSortClick={this.onTargetSortInit}
								onKeySearch={this.onSearchKeyInit}
								searchCategory={["First Name", "Email"]}
								noResult={listCustomer.content.length === 0}
								pagination={
									<Pagination 
										ariaLabel="Page navigation"
										size="sm"
										onClick={this.onPaginationClick}
										totalContent={listCustomer.total_elements}
										currentPage={fetchPage}
										contentMaxLength={fetchLen}
									/>
								}
							>
								{
									!onFetch ?
										listCustomer.content.map((customer, i) => (
											<tr key={i}>
												<th className="pt-2" scope="row">{(i + 1) + (fetchPage > 1 ? (fetchPage-1) * fetchLen : 0)}</th>
												<td className="text-wrap text-break pt-2 pr-3">{customer.full_name}</td>
												<td className="text-wrap text-break pt-2 pr-3">{customer.phone_number}</td>
												<td className="text-wrap text-break pt-2 pr-3">{customer.account.username}</td>
												<td className="text-wrap text-break pt-2 pr-3">{utcToDateTime(customer.created, true)}</td>
												<td className="text-wrap text-break pt-2 pr-3">
													{
														customer.account.enabled ? 
															<span style={{color:"green"}}>Active</span> : <span style={{color:"gray"}}>Inactive</span>
													}
												</td>
												{/* <td scope="row">
													<span className="font-20">
														<i className={`icon ${customer.social_medias.facebook ? 'icon-check text-primary' : 'icon-x text-999999'}`} /> 
													</span>
												</td>
												<td scope="row">
													<span className="font-20">
														<i className={`icon ${customer.social_medias.google ? 'icon-check text-primary' : 'icon-x text-999999'}`} /> 
													</span>
												</td> */}
												<td>
													<div className="d-flex w-100">
														<Button 
															color='primary' 
															size="sm" 
															className="mr-1 mb-1"
															onClick={() => this.showProfileModal(customer)}
														><i className="icon icon-eye"/></Button>
														{
															customer.account.enabled ?
																<Button 
																	color="danger" 
																	className="mr-1 mb-1" 
																	size="sm" 
																	onClick={() => this.showChangeStatusModal(customer, 'Lock')}
																><i className="icon icon-lock"/></Button>
																:
																<Button 
																	color="warning" 
																	className="mr-1 mb-1" 
																	size="sm" 
																	onClick={() => this.showChangeStatusModal(customer, 'Unlock')}
																><i className="icon icon-unlock1"/></Button>
														}
													</div>
												</td>
											</tr>
										))
										:
										<tr><td colSpan="7"><LoaderCard {...tableLoaderProps} /></td></tr>
								}
							</AdvanceTableBox>
						</Col>
					</Row>
				</Container>
				{ this.renderProfileModal() }
				{ this.renderModalChangeStatusConfirmation() }
				{ this.renderModalAlert() }
			</div>
		)
	}
}
const mapDispatchToProps = dispatch => {
	return {
		customerList: bindActionCreators(customerList, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(UserCustomer)