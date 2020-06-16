import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import { Container, Row, Col, Button } from 'reactstrap'
import FormInput from '../../components/form/inputForm'
import AdvanceTableBox from '../../components/tables/advanceTable'
import Pagination from '../../components/cards/PaginationCard'
import LoaderCard from '../../components/cards/LoaderCard'
import ModalBox from '../../components/cards/modalBoxCard'
import { regexHtmlTag } from '../../components/functions' 
import { auth, getProvinces, getCities, addProvinces, editProvinces, addCities, editCities } from '../../components/actions'

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

class MasterLocation extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/master-location", 
			page: 1, size: 10, sortBy: "name", orderBy: "asc", keywords: "", token: token 
		}
		try {
			await store.dispatch(getProvinces(props.page, props.size, props.sortBy, props.orderBy, token, props.keywords))
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
			fetchPage: props.page,
			fetchLen: props.size,
			fetchSortBy: props.sortBy,
			fetchOrderBy: props.orderBy,
			fetchSearchKey: props.keywords,
			_listProvince: props.listProvince,
			onFetch: false,

			// MODAL STATE
			showEditProvinceModal: false,
			showAddProvinceModal: false,
			showAddCityModal: false,
			showEditCityModal: false, 

			formEditCityName: "", 
			_pickedCity: null,

			formEditProvinceName: "",
			formAddProvinceName: "",
			formAddCityName: "",
			initPostAdd: false,
			
			_pickedProvince: null,
			_listCitiesOfProvince: null,

			// CITY STATE
			fetchPageCity: 1,
			fetchLenCity: 5,
			fetchSortCityBy: 'name',
			fetchOrderCityBy: 'asc',
			fetchSearchCityKey: '',

			showAlertModal: false, 
			alertModalMessage: ""
		}
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			_listProvince: nextProps.listProvince,
		})
	}

	handleChange = (e) => {
		const target = e.target, value = regexHtmlTag(target.value), name = target.name
		this.setState({ [name]: value })
	}
	
	onSortProvinceInit = (e) => {
		let pages = 1
		const target = e.target, value = target.value
		const { getProvinces, token } = this.props
		const { fetchLen, fetchOrderBy, fetchSearchKey, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchPage: pages, fetchSortBy: value },
				async () => {
					const resp = await getProvinces(pages, fetchLen, value, fetchOrderBy, JSON.stringify(token), fetchSearchKey)
					if(resp.status) {
						this.setState({onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onTargetSortProvince = (data) => {
		let pages = 1
		const { getProvinces, token } = this.props
		const { fetchLen, fetchSortBy, fetchOrderBy, fetchSearchKey, onFetch } = this.state
		const orders = fetchSortBy != data.id ? 'desc' : fetchOrderBy == 'desc' ? 'asc' : 'desc'
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchPage: pages, fetchSortBy: data.id, fetchOrderBy: orders },
				async () => {
					const resp = await getProvinces(pages, fetchLen, data.id, orders, JSON.stringify(token), fetchSearchKey)
					if(resp.status) {
						this.setState({onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onSearchProvinceInit = (keywords) => {
		let pages = 1, orders = "asc", sorts = "name"
		const { getProvinces, token } = this.props
		const { fetchLen, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchPage: pages, fetchSearchKey: keywords, fetchOrderBy: orders, fetchSortBy: sorts },
				async () => {
					const resp = await getProvinces(pages, fetchLen, sorts, orders, JSON.stringify(token), keywords) 
					if(resp.status) {
						this.setState({onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onPaginationProvince = (page) => {
		const { getProvinces, token } = this.props
		const { fetchLen, fetchOrderBy, fetchSortBy, fetchSearchKey, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchPage: page },
				async () => {
					const resp = await getProvinces(page, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(token), fetchSearchKey)
					if(resp.status) {
						this.setState({onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	// CITY FN
	onSortCityInit = (e) => {
		let pages = 1
		const target = e.target, value = target.value
		const { fetchLenCity, fetchOrderCityBy, fetchSearchCityKey, _pickedProvince } = this.state
		this.setState(
			{ fetchPageCity: pages, fetchSortCityBy: value },
			async () => {
				const resp = await getCities(pages, fetchLenCity, value, fetchOrderCityBy, JSON.stringify(this.props.token), fetchSearchCityKey, _pickedProvince.id)
				if(resp.status) {
					this.setState({_listCitiesOfProvince: resp.data})
				} else {
					this.setState({showAlertModal: true, alertModalMessage: resp.message})
				}
			}
		)
	}

	onTargetSortCity = (data) => {
		let pages = 1
		const { fetchLenCity, fetchSortCityBy, fetchOrderCityBy, fetchSearchCityKey, _pickedProvince } = this.state
		const orders = fetchSortCityBy != data.id ? 'desc' : fetchOrderCityBy == 'desc' ? 'asc' : 'desc'
		this.setState(
			{ fetchPageCity: pages, fetchSortCityBy: data.id, fetchOrderCityBy: orders },
			async () => {
				const resp = await getCities(pages, fetchLenCity, data.id, orders, JSON.stringify(this.props.token), fetchSearchCityKey, _pickedProvince.id)
				if(resp.status) {
					this.setState({_listCitiesOfProvince: resp.data})
				} else {
					this.setState({showAlertModal: true, alertModalMessage: resp.message})
				}
			}
		)
	}

	onSearchCityInit = (keywords) => {
		let pages = 1, orders = "asc"
		const { fetchLenCity, fetchSortCityBy, _pickedProvince } = this.state
		this.setState(
			{ fetchPageCity: pages, fetchSearchCityKey: keywords, fetchOrderCityBy: orders, },
			async () => {
				const resp = await getCities(pages, fetchLenCity, fetchSortCityBy, orders, JSON.stringify(this.props.token), keywords, _pickedProvince.id)
				if(resp.status) {
					this.setState({_listCitiesOfProvince: resp.data})
				} else {
					this.setState({showAlertModal: true, alertModalMessage: resp.message})
				}
			}
		)
	}

	onPaginationCity = (page) => {
		const { fetchLenCity, fetchOrderCityBy, fetchSortCityBy, fetchSearchCityKey, _pickedProvince } = this.state
		this.setState(
			{ fetchPageCity: page },
			async () => {
				const resp = await getCities(page, fetchLenCity, fetchSortCityBy, fetchOrderCityBy, JSON.stringify(this.props.token), fetchSearchCityKey, _pickedProvince.id)
				if(resp.status) {
					this.setState({_listCitiesOfProvince: resp.data})
				} else {
					this.setState({showAlertModal: true, alertModalMessage: resp.message})
				}
			}
		)
	}

	showAddProvinceModal = () => this.setState({showAddProvinceModal: true})
	closeAddProvinceModal = () => this.setState({showAddProvinceModal: false})
	closeEditProvinceModal = () => this.setState({showEditProvinceModal: false})
	showAddCityModal = () => this.setState({showAddCityModal: true})
	closeAddCityModal = () => this.setState({showAddCityModal: false})
	closeEditCityModal = () => this.setState({showEditCityModal: false})

	addProvince = () => { 
		const { formAddProvinceName, initPostAdd, fetchLen, fetchSortBy, fetchOrderBy } = this.state
		const { token, getProvinces } = this.props
		let newToken = JSON.stringify(token)
		if(formAddProvinceName && formAddProvinceName.length > 1 && !initPostAdd) {
			this.setState(
				{ initPostAdd: true },
				async () => {
					const resp = await addProvinces(formAddProvinceName, newToken)
					if(resp.status) {
						this.setState(
							{ fetchPage: 1, showAddProvinceModal: false, initPostAdd: false, _pickedProvince: resp.data, _listCitiesOfProvince: null },
							() => {
								this.setState({showAddCityModal: true})
								getProvinces(1, fetchLen, fetchSortBy, fetchOrderBy, newToken)
							}
						)
					} else {
						this.setState({initPostAdd: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}
	editProvince = (data) => this.setState({_pickedProvince: data, formEditProvinceName: data.name}, () => this.setState({showEditProvinceModal: true}))
	saveEditProvince = async (data) => {
		const { formEditProvinceName, fetchLen, fetchSortBy } = this.state
		if(formEditProvinceName && formEditProvinceName.length > 1) {
			const { token, getProvinces } = this.props
			let newToken = JSON.stringify(token)
			let resp = await editProvinces(formEditProvinceName, data.id, newToken)
			if(resp.status) {
				let page = 1, orders = "asc"
				this.setState(
					{ showEditProvinceModal: false, fetchPage: page, fetchOrderBy: orders },
					() => getProvinces(page, fetchLen, fetchSortBy, orders, newToken)
				)
			} else {
				this.setState({showAlertModal: true, alertModalMessage: resp.message})
			}
		}
	}
	
	addCity = () => {
		const { formAddCityName, initPostAdd, _pickedProvince } = this.state
		let newToken = JSON.stringify(this.props.token)
		if(formAddCityName && formAddCityName.length > 1 && !initPostAdd) {
			this.setState(
				{ initPostAdd: true },
				async () => {
					const resp = await addCities(formAddCityName, _pickedProvince.id, newToken)
					if(resp.status) {
						const { fetchLenCity, fetchOrderCityBy, fetchSortCityBy } = this.state
						const lists = await getCities(1, fetchLenCity, fetchSortCityBy, fetchOrderCityBy, newToken, '', _pickedProvince.id)
						if(lists.status) {
							this.setState({fetchPageCity: 1, _listCitiesOfProvince: lists.data, initPostAdd: false, fetchSearchCityKey: ''})
						} else {
							this.setState({initPostAdd: false, showAlertModal: true, alertModalMessage: lists.message})
						}
					} else {
						this.setState({initPostAdd: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}
	viewCities = (data) => {
		let pages = 1
		this.setState(
			{ _pickedProvince: data, fetchPageCity: pages },
			async () => {
				const { fetchLenCity, fetchOrderCityBy, fetchSortCityBy } = this.state
				const lists = await getCities(pages, fetchLenCity, fetchSortCityBy, fetchOrderCityBy, JSON.stringify(this.props.token), '', data.id)
				if(lists.status) {
					this.setState({_listCitiesOfProvince: lists.data, fetchSearchCityKey: ''}, () => this.showAddCityModal())
				} else {
					this.setState({showAlertModal: true, alertModalMessage: lists.message})
				}
			}
		)
	}
	editCity = (data) => this.setState({_pickedCity: data, formEditCityName: data.name}, () => this.setState({showEditCityModal: true}))
	saveEditCity = async (data) => {
		const { formEditCityName, fetchLenCity, fetchSortCityBy } = this.state
		if(formEditCityName && formEditCityName.length > 1) {
			let newToken = JSON.stringify(this.props.token)
			let res = await editCities(formEditCityName, data.province.id, data.id, newToken)
			if(res.status) {
				let page = 1, orders = "asc", keywords = ""
				this.setState(
					{ showEditProvinceModal: false, fetchPageCity: page, fetchOrderCityBy: orders, fetchSearchCityKey: keywords },
					async () => {
						this.closeEditCityModal()
						const lists = await getCities(page, fetchLenCity, fetchSortCityBy, orders, JSON.stringify(this.props.token), keywords, data.province.id)
						if(lists.status) {
							this.setState({_listCitiesOfProvince: lists.data})
						} else {
							this.setState({showAlertModal: true, alertModalMessage: lists.message})
						}
					}
				)
			}
		}
	}

	renderEditCityModal() {
		const { showEditCityModal, formEditCityName, _pickedCity } = this.state
		return (
			<ModalBox
				size="lg"
				title={(<div>Edit {_pickedCity ? _pickedCity.name : "City"}</div>)}
				className="absolute-center" 
				showModal={showEditCityModal} 
				toogleModal={this.closeEditCityModal}
				body={(
					<Container className="p-0" style={{minWidth: 320}}>
						<Row>
							<Col lg="12">
								<FormInput 
									withLabel={true}
									labelName="City Name"
									labelClassName="font-14 mb-0 text-999999"
									containerClassName="mb-3"
									formClassName="p-2 bg-white mb-0"
									formId="formEditCityName" 
									formType="text" 
									formName="formEditCityName" 
									formPlaceholder={_pickedCity ? _pickedCity.name : ""}
									onChange={this.handleChange} 
									formValue={formEditCityName}
								/>
							</Col>
						</Row>
					</Container>
				)}
			>
				<Button color="secondary" className="float-left" onClick={this.closeEditCityModal}>Cancel</Button>
				<Button color="primary" className="float-right" onClick={() => this.saveEditCity(_pickedCity)}>Save Changes</Button>
			</ModalBox>
		)
	}

	renderEditProvinceModal() {
		const { showEditProvinceModal, formEditProvinceName, _pickedProvince } = this.state
		return (
			<ModalBox
				size="lg"
				title={(<div>Edit {_pickedProvince ? _pickedProvince.name : "Province"}</div>)}
				className="absolute-center" 
				showModal={showEditProvinceModal} 
				toogleModal={this.closeEditProvinceModal}
				body={(
					<Container className="p-0" style={{minWidth: 320}}>
						<Row>
							<Col lg="12">
								<FormInput 
									withLabel={true}
									labelName="Province Name"
									labelClassName="font-14 mb-0 text-999999"
									containerClassName="mb-3"
									formClassName="p-2 bg-white mb-0"
									formId="formEditProvinceName" 
									formType="text" 
									formName="formEditProvinceName" 
									formPlaceholder={_pickedProvince ? _pickedProvince.name : ""}
									onChange={this.handleChange} 
									formValue={formEditProvinceName}
								/>
							</Col>
						</Row>
					</Container>
				)}
			>
				<Button color="secondary" className="float-left" onClick={this.closeEditProvinceModal}>Cancel</Button>
				<Button color="primary" className="float-right" onClick={() => this.saveEditProvince(_pickedProvince)}>Save Changes</Button>
			</ModalBox>
		)
	}

	renderAddProvinceModal() {
		const { showAddProvinceModal, formAddProvinceName } = this.state
		return (
			<ModalBox
				size="lg"
				title={(<div>Add New Province</div>)}
				className="absolute-center" 
				showModal={showAddProvinceModal} 
				toogleModal={this.closeAddProvinceModal}
				body={(
					<Container className="p-0" style={{minWidth: 320}}>
						<Row>
							<Col lg="12">
								<FormInput 
									withLabel={true}
									labelName="Province Name"
									labelClassName="font-14 mb-0 text-999999"
									containerClassName="mb-3"
									formClassName="p-2 bg-white mb-0"
									formId="formAddProvinceName" 
									formType="text" 
									formName="formAddProvinceName" 
									formPlaceholder="Province Name" 
									onChange={this.handleChange} 
									formValue={formAddProvinceName}
								/>
							</Col>
						</Row>
					</Container>
				)}
			>
				<Button color="secondary" className="float-left" onClick={this.closeAddProvinceModal}>Cancel</Button>
				<Button color="primary" className="float-right" onClick={this.addProvince}><i className="icon icon-navigation" /> Submit</Button>
			</ModalBox>
		)
	}

	renderAddCityModal() {
		const { 
			showAddCityModal, formAddCityName, _pickedProvince, _listCitiesOfProvince, 
			fetchPageCity, fetchLenCity, fetchSortCityBy, fetchOrderCityBy, fetchSearchCityKey 
		} = this.state
		return (
			<ModalBox
				size="lg"
				title={(<div>Add New City {_pickedProvince ? 'In ' + _pickedProvince.name : ""}</div>)}
				className="absolute-center" 
				showModal={showAddCityModal} 
				toogleModal={this.closeAddCityModal}
				body={(
					<Container className="p-0" style={{minWidth: 320}}>
						<Row>
							<Col lg="12">
								<FormInput 
									withLabel={true}
									labelName="City Name"
									labelClassName="font-14 mb-0 text-999999 w-100"
									containerClassName="mb-3"
									formClassName="p-2 bg-white mb-0 w-100"
									formId="formAddCityName" 
									formType="text" 
									formName="formAddCityName" 
									formPlaceholder="City Name" 
									onChange={this.handleChange} 
									formValue={formAddCityName}
								>
									<Button color="primary" className="w-100 mt-2" onClick={this.addCity}><i className="icon icon-plus" /> Add City</Button>
								</FormInput>
							</Col>
							<Col lg="12">
								{
									_listCitiesOfProvince ?
										<AdvanceTableBox 
											isResponsive={true} 
											tHead={[{ id: "name", name: "City" }, { name: "Actions" }]}
											listNumber={true}
											sortItems={[{ id: "name", name: "City"}]}
											onSortClick={this.onSortCityInit}
											sortValue={fetchSortCityBy}
											onTargetSortClick={this.onTargetSortCity}
											orderValue={fetchOrderCityBy}
											onKeySearch={this.onSearchCityInit}
											searchCategory={["City"]}
											noResult={_listCitiesOfProvince.content.length === 0}
											pagination={
												<Pagination 
													ariaLabel="Page navigation" size="sm"
													onClick={this.onPaginationCity}
													totalContent={_listCitiesOfProvince.total_elements}
													currentPage={fetchPageCity}
													contentMaxLength={fetchLenCity}
												/>
											}
										>
											{
												_listCitiesOfProvince.content.map((data, key) => (
													<tr key={key}>
														<th scope="row" width="50px">{(key + 1) + (fetchPageCity > 1 ? (fetchPageCity-1) * fetchLenCity : 0)}</th>
														<td style={{width: "60%"}}>{data.name}</td>
														<td style={{width: "30%"}}>
															<div className="d-flex w-100">
																<Button 
																	color='warning' size="sm" 
																	className="d-flex mr-1 mb-1"
																	onClick={() => this.editCity(data)}
																><i className="icon icon-edit" /></Button>
															</div>
														</td>
													</tr>
												))
											}
										</AdvanceTableBox>
										:
										<div className="w-100 text-center py-5 text-999999">No city available</div>
								}
							</Col>
						</Row>
					</Container>
				)}
			>
				<Button color="secondary" className="float-right" onClick={this.closeAddCityModal}>Close</Button>
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
					<div style={{maxWidth: 310}}>{alertModalMessage}</div>
				)}
			>
				<Button color="secondary" className="mr-2 float-right" onClick={() => this.setState({showAlertModal: false})}>Close</Button>
			</ModalBox>
		)
	}

	render() {
		const { 
			showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, fetchOrderBy, fetchSortBy, fetchPage, fetchLen, _listProvince, onFetch
		} = this.state
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
						<Col lg="12" className="mb-3">
							<h1 className="text-primary">Location</h1>
							<span><i className="icon-paperclip mx-1" />Total {_listProvince ? _listProvince.total_elements : "0"} Location{_listProvince && _listProvince.total_elements > 1 ? "s" : ""}</span>
						</Col>
						<Col xs="12" className="d-flex justify-content-end mb-3">
							<Button size="sm" color="primary" className="py-2 px-3" onClick={() => this.showAddProvinceModal()}><i className="icon icon-plus" /> ADD PROVINCE</Button>
						</Col>
						<Col xs="12">
							{
								_listProvince.content ?
									<AdvanceTableBox 
										isResponsive={true} 
										tHead={[{ id: "name", name: "Province" }, { name: "Actions" }]}
										listNumber={true}
										sortItems={[{ id: "name", name: "Province"}]}
										onSortClick={this.onSortProvinceInit}
										sortValue={fetchSortBy}
										onTargetSortClick={this.onTargetSortProvince}
										orderValue={fetchOrderBy}
										onKeySearch={this.onSearchProvinceInit}
										searchCategory={["Province"]}
										noResult={_listProvince.content.length === 0}
										pagination={
											<Pagination 
												ariaLabel="Page navigation" size="sm"
												onClick={this.onPaginationProvince}
												totalContent={_listProvince.total_elements}
												currentPage={fetchPage}
												contentMaxLength={fetchLen}
											/>
										}
									>
										{
											!onFetch ?
												_listProvince.content.map((data, key) => (
													<tr key={key}>
														<th scope="row" width="50px">{(key + 1) + (fetchPage > 1 ? (fetchPage-1) * fetchLen : 0)}</th>
														<td style={{width: "60%"}}>{data.name}</td>
														<td style={{width: "30%"}}>
															<div className="d-flex w-100">
																<Button 
																	color='primary' size="sm" 
																	className="d-flex mr-1 mb-1"
																	onClick={() => this.viewCities(data)}
																>View Cities</Button>
																<Button 
																	color='warning' size="sm" 
																	className="d-flex mr-1 mb-1"
																	onClick={() => this.editProvince(data)}
																><i className="icon icon-edit" /></Button>
															</div>
														</td>
													</tr>
												))
												:
												<tr><td colSpan="3"><LoaderCard {...tableLoaderProps} /></td></tr>
										}
									</AdvanceTableBox>
									:
									<div className="w-100 text-center py-5 text-999999">No data available</div>
							}
						</Col>
					</Row>
				</Container>
				{ this.renderAddProvinceModal() }
				{ this.renderAddCityModal() }
				{ this.renderEditProvinceModal() }
				{ this.renderEditCityModal() }
				{ this.renderModalAlert() }
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getProvinces: bindActionCreators(getProvinces, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(MasterLocation)