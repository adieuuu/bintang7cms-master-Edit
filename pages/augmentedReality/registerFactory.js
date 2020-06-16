import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AdvanceTableBox from '../../components/tables/advanceTable'
import SimpleTableBox from '../../components/tables/simpleTable'
import Pagination from '../../components/cards/PaginationCard'
import { Container, Row, Col, Button, Input } from 'reactstrap'
import Link from 'next/link'
import nextCookie from 'next-cookies'
import ModalBox from '../../components/cards/modalBoxCard'
import LoaderCard from '../../components/cards/LoaderCard'
import { regexHtmlTag, slugifyUrl, utcToDateTime } from '../../components/functions'
import { auth, getFactories, saveFactoryRooms, publishFactoryRooms } from '../../components/actions'

const tableLoaderProps = {
	className: "w-100 position-relative d-block mt-5",
	loaderColor: "primary",
	style: {
		top: 0,
		left: 0,
		backgroundColor: "rgba(255,255,255,0.75)",
		height: "120px",
		zIndex: 2
	}
}

class ARRegisterFactory extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, 
			listPage: 1, listMaxLen: 10, listSortBy: "scheduled_date", listOrderBy: "desc", keyword: "", filterBy: false,
			pageName: "/register-factory", token: token 
		}
		try {
			await store.dispatch(getFactories(props.listPage, props.listMaxLen, props.listSortBy, props.listOrderBy, token, props.keyword, props.filterBy))
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
			fetchPage: props.listPage,
			fetchLen: props.listMaxLen,
			fetchSortBy: props.listSortBy,
			fetchOrderBy: props.listOrderBy,
			fetchKeyword: props.keyword,
			fetchFilterBy: props.filterBy,
			fetchFilterDateOption: { from: 0, to: 0, value: "" },
			fetchFilterReset: false,
			listFactories: props.listFactories,
			onFetch: false,
			_assignedRegistration: null,
			showSetRoomModal: false,
			_pickedRegistration: null,
			showAlertModal: false, 
			alertModalMessage: ""
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			listFactories: nextProps.listFactories
		})
	}

	showSetRoom = (data) => this.setState({
			showSetRoomModal: true, 
			_pickedRegistration: data, 
			_assignedRegistration: this.formatRoomAssign(data.schedule.schedule_rooms)
		})
	closeSetRoom = () => this.setState({showSetRoomModal: false})

	formatRoomAssign = (data) => {
		return data.map(item => {
			return { time: item.time, quantity: 0 }
		})
	}

	onFilterReset = () => {
		const { fetchFilterBy, fetchPage } = this.state
		let sort = "scheduled_date", order = "desc"
		if(fetchFilterBy) {
			this.setState(
				{ fetchFilterBy: false, fetchSortBy: sort, fetchOrderBy: order }, 
				() => this.onPaginationClick(fetchPage)
			)
		}
	}

	onFilterDate = (dateFrom, dateTo, filterBy) => {
		let filterOpt = { isStatus: false, from: dateFrom, to: dateTo, value: filterBy }, pages = 1, orders = "desc"
		const { fetchLen, fetchKeyword, onFetch } = this.state
		if(!onFetch && filterBy) {
			this.setState(
				{ onFetch: true, fetchFilterBy: true, fetchFilterDateOption: filterOpt, fetchSortBy: filterBy, fetchOrderBy: orders },
				async () => {
					const { getFactories, token } = this.props
					const resp = await getFactories(pages, fetchLen, filterBy, orders, JSON.stringify(token), fetchKeyword, true, filterOpt)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onFilterStatus = (data) => {
		let filterOpt = { isStatus: true, value: data }, pages = 1, orders = "desc"
		const { fetchLen, fetchKeyword, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchFilterBy: true, fetchFilterDateOption: filterOpt, fetchSortBy: data, fetchOrderBy: orders },
				async () => {
					const { getFactories, token } = this.props
					const resp = await getFactories(pages, fetchLen, "status", orders, JSON.stringify(token), fetchKeyword, true, filterOpt)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onPaginationClick = (page) => {
		const { fetchLen, fetchSortBy, fetchOrderBy, fetchKeyword, fetchFilterBy, fetchFilterDateOption, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					const { getFactories, token } = this.props
					const resp = await getFactories(page, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(token), fetchKeyword, fetchFilterBy, fetchFilterDateOption)
					if(resp.status) {
						this.setState({fetchPage: page, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				} 
			)
		}
	}

	// onSortInit = (e) => { 
	// 	const { fetchLen, fetchOrderBy, fetchKeyword, onFetch } = this.state
	// 	const target = e.target, value = target.value, pages = 1
	// 	if(!onFetch) {
	// 		this.setState(
	// 			{ onFetch: true, fetchSortBy: value },
	// 			async () => {
	// 				const { getFactories, token } = this.props
	// 				const resp = await getFactories(pages, fetchLen, value, fetchOrderBy, JSON.stringify(token), fetchKeyword)
	// 				if(resp.status) {
	// 					this.setState({fetchPage: pages, onFetch: false})
	// 				} else {
					// 	this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					// }
	// 			}
	// 		)
	// 	}
	// }

	onTargetSortInit = (data) => {
		let pages = 1
		const { fetchLen, fetchSortBy, fetchOrderBy, fetchKeyword, fetchFilterBy, fetchFilterDateOption, onFetch } = this.state
		const orders = fetchSortBy != data.id ? 'desc' : fetchOrderBy == 'desc' ? 'asc' : 'desc'
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchSortBy: data.id, fetchOrderBy: orders },
				async () => {
					const { getFactories, token } = this.props
					const resp = await getFactories(pages, fetchLen, data.id, orders, JSON.stringify(token), fetchKeyword, fetchFilterBy, fetchFilterDateOption)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onSearchKeyInit = (keywords) => {
		let pages = 1, orders = "asc", sorts = "scheduled_date"
		const { fetchLen, fetchFilterBy, fetchFilterDateOption, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchKeyword: keywords, fetchSortBy: sorts, fetchOrderBy: orders },
				async () => {
					const { getFactories, token } = this.props
					const resp = await getFactories(pages, fetchLen, sorts, orders, JSON.stringify(token), keywords, fetchFilterBy, fetchFilterDateOption)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	assignRoomMembers = (e) => {
		const target = e.target, value = regexHtmlTag(target.value), id = target.id
		let newArr = this.state._assignedRegistration
		newArr[id].quantity = Number(value)
		this.setState({_assignedRegistration: newArr})
	}

	getTotalAssigned = (data) => {
		let total = 0
		data.forEach((arr) => { total = total + arr.quantity })
		return total
	}

	saveSetRoom = async () => {
		const { _pickedRegistration, _assignedRegistration, fetchSortBy, fetchOrderBy, fetchKeyword, fetchLen } = this.state
		let assignee = this.getTotalAssigned(_assignedRegistration)
		if(assignee > 0 && assignee <= _pickedRegistration.quantity) {
			let newAssigned = []
			await _assignedRegistration.forEach((arr) => {
				if(arr.quantity > 0) {
					newAssigned.push(arr)
				}
			})
			const { getFactories, token } = this.props
			const fetch = await saveFactoryRooms(_pickedRegistration.id, newAssigned, JSON.stringify(token))
			if(fetch.status) {
				this.setState(
					{ onFetch: true, fetchPage: 1, showSetRoomModal: false },
					async () => {
						const resp = await getFactories(1, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(token), fetchKeyword)
						if(resp.status) {
							this.setState({onFetch: false})
						} else {
							this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
						}
					}
				)
			} else {
				this.setState({showAlertModal: true, alertModalMessage: fetch.message})
			}
		}
	}

	publishSetRoom = async () => {
		const { _pickedRegistration, _assignedRegistration, fetchSortBy, fetchOrderBy, fetchKeyword, fetchLen } = this.state
		let assignee = this.getTotalAssigned(_assignedRegistration)
		if(assignee > 0 && assignee <= _pickedRegistration.quantity) {
			let newAssigned = []
			await _assignedRegistration.forEach((arr) => {
				if(arr.quantity > 0) {
					newAssigned.push(arr)
				}
			})
			const { getFactories, token } = this.props
			const fetch = await publishFactoryRooms(_pickedRegistration.id, newAssigned, JSON.stringify(token))
			if(fetch.status) {
				this.setState(
					{ onFetch: true, fetchPage: 1, showSetRoomModal: false },
					async () => {
						const resp = await getFactories(1, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(token), fetchKeyword)
						if(resp.status) {
							this.setState({onFetch: false})
						} else {
							this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
						}
					}
				)
			} else {
				this.setState({showAlertModal: true, alertModalMessage: fetch.message})
			}
		}
	}

	renderSetRoomModal() {
		const { showSetRoomModal, _pickedRegistration, _assignedRegistration } = this.state
		return (
			<ModalBox
				size="lg"
				title={(<div>Set Rooms</div>)}
				className="absolute-center" 
				showModal={showSetRoomModal} 
				body={(
					<Container className="p-0">
						<Row>
							<Col md="6">
								<Row>
									<Col lg="12" className="d-flex w-100">
										<span className="font-14 font-weight-bold d-inline-block" style={{width: "120px"}}>Participants</span>
										<strong className="font-14">:</strong>
										<span className="font-14 ml-3">{_pickedRegistration && _pickedRegistration.quantity ? _pickedRegistration.quantity : '-'}</span>
									</Col>
									<Col lg="12" className="d-flex w-100">
										<span className="font-14 font-weight-bold d-inline-block" style={{width: "120px"}}>PIC</span>
										<strong className="font-14">:</strong>
										<span className="font-14 ml-3">{_pickedRegistration && _pickedRegistration.owner ? _pickedRegistration.owner.full_name : ''}</span>
									</Col>
								</Row>
							</Col>
							<Col md="6">
								<Row>
									<Col lg="12" className="d-flex w-100">
										<span className="font-14 font-weight-bold d-inline-block" style={{width: "120px"}}>Name</span>
										<strong className="font-14">:</strong>
										<span className="font-14 ml-3">{_pickedRegistration && _pickedRegistration.name ? _pickedRegistration.name : ''}</span>
									</Col>
									<Col lg="12" className="d-flex w-100">
										<span className="font-14 font-weight-bold d-inline-block" style={{width: "120px"}}>Date</span>
										<strong className="font-14">:</strong>
										<span className="font-14 ml-3">{_pickedRegistration && _pickedRegistration.schedule ? _pickedRegistration.scheduled_date : ''}</span>
									</Col>
									<Col lg="12" className="d-flex w-100">
										<span className="font-14 font-weight-bold d-inline-block" style={{width: "120px"}}>Time</span>
										<strong className="font-14">:</strong>
										<span className="font-14 ml-3">{_pickedRegistration && _pickedRegistration.schedule ? _pickedRegistration.schedule.time : ''}</span>
									</Col>
								</Row>
							</Col>
						</Row>
						{
							_assignedRegistration ?
								<SimpleTableBox 
									className="bg-white p-0 mt-4 overflow-visible"
									isResponsive={true} 
									tHead={["Time", "Participant"]}
									listNumber={true}
									noResult={_assignedRegistration.length === 0}
								>
									{
										_assignedRegistration.map((data, key) => (
											<tr key={key}>
												<th scope="row" className="pt-2" width="50px">{key + 1}</th>
												<td className="pt-2">{data.time}</td>
												<td>
													<Input 
														className="p-2 bg-white mb-0"
														id={key} 
														type="number" 
														name="quantity"
														placeholder="Participant" 
														onChange={this.assignRoomMembers}
														value={data.quantity}
													/>
												</td>
											</tr>
										))
									}
									<tr>
										<td colSpan="2">Total:</td>
										<td>
											<strong className={this.getTotalAssigned(_assignedRegistration) > _pickedRegistration.quantity ? 'text-danger' : 'text-dark'}>{this.getTotalAssigned(_assignedRegistration)}</strong> of {_pickedRegistration.quantity}
										</td>
									</tr>
								</SimpleTableBox> : ""
						}
					</Container>
				)}
			>
				<Button color="primary" onClick={this.saveSetRoom}>Save</Button>
				<Button color="success" onClick={this.publishSetRoom}>Publish</Button>
				<Button color="secondary" className="float-right" onClick={this.closeSetRoom}>Cancel</Button>
			</ModalBox>
		)
	}

	renderStatus = (value) => {
		let newVal = value.toLowerCase()
		switch (newVal) {
			case 'unpaid':
				return <strong className="text-danger">UNPAID</strong>
			case 'paid':
				return <strong className="text-success">PAID</strong>
			case 'draft':
				return <strong className="text-666666">DRAFT</strong>
			case 'published':
				return <strong className="text-primary">PUBLISHED</strong>
			}
			return value;
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

	render() {
		const { showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, listFactories, fetchPage, fetchLen, fetchSortBy, fetchOrderBy, onFetch } = this.state
		// console.log(listFactories)
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
							<h1 className="text-primary mb-2">Factory Registration</h1>
							<span><i className="icon-paperclip mx-1" />Total {listFactories.total_elements} {listFactories.total_elements > 1 ? 'Registrations' : 'Registration'}</span>
						</Col>
						<Col lg="12">
							{
								listFactories ?
									<AdvanceTableBox 
										isResponsive={true} 
										tHead={[
											{ id: "owner.first_name", name: "Full Name" },
											{ id: "owner.email", name: "Email" },
											{ id: "name", name: "Institution" },
											{ id: "created", name: "Transaction Date" },
											{ id: "scheduled_date", name: "Schedule Date" },
											{ id: "quantity", name: "Participants"},
											{ id: "status", name: "Status" },
											{ name: "Action" }
										]}
										listNumber={true}
										sortItems={[
											{ id: "owner.first_name", name: "Full Name" },
											{ id: "owner.email", name: "Email" },
											{ id: "name", name: "Institution" },
											{ id: "created", name: "Transaction Date" },
											{ id: "scheduled_date", name: "Schedule Date" },
											{ id: "quantity", name: "Total Participants" },
											{ id: "status", name: "Status" },
										]}
										// onSortClick={this.onSortInit}
										sortValue={fetchSortBy}
										onTargetSortClick={this.onTargetSortInit}
										orderValue={fetchOrderBy}
										onKeySearch={this.onSearchKeyInit}
										searchCategory={["First Name", "Email", "Institution"]}
										noResult={listFactories.content.length === 0}
										onFilterReset={this.onFilterReset}
										maxRangeDateFilter={31}
										filterItems={[
											{ id: "created", name: "Transaction Date" },
											{ id: "scheduled_date", name: "Schedule Date" },
											{ id: "status", name: "Status" }
										]}
										onFilterDate={this.onFilterDate}
										filterStatus={[
											{ id: "Unpaid", name: "UNPAID" },
											{ id: "Paid", name: "PAID" },
											{ id: "Draft", name: "DRAFT" },
											{ id: "Published", name: "PUBLISHED" }
										]}
										onFilterStatus={this.onFilterStatus}
										pagination={
											<Pagination 
												ariaLabel="Page navigation"
												size="sm"
												onClick={this.onPaginationClick}
												totalContent={listFactories.total_elements}
												currentPage={fetchPage}
												contentMaxLength={fetchLen}
											/>
										}
									>
										{
											!onFetch ?
												listFactories.content.map((data, key) => (
													<tr key={key}>
														<th className="pt-2" scope="row">{(key + 1) + (fetchPage > 1 ? (fetchPage-1) * fetchLen : 0)}</th>
														<td className="text-wrap text-break pt-2 pr-3">{data.owner.full_name}</td>
														<td className="text-wrap text-break pt-2 pr-3">{data.owner.email}</td>
														<td className="text-wrap text-break pt-2 pr-3">{data.name}</td>
														<td className="text-wrap text-break pt-2 pr-3">{utcToDateTime(data.created, false)}</td>
														<td className="text-wrap text-break pt-2 pr-3">{data.scheduled_date}</td>
														<td className="text-wrap text-break pt-2 pr-3">{data.quantity}</td>
														<td className="text-upper">{this.renderStatus(data.status)}</td>
														<td>
															<div className="d-flex w-100">
																{
																	data.status == "Published" || data.status == 'Draft' ?
																		<Link 
																			href={`/augmentedReality/registerFactoryDetail?id=${data.id}&slug=${slugifyUrl(data.name)}`} 
																			as={`/register-factory/detail/${data.id}/${slugifyUrl(data.name)}`}
																		>
																			<a className="btn btn-sm btn-success d-flex mr-1 mb-1">View</a>
																		</Link> 
																		:
																		data.status == "Paid" ?
																			<Button 
																				color='primary' 
																				size="sm" 
																				className="d-flex mr-1 mb-1"
																				onClick={() => this.showSetRoom(data)}
																			>Process</Button> : ""
																}
															</div>
														</td>
													</tr>
												))
												:
												<tr><td colSpan="9"><LoaderCard {...tableLoaderProps} /></td></tr>
										}
									</AdvanceTableBox>
									:
									<div className="w-100 bg-white text-center py-5 text-999999">No data available</div>
							}
						</Col>
					</Row>
				</Container>
				{ this.renderSetRoomModal() }
				{ this.renderModalAlert() } 
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getFactories: bindActionCreators(getFactories, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(ARRegisterFactory)