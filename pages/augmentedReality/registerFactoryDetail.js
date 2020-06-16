import React from 'react'
import { connect } from 'react-redux'
import SimpleTableBox from '../../components/tables/simpleTable'
import Pagination from '../../components/cards/PaginationCard'
import { Container, Row, Col, Button } from 'reactstrap'
import nextCookie from 'next-cookies'
import _ from 'lodash'
import ModalBox from '../../components/cards/modalBoxCard'
import LoaderCard from '../../components/cards/LoaderCard'
import { auth, getFactoriesById, getDetailChecked } from '../../components/actions'

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

class ARRegisterFactoryDetail extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store, query } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/register-factory", token: token, factory_id: query.id
		}
		let stores = store.getState()
		let details = null
		if(stores.listFactories) details = await _.find(stores.listFactories.content, arr => { return arr.id === Number(props.factory_id) })
		if(!details) { 
			try {
				const fetchDetail = await getFactoriesById(props.factory_id, token)
				if(fetchDetail.status) {
					props.detailResult = fetchDetail.data
				}
			} catch (e) {
				props.error = 'Unable to fetch AsyncData on server'
			}
		} else {
			props.detailResult = details
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
			_factoryDetail: props.detailResult,
			onFetch: false,

			_pickedData: null,
			_pickedFactoryDetail: null,
			showDetailRoomModal: false,
			_fetchPage: 1,
			_fetchLen: 5,

			showAlertModal: false, 
			alertModalMessage: ""
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			_factoryDetail: nextProps.detailResult
		})
	}

	showGroupDetailById = (data) => {
		const { factory_id, token } = this.props
		const { _fetchPage, _fetchLen, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true, showDetailRoomModal: true, _pickedData: data },
				async () => {
					const fetch = await getDetailChecked(factory_id, data.id, _fetchPage, _fetchLen, token)
					if(fetch.status) {
						this.setState({_pickedFactoryDetail: fetch.data, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: fetch.message})
					}
				}
			)
		}		
	}
	closeGroupDetailById = () => this.setState({_pickedFactoryDetail: null, _pickedData: null, showDetailRoomModal: false, _fetchPage: 1})
	getItemsByCategory = (datas, str) => {
		return datas.filter(arr => arr.item.category === str)
	}

	onPaginationClick = (page) => {
		const { factory_id, token } = this.props
		const { _fetchLen, _pickedData, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true, _fetchPage: page },
				async () => {
					const fetch = await getDetailChecked(factory_id, _pickedData.id, page, _fetchLen, token)
					if(fetch.status) {
						this.setState({_pickedFactoryDetail: fetch.data, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: fetch.message})
					}
				}
			)
		}
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

	renderDetailGroup() {
		const { onFetch, _pickedData, _factoryDetail, _pickedFactoryDetail, showDetailRoomModal, _fetchPage, _fetchLen } = this.state
		return (
			<ModalBox
				size="lg"
				title={(
					<Row>
						<Col lg="12" className="d-flex w-100">
							<span className="font-14 font-weight-bold d-inline-block" style={{width: "120px"}}>Institution</span>
							<strong className="font-14">:</strong>
							<span className="font-14 ml-3">{_factoryDetail.name}</span>
						</Col>
						<Col lg="12" className="d-flex w-100">
							<span className="font-14 font-weight-bold d-inline-block" style={{width: "120px"}}>Sub Schedule</span>
							<strong className="font-14">:</strong>
							<span className="font-14 ml-3">{_pickedData ? _pickedData.time : ""}</span>
						</Col>
						<Col lg="12" className="d-flex w-100">
							<span className="font-14 font-weight-bold d-inline-block" style={{width: "120px"}}>Participant</span>
							<strong className="font-14">:</strong>
							<span className="font-14 ml-3">{_pickedData ? _pickedData.quantity : ""}</span>
						</Col>
						<Col lg="12" className="d-flex w-100">
							<span className="font-14 font-weight-bold d-inline-block" style={{width: "120px"}}>Group Code</span>
							<strong className="font-14">:</strong>
							<span className="font-14 ml-3">{_pickedData ? _pickedData.code : ""}</span>
						</Col>
					</Row>
				)}
				className="absolute-center" 
				showModal={showDetailRoomModal} 
				toogleModal={this.closeGroupDetailById}
				body={(
					<Container className="p-0">
						{
							!onFetch && _pickedFactoryDetail ?
								<SimpleTableBox 
									className="bg-white p-0 overflow-visible"
									isResponsive={true} 
									tHead={["Name", "Status", "Food", "Product"]}
									listNumber={true}
									noResult={_pickedFactoryDetail.content.length === 0}
									pagination={
										<Pagination 
											ariaLabel="Page navigation"
											size="sm"
											totalContent={_pickedFactoryDetail.total_elements}
											currentPage={_fetchPage}
											contentMaxLength={_fetchLen}
											onClick={this.onPaginationClick}
										/>
									}
								>
									{
										_pickedFactoryDetail.content.map((data, key) => (
											<tr key={key}>
												<th scope="row" width="50px">{(key + 1) + (_fetchPage > 1 ? (_fetchPage-1) * _fetchLen : 0)}</th>
												<td>{data.owner ? data.owner.full_name : "-"}</td>
												<td>
													{
														data.checked ? 
															<span className="text-success">Checked-In</span> 
															: <span className="text-999999">-</span> 
													}
												</td>
												<td>
													{
														data.items && data.items.length ?
															this.getItemsByCategory(data.items, 'food').map((arr, key) => (
																<span key={key} className="d-block">
																	- {arr.item.name} ({arr.quantity})
																</span>
															))
															: <span className="text-999999">-</span> 
													}
												</td>
												<td>
													{
														data.items && data.items.length ?
															this.getItemsByCategory(data.items, 'product').map((arr, key) => (
																<span key={key} className="d-block">
																	- {arr.item.name} ({arr.quantity})
																</span>
															))
															: <span className="text-999999">-</span> 
													}
												</td>
											</tr>
										))
									}
								</SimpleTableBox> : <LoaderCard {...tableLoaderProps} />
						}
					</Container>
				)}
			>
				<Button color="secondary" className="float-right" onClick={this.closeGroupDetailById}>Close</Button>
			</ModalBox>
		)
	}

	render() {
		const { showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, _factoryDetail } = this.state
		if(!_factoryDetail) {
			return (
				<div 
					role="main" 
					className="animate-all fast bg-white"
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
					><LoaderCard {...tableLoaderProps} /></Container>
				</div>
			)
		}
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
						<Col lg="12" className="mb-2">
							<h1 className="text-primary mb-2">Factory Registration Detail</h1>
						</Col>
					</Row>
					<Row>
						<Col lg="12" className="d-flex w-100">
							<span className="font-weight-bold d-inline-block" style={{width: "150px"}}>PIC</span>
							<b>:</b>
							<span className="ml-3">{_factoryDetail.owner.full_name}</span>
						</Col>
						<Col lg="12" className="d-flex w-100">
							<span className="font-weight-bold d-inline-block" style={{width: "150px"}}>Institution</span>
							<b>:</b>
							<span className="ml-3">{_factoryDetail.name}</span>
						</Col>
						<Col lg="12" className="d-flex w-100">
							<span className="font-weight-bold d-inline-block" style={{width: "150px"}}>Total Participant</span>
							<b>:</b>
							<span className="ml-3">{_factoryDetail.quantity}</span>
						</Col>
						<Col lg="12" className="d-flex w-100">
							<span className="font-weight-bold d-inline-block" style={{width: "150px"}}>Scheduled Date</span>
							<b>:</b>
							<span className="ml-3">{_factoryDetail.scheduled_date}</span>
						</Col>
						<Col lg="12" className="d-flex w-100">
							<span className="font-weight-bold d-inline-block" style={{width: "150px"}}>Scheduled Time</span>
							<b>:</b>
							<span className="ml-3">{_factoryDetail.schedule.time}</span>
						</Col>
						<Col lg="12" className="mt-4">
							{
								_factoryDetail.rooms ?
									<SimpleTableBox 
										title="Rooms Detail" 
										isResponsive={true} 
										tHead={["Group Number", "Sub Schedule", "Total Participant", "Group Code", "Action"]}
										listNumber={false}
										noResult={_factoryDetail.rooms.length === 0}
									>
										{
											_factoryDetail.rooms.map((data, key) => (
												<tr key={key}>
													<td><b>{data.number}</b></td>
													<td>{data.time}</td>
													<td>{data.quantity}</td>
													<td>{data.code}</td>
													<td>
														<Button 
															color='primary' 
															size="sm" 
															className="d-flex mr-1 mb-1"
															onClick={() => this.showGroupDetailById(data)}
														>Detail</Button>
													</td>
												</tr>
											))
										}
									</SimpleTableBox>
									: ""
							}
						</Col>
					</Row>
				</Container>
				{ this.renderDetailGroup() }
				{ this.renderModalAlert() } 
			</div>
		)
	}
}

export default connect(state => state, {})(ARRegisterFactoryDetail)