import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import _ from 'lodash'
import AdvanceTableBox from '../../components/tables/advanceTable'
import Pagination from '../../components/cards/PaginationCard'
import { Container, Row, Col, Button, Label, Badge } from 'reactstrap'
import ModalBox from '../../components/cards/modalBoxCard'
import { AvForm } from 'availity-reactstrap-validation'
import FormSelect from '../../components/form/selectForm'
import FormInputValidation from '../../components/form/validateInputForm'
import FormSelectValidation from '../../components/form/validateSelectForm'
import { regexHtmlTag } from '../../components/functions'
import LoaderCard from '../../components/cards/LoaderCard'
import { auth, getMasterScheduleList, editMasterScheduleById, deleteMasterScheduleById, addNewMasterSchedule } from '../../components/actions'

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

const listHours = [
	{ id: "07", name: "07" }, { id: "08", name: "08" }, { id: "09", name: "09" }, { id: "10", name: "10" }, { id: "11", name: "11" }, { id: "12", name: "12" },
	{ id: "13", name: "13" }, { id: "14", name: "14" }, { id: "15", name: "15" }, { id: "16", name: "16" }, { id: "17", name: "17" }, { id: "18", name: "18" }
]
const listMinutes = [
	{ id: "00", name: "00" }, { id: "05", name: "05" }, { id: "10", name: "10" }, { id: "15", name: "15" }, { id: "20", name: "20" }, { id: "25", name: "25" },
	{ id: "30", name: "30" }, { id: "35", name: "35" }, { id: "40", name: "40" }, { id: "45", name: "45" }, { id: "50", name: "50" }, { id: "55", name: "55" }
]
const getAvailTime = (id, datas) => {
	let index = datas.findIndex((arr) => { return arr.id == id })
	let newLists = datas.slice(index, datas.length)
	return newLists
}

class MasterSchedule extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/master-schedule", 
			listPage: 1, listMaxLen: 10, listSortBy: "name", listOrderBy: "desc", keyword: "", token: token
		}
		try {
			await store.dispatch(getMasterScheduleList(props.listPage, props.listMaxLen, props.listSortBy, props.listOrderBy, token, props.keyword))
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
			listSchedules: props.roomMaster,
			fetchPage: props.listPage,
			fetchLen: props.listMaxLen,
			fetchSortBy: props.listSortBy,
			fetchOrderBy: props.listOrderBy,
			fetchSearchKey: props.keyword,
			initFetch: false,
			
			// ADD STATE SCOPE
			showAddModal: false,
			formAddName: null,
			formAddDescription: null,
			formAddHour: "07",
			formAddMinute: "00",
			formAddCapacity: 0,

			// EDIT STATE SCOPE
			editedContent: null,
			showEditModal: false,
			formEditName: null,
			formEditDescription: null,
			formEditHour: null,
			formEditMinute: null,
			formEditCapacity: 0,

			listAvailChildHours: null,
			formEditChildHour: null, 
			formEditChildMinute: "00",
			formChildSchedule: [],

			// ADD/EDIT CHILD STATE SCOPE
			showEditChildModal: false,

			// DELETE STATE SCOPE
			deletedContent: null,
			showDeleteConfirmationModal: false,
			showAlertModal: false,
			alertModalMessage: ""
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			listSchedules: nextProps.roomMaster
		})
	}

	editModal = (data) => this.setState({
			editedContent: data, 
			showEditModal: true,
			formEditName: data.name,
			formEditDescription: data.description,
			formEditHour: (data.time.split(':'))[0],
			formEditMinute: (data.time.split(':'))[1],
			formEditChildHour: (data.time.split(':'))[0], 
			formEditChildMinute: (data.time.split(':'))[1],
			formChildSchedule: data.schedule_rooms,
			formEditCapacity: data.capacity,
			listAvailChildHours: getAvailTime((data.time.split(':'))[0], listHours)
		})

	closeEditModal = () => this.setState({showEditModal: false, editedContent: null, formChildSchedule: []})
	deleteConfirmModal = (data) => this.setState({deletedContent: data, showDeleteConfirmationModal: true})
	closeDeleteConfirmation = () => this.setState({showDeleteConfirmationModal: false, deletedContent: null})
	addItemModal = () => this.setState({
			showAddModal: true,
			formAddName: null,
			formAddDescription: null,
			formAddHour: "07",
			formAddMinute: "00",
			formAddCapacity: 0
		})
	closeAddItemModal = () => this.setState({showAddModal: false})

	handleChange = (e) => {
		const target = e.target, value = regexHtmlTag(target.value), name = target.name
		this.setState({ [name]: value })
		if(name == "formEditHour") {
			this.setState({
				listAvailChildHours: getAvailTime(value, listHours),
				formEditChildHour: value
			})
		}
	}
	handleChildSchedule = (e) => {
		const target = e.target, value = target.value, name = target.name
		this.setState({ [name]: regexHtmlTag(value) })
	}

	onPaginationClick = (page) => {
		const { initFetch, fetchLen, fetchSortBy, fetchOrderBy, fetchSearchKey } = this.state
		if(!initFetch) {
			this.setState(
				{ initFetch: true },
				async () => {
					const { getMasterScheduleList, token } = this.props
					const resp = await getMasterScheduleList(page, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(token), fetchSearchKey)
					if(resp.status) { 
						this.setState({initFetch: false, fetchPage: page}) 
					} else {
						this.setState({initFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onTargetSort = (data) => {
		const { initFetch, fetchLen, fetchSortBy, fetchOrderBy, fetchSearchKey } = this.state
		const orders = fetchSortBy != data.id ? 'desc' : fetchOrderBy == 'desc' ? 'asc' : 'desc'
		if(!initFetch) {
			this.setState(
				{ initFetch: true, fetchSortBy: data.id, fetchOrderBy: orders },
				async () => {
					const { getMasterScheduleList, token } = this.props
					const resp = await getMasterScheduleList(1, fetchLen, data.id, orders, JSON.stringify(token), fetchSearchKey)
					if(resp.status) { 
						this.setState({ fetchPage: 1, initFetch: false }) 
					} else {
						this.setState({initFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onSortInit = (e) => {
		const { fetchLen, fetchOrderBy, fetchSearchKey, initFetch } = this.state
		const target = e.target, value = target.value, pages = 1
		if(!initFetch) {
			this.setState(
				{ initFetch: true, fetchSortBy: value },
				async () => {
					const { getMasterScheduleList, token } = this.props
					const resp = await getMasterScheduleList(pages, fetchLen, value, fetchOrderBy, JSON.stringify(token), fetchSearchKey)
					if(resp.status) {
						this.setState({fetchPage: pages, initFetch: false})
					} else {
						this.setState({initFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onSearchKeyInit = (keywords) => {
		let pages = 1, orders = "desc", sorts = "name"
		const { fetchLen, initFetch } = this.state
		if(!initFetch) {
			this.setState(
				{ initFetch: true, fetchSearchKey: keywords, fetchSortBy: sorts, fetchOrderBy: orders },
				async () => {
					const { getMasterScheduleList, token } = this.props
					const resp = await getMasterScheduleList(pages, fetchLen, sorts, orders, JSON.stringify(token), keywords)
					if(resp.status) {
						this.setState({fetchPage: pages, initFetch: false})
					} else {
						this.setState({initFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	// ADD SECTION
	// Add Schedule Modal
	renderModalAddItems() {
		const { showAddModal, formAddName, formAddDescription, formAddHour, formAddMinute, formAddCapacity, initFetch } = this.state
		return (
			<ModalBox
				title={(<div>Add New Schedule</div>)}
				size="lg"
				className="absolute-center" 
				showModal={showAddModal} 
				toogleModal={this.closeAddItemModal}
				body={(
					<div style={{minWidth: 310}}>
						{
							!initFetch ? 
								<AvForm method="post" autoComplete="off">
									<Row>
										<Col lg="12">
											<FormInputValidation 
												withLabel={true}
												labelName="Name"
												labelClassName="font-14 mb-0 text-999999"
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="yourFormAddName" 
												formType="text" 
												formName="formAddName" 
												formPlaceholder="Schedule Name" 
												formErrorMessage="This form cannot be empty" 
												onChange={this.handleChange} 
												formValue={formAddName}
												formValidate={{required: { value: true, errorMessage: 'This form cannot be empty' }}} 
											/>
										</Col>
										<Col lg="12">
											<FormInputValidation 
												withLabel={true}
												labelName="Description"
												labelClassName="font-14 mb-0 text-999999"
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="yourFormAddDescription" 
												formType="text" 
												formName="formAddDescription" 
												formPlaceholder="Schedule Description" 
												formErrorMessage="This form cannot be empty" 
												onChange={this.handleChange} 
												formValue={formAddDescription}
												formValidate={{required: { value: true, errorMessage: 'This form cannot be empty' }}} 
											/>
										</Col>
										<Col lg="12">
											<FormInputValidation 
												withLabel={true}
												labelName="Maximum Capacity"
												labelClassName="font-14 mb-0 text-999999"
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="yourFormAddCapacity" 
												formType="number" 
												formName="formAddCapacity" 
												formPlaceholder="Field Capacity" 
												formErrorMessage="This form cannot be empty" 
												onChange={this.handleChange} 
												formValue={formAddCapacity}
												formValidate={{required: { value: true, errorMessage: 'This form cannot be empty' }}} 
											/>
										</Col>
										<Col lg="12" className="mb-3">
											<Row>
												<Col sm="6">
													<FormSelectValidation 
														withLabel={true}
														labelName="Hours"
														labelClassName="font-14 mb-0 text-999999"
														formClassName="px-2 bg-white mb-0"
														formId="yourFormAddHour" 
														formName="formAddHour" 
														formValue={formAddHour}
														formOptionData={listHours}
														onChange={this.handleChange}
														formErrorMessage="Hours cannot be empty" 
													/>
												</Col>
												<Col sm="6">
													<FormSelectValidation 
														withLabel={true}
														labelName="Minutes"
														labelClassName="font-14 mb-0 text-999999"
														formClassName="px-2 bg-white mb-0"
														formId="yourFormAddMinute" 
														formName="formAddMinute" 
														formValue={formAddMinute}
														formOptionData={listMinutes}
														onChange={this.handleChange}
														formErrorMessage="Minutes cannot be empty" 
													/>
												</Col>
											</Row>
										</Col>
									</Row>
								</AvForm>
								:
								<LoaderCard {...tableLoaderProps} />
						}
					</div>
				)}
			>
				<Button color="secondary" className="mr-2 float-left" onClick={this.closeAddItemModal}>Cancel</Button>
				{
					formAddName && formAddDescription && formAddHour && formAddMinute && formAddCapacity ?
						<Button color="primary" className="float-right" onClick={this.saveAddItem}>Save</Button>
						:
						<Button color="secondary" className="float-right" disabled style={{opacity: 0.5}}>Save</Button>
				}
			</ModalBox>
		)
	}

	// Add Schedule Fn
	saveAddItem = () => {
		const { formAddName, formAddDescription, formAddHour, formAddMinute, formAddCapacity, fetchLen, fetchSortBy, initFetch } = this.state
		let orders = "desc", keyword = ""
		const options = {
			name: formAddName,
			description: formAddDescription,
			capacity: formAddCapacity,
			time: `${formAddHour}:${formAddMinute}:00`
		}
		if(!initFetch) {
			this.setState(
				{ initFetch: true },
				async () => {
					const resp = await addNewMasterSchedule(options, JSON.stringify(this.props.token))
					if(resp.status) {
						this.setState({initFetch: false, fetchPage: 1, fetchOrderBy: orders, fetchSearchKey: keyword})
						this.props.getMasterScheduleList(1, fetchLen, fetchSortBy, orders, JSON.stringify(this.props.token), keyword)
						this.closeAddItemModal()
					} else {
						this.setState({initFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	// DELETE SECTION
	// Delete Schedule Modal
	renderModalDelete() {
		const { listSchedules, deletedContent, showDeleteConfirmationModal } = this.state
		let lists = listSchedules.content
		let header = deletedContent ? ` ${lists.filter(item => item.id === deletedContent.id)[0].name} ` : " "
		return (
			<ModalBox
				title={(<div>Confirm to delete<b>{header}</b>?</div>)}
				className="absolute-center" 
				showModal={showDeleteConfirmationModal} 
				toogleModal={this.closeDeleteConfirmation}
				body={(
					<div className="p-2">
						<div>Removing this content will be affect other related on-going events.</div>
						<div className="mt-2 clearfix">Are you sure you want to continue?</div>
					</div>
				)}
			>
				<Button color="danger" className="mr-2 float-left" onClick={this.initDelete}>Continue</Button>
				<Button color="secondary" className="float-right" onClick={this.closeDeleteConfirmation}>Cancel</Button>
			</ModalBox>
		)
	}

	// Delete Schedule Fn
	initDelete = () => {
		const { deletedContent, fetchLen, fetchSortBy, initFetch } = this.state
		let order = "desc", keyword = ""
		if(!initFetch) {
			this.setState(
				{ initFetch: true },
				async () => {
					const resp = await deleteMasterScheduleById(deletedContent.id, JSON.stringify(this.props.token))
					if(resp.status) {
						this.setState({initFetch: false, fetchPage: 1, fetchOrderBy: order, fetchSearchKey: keyword})
						this.props.getMasterScheduleList(1, fetchLen, fetchSortBy, order, JSON.stringify(this.props.token), keyword)
						this.closeDeleteConfirmation()
					}
				}
			)
		}
	}


	// EDIT SECTION
	// Edit Schedule Modal
	renderModalEdit() {
		const { 
			showEditModal, formEditName, formEditDescription, formEditHour, formEditMinute, formEditCapacity, listAvailChildHours, formEditChildHour, formEditChildMinute, formChildSchedule 
		} = this.state
		return (
			<ModalBox
				title={(<div>Edit Schedule</div>)}
				size="lg"
				className="absolute-center" 
				showModal={showEditModal} 
				toogleModal={this.closeEditModal}
				body={(
					<div style={{minWidth: 310}}>
						<AvForm method="post" autoComplete="off">
							<Row>
								<Col lg="12">
									<FormInputValidation 
										withLabel={true}
										labelName="Name"
										labelClassName="font-14 mb-0 text-999999"
										containerClassName="mb-3"
										formClassName="p-2 bg-white mb-0"
										formId="yourFormEditName" 
										formType="text" 
										formName="formEditName" 
										formPlaceholder="Schedule Name" 
										formErrorMessage="This form cannot be empty" 
										onChange={this.handleChange} 
										formValue={formEditName}
										formValidate={{required: { value: true, errorMessage: 'This form cannot be empty' }}} 
									/>
								</Col>
								<Col lg="12">
									<FormInputValidation 
										withLabel={true}
										labelName="Description"
										labelClassName="font-14 mb-0 text-999999"
										containerClassName="mb-3"
										formClassName="p-2 bg-white mb-0"
										formId="yourFormEditDescription" 
										formType="text" 
										formName="formEditDescription" 
										formPlaceholder="Schedule Description" 
										formErrorMessage="This form cannot be empty" 
										onChange={this.handleChange} 
										formValue={formEditDescription}
										formValidate={{required: { value: true, errorMessage: 'This form cannot be empty' }}} 
									/>
								</Col>
								<Col lg="12">
									<FormInputValidation 
										withLabel={true}
										labelName="Maximum Capacity"
										labelClassName="font-14 mb-0 text-999999"
										containerClassName="mb-3"
										formClassName="p-2 bg-white mb-0"
										formId="yourFormEditCapacity" 
										formType="number" 
										formName="formEditCapacity" 
										formPlaceholder="Field Capacity" 
										formErrorMessage="This form cannot be empty" 
										onChange={this.handleChange} 
										formValue={formEditCapacity}
										formValidate={{required: { value: true, errorMessage: 'This form cannot be empty' }}} 
									/>
								</Col>
								<Col lg="12" className="mb-3">
									<Row>
										<Col xs="6">
											<FormSelectValidation 
												withLabel={true}
												labelName="Hours"
												labelClassName="font-14 mb-0 text-999999"
												formClassName={`px-2 mb-0 ${formChildSchedule && formChildSchedule.length > 0 ? 'bg-light' : ' bg-white'}`}
												formId="yourFormEditHour" 
												formName="formEditHour" 
												formValue={formEditHour}
												formOptionData={listHours}
												onChange={this.handleChange}
												disabled={formChildSchedule && formChildSchedule.length > 0}
												formErrorMessage="Hours cannot be empty" 
											/>
										</Col>
										<Col xs="6">
											<FormSelectValidation 
												withLabel={true}
												labelName="Minutes"
												labelClassName="font-14 mb-0 text-999999"
												formClassName={`px-2 mb-0 ${formChildSchedule && formChildSchedule.length > 0 ? 'bg-light' : ' bg-white'}`}
												formId="yourFormEditMinute" 
												formName="formEditMinute" 
												formValue={formEditMinute}
												formOptionData={listMinutes}
												onChange={this.handleChange}
												disabled={formChildSchedule && formChildSchedule.length > 0}
												formErrorMessage="Minutes cannot be empty" 
											/>
										</Col>
										{
											formChildSchedule && formChildSchedule.length > 0 ?
												<Col lg="12">
													<Label className="font-14 mt-2 mb-0 text-danger font-italic">Remove all Schedule Detail to change the time</Label>
												</Col> : ""
										}
									</Row>
								</Col>
								<Col xs="12">
									<Row>
										<Col xs="12" className="py-0">
											<hr />
											<Label className="font-14 mb-0 text-999999">Add Schedule Detail</Label>
										</Col>
										<Col xs="6" sm="6" md="4">
											<FormSelect 
												withLabel={true}
												labelName="Hours"
												labelClassName="font-12 mb-0 text-999999"
												formClassName="px-2 bg-white mb-0"
												formId="yourFormEditChildHour" 
												formName="formEditChildHour" 
												formPlaceholder="Hour"
												formOptionData={listAvailChildHours}
												formValue={formEditChildHour}
												onChange={this.handleChildSchedule} 
											/>
										</Col>
										<Col xs="6" sm="6" md="4">
											<FormSelect 
												withLabel={true}
												labelName="Minutes"
												labelClassName="font-12 mb-0 text-999999"
												formClassName="px-2 bg-white mb-0"
												formId="yourFormEditChildMinute" 
												formName="formEditChildMinute" 
												formPlaceholder="Minute"
												formOptionData={listMinutes}
												formValue={formEditChildMinute}
												onChange={this.handleChildSchedule} 
											/>
										</Col>
										<Col sm="12" md="4" className="py-1">
											<Button color="primary" className="w-100 float-right mt-4" style={{height: "50px"}} onClick={this.addChildSchedule}>
												<i className="icon-plus mx-1 font-22" /> ADD
											</Button>
										</Col>
									</Row>
								</Col>
								<Col xs="12" className="py-1">
									{ formChildSchedule && formChildSchedule.map((data, idx) => (
										<Badge key={idx} color="dark" className="mr-2 mt-2 py-1 px-2 font-20" style={{lineHeight: 1.7}}>
											<span className="d-inline-block">{data.time}</span>
											<Button color="danger" style={{lineHeight: 1, marginTop: "-4px"}} className="rounded-lg p-1 ml-2" onClick={() => this.removeChildSchedule(idx)}>
												<i className="icon-x font-18" />
											</Button>
										</Badge>
									)) }
								</Col>
							</Row>
						</AvForm>
					</div>
				)}
			>
				<Button color="secondary" className="mr-2 float-left" onClick={this.closeEditModal}>Cancel</Button>
				<Button color="primary" className="float-right" onClick={this.saveEditedContent}>Save</Button>
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

	// Edit - Add Child Schedule Fn
	addChildSchedule = () => {
		const { formEditHour, formEditMinute, formChildSchedule, formEditChildHour, formEditChildMinute } = this.state
		let parent = Number(formEditHour + "" + formEditMinute),
			child = Number(formEditChildHour + "" + formEditChildMinute)
		
		if(child >= parent) {
			this.setState(
				{ formChildSchedule: [ ...formChildSchedule, {
						name: new Date().getTime(),
						time: formEditChildHour + ':' + formEditChildMinute + ":00"
					}] 
				}
			)
		} else {
			this.setState({showAlertModal: true, alertModalMessage: "Cannot set lower from the primary time"})
		}
	}

	removeChildSchedule = (index) => {
		var newArr = [...this.state.formChildSchedule]
		newArr.splice(index, 1)
		this.setState({formChildSchedule: newArr})
	}

	// Edit Schedule Fn
	saveEditedContent = () => {
		const { 
			formEditName, formEditDescription, formEditCapacity, formEditHour, formEditMinute, editedContent, fetchPage, fetchLen, fetchSortBy, fetchOrderBy, fetchSearchKey, formChildSchedule, initFetch 
		} = this.state
		const options = {
			name: formEditName,
			description: formEditDescription,
			capacity: formEditCapacity,
			time: `${formEditHour}:${formEditMinute}:00`,
			schedule_rooms: formChildSchedule
		}
		if(!initFetch) {
			this.setState(
				{ initFetch: true },
				async () => {
					const resp = await editMasterScheduleById(editedContent.id, options, JSON.stringify(this.props.token))
					if(resp.status) {
						this.setState(
							{ initFetch: false },
							() => {
								this.closeEditModal()
								this.props.getMasterScheduleList(fetchPage, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(this.props.token), fetchSearchKey)
							}
						)
					} else {
						this.setState({initFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	render() {
		const { 
			showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, listSchedules, fetchPage, fetchLen, fetchSortBy, fetchOrderBy, initFetch
		} = this.state
		// console.log(listSchedules)
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
						<Col lg="12" className="mb-1">
							<h1 className="text-primary">Factory Schedule</h1>
							<span><i className="icon-paperclip mx-1" />Total {listSchedules.total_elements} Schedules</span>
						</Col>
						<Col xs="12" className="d-flex justify-content-end mb-3">
							<Button size="sm" color="primary" className="py-2 px-3" onClick={() => this.addItemModal()}>
								<i className="icon icon-plus" /> ADD NEW
							</Button>
						</Col>
						<Col xs="12">
							<AdvanceTableBox 
								isResponsive={true} 
								tHead={[
									{ id: "name", name: "Name" },
									{ id: "time", name: "Time" },
									{ id: "capacity", name: "Capacity" },
									{ id: "", name: "Action" }
								]}
								sortItems={[
									{ id: "name", name: "Name" },
									{ id: "time", name: "Time" },
									{ id: "capacity", name: "Capacity" }
								]}
								listNumber={true}
								sortValue={fetchSortBy}
								orderValue={fetchOrderBy}
								onSortClick={this.onSortInit}
								onTargetSortClick={this.onTargetSort}
								onKeySearch={this.onSearchKeyInit}
								searchCategory={["Name"]}
								noResult={listSchedules.content.length === 0}
								pagination={
									<Pagination 
										ariaLabel="Page navigation"
										size="sm"
										totalContent={listSchedules.total_elements}
										currentPage={fetchPage}
										contentMaxLength={fetchLen}
										onClick={this.onPaginationClick}
									/>
								}
							>
								{
									!initFetch ?
										listSchedules.content.map((data, key) => (
											<tr key={key}>
												<th scope="row" className="pt-2" width="50px">{(key+1) + (fetchPage > 1 ? (fetchPage-1) * fetchLen : 0)}</th>
												<td className="pt-2">{data.name}</td>
												<td className="pt-2">{data.time}</td>
												<td className="pt-2">{data.capacity}</td>
												<td className="pt-2">
													<div className="d-flex w-100">
														<Button color="warning" size="sm" className="mr-1 mb-1" onClick={() => this.editModal(data)}>
															<i className="icon icon-edit" />
														</Button>
														<Button color="danger" size="sm" className="mb-1" onClick={() => this.deleteConfirmModal(data)}>
															<i className="icon icon-trash-2" />
														</Button>
													</div>
												</td>
											</tr>
										))
										:
										<tr><td colSpan="5"><LoaderCard {...tableLoaderProps} /></td></tr>
								}
							</AdvanceTableBox>
						</Col>
					</Row>
				</Container>
				{ this.renderModalEdit() }
				{ this.renderModalDelete() }
				{ this.renderModalAddItems() }
				{ this.renderModalAlert() }
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getMasterScheduleList: bindActionCreators(getMasterScheduleList, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(MasterSchedule)