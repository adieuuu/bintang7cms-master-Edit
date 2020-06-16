import React from 'react'
import { connect } from 'react-redux'
import { regexHtmlTag, utcToDateTime } from '../../components/functions'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import AdvanceTableBox from '../../components/tables/advanceTable'
import { AvForm } from 'availity-reactstrap-validation'
import FormInputValidation from '../../components/form/validateInputForm'
import Pagination from '../../components/cards/PaginationCard'
import LoaderCard from '../../components/cards/LoaderCard'
import { Container, Row, Col, Button } from 'reactstrap'
import ModalBox from '../../components/cards/modalBoxCard'
import { auth, administratorList, modifyUser, deleteUser, registerAccount } from '../../components/actions'

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

class UserAdministrator extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/administrator",
			page: 1, size: 10, sortBy: "created", orderBy: "desc", keyword: "", token: token
		}
		try {
			await store.dispatch(administratorList(props.page, props.size, props.sortBy, props.orderBy, token, props.keyword))
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
            tableHead: [
				{ id: "first_name", name: "Full Name" },
				{ id: "email", name: "Email" },
				{ id: "user.enabled", name: "Status" },
				{ id: "created", name: "Created Date" },
				{ name: "Action" }
			],
			tableSortItems: [
				{ id: "first_name", name: "Name" }, 
				{ id: "email", name: "Email" }, 
				{ id: "user.enabled", name: "Status" },
				{ id: "created", name: "Created Date" }
			],
			listAdministrator: props.listUser_administrator,
			roles: props.listRoles,
			fetchSortBy: props.sortBy,
			fetchOrderBy: props.orderBy,
			fetchKeyword: props.keyword,
			fetchPage: props.page,
			fetchLen: props.size,
			onFetch: false,

			userSelected: null,
			showEditConfirmationModal: false,
			showFormModal: false,
			// PAYLOAD
			formEmail: '',
			formPassword: '',
			formFirstName: '', 
			formLastName: '', 
			formMidName: '',
			formRole: 'ROLE_ADMIN',

			// EDIT
			showEditModal: false,
			// DELETE
			showDeleteConfirmationModal: false,

			showAlertModal: false, 
			alertModalMessage: "",
			formMinLenChecker: {
				_email: 5,
				_password: 6,
				_firstName: 2,
				_middleName: 1,
				_lastName: 1
			}
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			listAdministrator: nextProps.listUser_administrator
		})
	}

	// START METHODS
	addNewAdmin = () => this.setState({showFormModal: true})
	closeAddNewItems = () => this.setState({showFormModal: false, formEmail: '', formPassword: '', formFirstName: '', formMidName: '', formLastName: ''})

	handleChange = (e) => {
		const target = e.target, value = target.value, name = target.name
		this.setState({ [name]: regexHtmlTag(value) })
	}

	addAdminUser = () => {
		const { formEmail, formPassword, formFirstName, formLastName, formRole, formMidName, fetchLen, onFetch } = this.state
		const { _email, _password, _firstName, _middleName, _lastName } = this.state.formMinLenChecker
		let payloadUser = {
			account: {
				username: formEmail,
				enabled: true,
				password: formPassword,
				roles: [{ name: formRole, type: "user_role" }]
			},
			first_name: formFirstName,
			middle_name: formMidName,
			last_name: formLastName,
			email: formEmail
		}
		let isValidChecker = formEmail.length >= _email 
							&& formPassword.length >= _password 
							&& formFirstName.length >= _firstName 
							&& formMidName.length >= _middleName 
							&& formLastName.length >= _lastName
							&& !onFetch

		if(isValidChecker) {
			const { token, administratorList } = this.props
			this.setState(
				{ onFetch: true },
				async () => {
					const fetch = await registerAccount(payloadUser, token)
					if(fetch.status) {
						let page = 1, sort = "created", order = "desc", keywrd = ""
						this.setState(
							{ fetchPage: page, fetchSortBy: sort, fetchOrderBy: order, fetchKeyword: keywrd },
							async () => {
								this.closeAddNewItems()
								const resp = await administratorList(page, fetchLen, sort, order, JSON.stringify(token), keywrd)
								if(resp.status) {
									this.setState({onFetch: false})
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
		} else {
			this.setState({showAlertModal: true, alertModalMessage: "Please fill in all the required forms"})
		}
	}

	deleteModal = (data) => this.setState({userSelected: data, showDeleteConfirmationModal: true})
	closeDeleteModal = () => this.setState({showDeleteConfirmationModal: false, userSelected: null})
	initDeleteUser = () => {
		const { onFetch, userSelected, fetchLen } = this.state
		if(!onFetch) {
			const { token, administratorList } = this.props
			this.setState(
				{ onFetch: true },
				async () => {
					const fetch = await deleteUser(userSelected.account.id, token)
					if(fetch.status) {
						let page = 1, sort = "created", order = "desc", keywrd = ""
						this.setState(
							{ fetchPage: page, fetchSortBy: sort, fetchOrderBy: order, fetchKeyword: keywrd },
							async () => {
								this.closeDeleteModal()
								const resp = await administratorList(page, fetchLen, sort, order, JSON.stringify(token), keywrd)
								if(resp.status) {
									this.setState({onFetch: false})
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

	editModal = (data) => this.setState({
			userSelected: data,
			showEditModal: true,
			formEmail: data.email,
			formFirstName: data.first_name, 
			formMidName: data.middle_name,
			formLastName: data.last_name
		})
	closeEditModal = () => this.setState({ showEditModal: false, userSelected: null, formEmail: "", formFirstName: "", formLastName: "", formMidName: "" })
	saveChangeAdmin = () => {
		const { onFetch, userSelected, formEmail, formFirstName, formLastName, formMidName, fetchLen } = this.state
		const { _firstName, _middleName, _lastName } = this.state.formMinLenChecker
		let payloadUser = {
			account: { username: formEmail },
			first_name: formFirstName,
			middle_name: formMidName,
			last_name: formLastName,
			email: formEmail
		}

		let isValidChecker = formFirstName.length >= _firstName 
							&& formMidName.length >= _middleName 
							&& formLastName.length >= _lastName
							&& !onFetch

		if(isValidChecker) {
			const { token, administratorList } = this.props
			this.setState(
				{ onFetch: true },
				async () => {
					const fetch = await modifyUser(userSelected.account.id, payloadUser, token)
					if(fetch.status) {
						let page = 1, sort = "created", order = "desc", keywrd = ""
						this.setState(
							{ fetchPage: page, fetchSortBy: sort, fetchOrderBy: order, fetchKeyword: keywrd },
							async () => {
								this.closeEditModal()
								const resp = await administratorList(page, fetchLen, sort, order, JSON.stringify(token), keywrd)
								if(resp.status) {
									this.setState({onFetch: false})
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
		} else {
			this.setState({showAlertModal: true, alertModalMessage: "Please fill in all the required forms"})
		}
	}
	// END METHODS

	// START FUNCTION RENDER
	renderModalEdit() {
		const { showEditModal, formEmail, formFirstName, formLastName, formMidName, onFetch } = this.state
		const { _firstName, _middleName, _lastName } = this.state.formMinLenChecker
		return (
			<ModalBox 
				title="Edit Admin Account" 
				size="lg" 
				className="absolute-center" 
				showModal={showEditModal} 
				body={(
					<Container className="position-relative" style={{minWidth: "300px"}}>
						<AvForm method="post" autoComplete="off">
							<Row>
								<Col sm="12" lg="12">
									<Row>
										<Col lg="12">
											<span className="d-block w-100 font-weight-bold font-14 mb-0">Email</span>
											<FormInputValidation 
												containerClassName="mb-3"
												formClassName="p-2 bg-light mb-0"
												formId="formEmail" 
												formType="email" 
												formName="formEmail" 
												formPlaceholder="Input email here..." 
												formErrorMessage="Invalid email address" 
												onChange={this.handleChange} 
												formValue={formEmail}
												formReadOnly={true}
												formDisabled={true}
											/>
										</Col>
										<Col lg="12">
											<span className="d-block w-100 font-weight-bold font-14 mb-0">First Name</span>
											<FormInputValidation 
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="formFirstName" 
												formType="text" 
												formName="formFirstName" 
												formPlaceholder="Input text here..." 
												formErrorMessage="This form cannot be empty" 
												onChange={this.handleChange} 
												formValue={formFirstName}
												formValidate={{
													required: { value: true, errorMessage: 'This form cannot be empty' },
													minLength: { value: _firstName, errorMessage: `First name must be minimum ${_firstName} characters` },
													maxLength: { value: 50, errorMessage: 'First name must be maximum 50 characters' }
												}} 
											/>
										</Col>
										<Col lg="12">
											<span className="d-block w-100 font-weight-bold font-14 mb-0">Middle Name</span>
											<FormInputValidation 
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="formMidName" 
												formType="text" 
												formName="formMidName" 
												formPlaceholder="Input text here..." 
												formErrorMessage="This form cannot be empty" 
												onChange={this.handleChange} 
												formValue={formMidName}
												formValidate={{
													required: { value: true, errorMessage: 'This form cannot be empty' },
													minLength: { value: _middleName, errorMessage: `Middle name must be minimum ${_middleName} characters` },
													maxLength: { value: 50, errorMessage: 'Middle name must be maximum 50 characters' }
												}} 
											/>
										</Col>
										<Col lg="12">
											<span className="d-block w-100 font-weight-bold font-14 mb-0">Last Name</span>
											<FormInputValidation 
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="formLastName" 
												formType="text" 
												formName="formLastName" 
												formPlaceholder="Input text here..." 
												formErrorMessage="This form cannot be empty" 
												onChange={this.handleChange} 
												formValue={formLastName}
												formValidate={{
													required: { value: true, errorMessage: 'This form cannot be empty' },
													minLength: { value: _lastName, errorMessage: `Last name must be minimum ${_lastName} characters` },
													maxLength: { value: 50, errorMessage: 'Last name must be maximum 50 characters' }
												}} 
											/>
										</Col>
									</Row>
								</Col> 
							</Row>
						</AvForm>
						{
							onFetch ?
								<div className="absolute-center h-100 w-100">
									<LoaderCard 
										className="w-100 h-100 d-block"
										loaderColor={tableLoaderProps.loaderColor}
										style={tableLoaderProps.style}
									/>
								</div> : ""
						}
					</Container>
				)}
			>
				<Button color="primary" onClick={this.saveChangeAdmin} disabled={onFetch}>Save Change</Button>
				<Button color="secondary" className="float-right" onClick={this.closeEditModal} disabled={onFetch}>Cancel</Button>
			</ModalBox>
		)
	}

	renderModalDeleteConfirmation() {
		return (
			<ModalBox
				size="lg"
				title={(<div>Confirm to delete <b>{
					this.state.userSelected && this.state.userSelected.full_name ? this.state.userSelected.full_name : ''}</b>?</div>)}
				className="absolute-center" 
				showModal={this.state.showDeleteConfirmationModal} 
				toogleModal={this.closeDeleteModal}
				body={(
					<div className="p-2" style={{minWidth: "300px"}}>
						<div>This user's will be <b>Removed</b> from the list.</div>
						<div className="mt-2 clearfix">Are you sure you want to continue?</div>
					</div>
				)}
			>
				<Button color="danger" className="mr-2" onClick={this.initDeleteUser}>Confirm</Button>
				<Button color="secondary" className="float-right" onClick={this.closeDeleteModal}>Cancel</Button>
			</ModalBox>
		)
	}

	renderModalRegister() {
		const { showFormModal, formEmail, formPassword, formFirstName, formLastName, formMidName, onFetch } = this.state
		const { _email, _password, _firstName, _middleName, _lastName } = this.state.formMinLenChecker
		return (
			<ModalBox 
				title="Registration New Admin" 
				size="lg" 
				className="absolute-center" 
				showModal={showFormModal} 
				body={(
					<Container className="position-relative" style={{minWidth: "300px"}}>
						<AvForm method="post" autoComplete="off">
							<Row>
								<Col sm="12" lg="12">
									<Row>
										<Col lg="12">
											<span className="d-block w-100 font-weight-bold font-14 mb-0">Email</span>
											<FormInputValidation 
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="formEmail" 
												formType="email" 
												formName="formEmail" 
												formPlaceholder="Input email here..." 
												formErrorMessage="Invalid email address" 
												onChange={this.handleChange} 
												formValue={formEmail}
												formValidate={{
													required: { value: true, errorMessage: 'Invalid email address' },
													minLength: { value: _email, errorMessage: `Email must be minimum ${_email} characters` },
													email: true
												}} 
											/>
										</Col>
										<Col lg="12">
											<span className="d-block w-100 font-weight-bold font-14 mb-0">Password</span>
											<FormInputValidation 
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="formPassword" 
												formType="password" 
												formName="formPassword" 
												formPlaceholder="Input password here..." 
												formErrorMessage="This form cannot be empty"
												onChange={this.handleChange} 
												formValue={formPassword}
												formValidate={{
													required: { value: true, errorMessage: 'This form cannot be empty' },
													minLength: { value: _password, errorMessage: `Password must be minimum ${_password} characters` },
													maxLength: { value: 20, errorMessage: 'Password must be maximum 20 characters' }
												}} 
											/>
										</Col>
										<Col lg="12">
											<span className="d-block w-100 font-weight-bold font-14 mb-0">First Name</span>
											<FormInputValidation 
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="formFirstName" 
												formType="text" 
												formName="formFirstName" 
												formPlaceholder="Input text here..." 
												formErrorMessage="This form cannot be empty" 
												onChange={this.handleChange} 
												formValue={formFirstName}
												formValidate={{
													required: { value: true, errorMessage: 'This form cannot be empty' },
													minLength: { value: _firstName, errorMessage: `First name must be minimum ${_firstName} characters` },
													maxLength: { value: 50, errorMessage: 'First name must be maximum 50 characters' }
												}} 
											/>
										</Col>
										<Col lg="12">
											<span className="d-block w-100 font-weight-bold font-14 mb-0">Middle Name</span>
											<FormInputValidation 
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="formMidName" 
												formType="text" 
												formName="formMidName" 
												formPlaceholder="Input text here..." 
												formErrorMessage="This form cannot be empty" 
												onChange={this.handleChange} 
												formValue={formMidName}
												formValidate={{
													required: { value: true, errorMessage: 'This form cannot be empty' },
													minLength: { value: _middleName, errorMessage: `Middle name must be minimum ${_middleName} characters` },
													maxLength: { value: 50, errorMessage: 'Middle name must be maximum 50 characters' }
												}} 
											/>
										</Col>
										<Col lg="12">
											<span className="d-block w-100 font-weight-bold font-14 mb-0">Last Name</span>
											<FormInputValidation 
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="formLastName" 
												formType="text" 
												formName="formLastName" 
												formPlaceholder="Input text here..." 
												formErrorMessage="This form cannot be empty" 
												onChange={this.handleChange} 
												formValue={formLastName}
												formValidate={{
													required: { value: true, errorMessage: 'This form cannot be empty' },
													minLength: { value: _lastName, errorMessage: `Last name must be minimum ${_lastName} characters` },
													maxLength: { value: 50, errorMessage: 'Last name must be maximum 50 characters' }
												}} 
											/>
										</Col>
									</Row>
								</Col> 
							</Row>
						</AvForm>
						{
							onFetch ?
								<div className="absolute-center h-100 w-100">
									<LoaderCard 
										className="w-100 h-100 d-block"
										loaderColor={tableLoaderProps.loaderColor}
										style={tableLoaderProps.style}
									/>
								</div> : ""
						}
					</Container>
				)}
			>
				<Button color="primary" onClick={!onFetch ? this.addAdminUser : () => {}}>Save</Button>
				<Button color="secondary" className="float-right" onClick={!onFetch ? this.closeAddNewItems : () => {}}>Cancel</Button>
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

	onPaginationClick = (page) => {
		const { fetchSortBy, fetchOrderBy, fetchKeyword, fetchLen, onFetch } = this.state
		const { administratorList, token } = this.props
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await administratorList(page, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(token), fetchKeyword)
					if(resp.status) {
						this.setState({ fetchPage: page, onFetch: false })
					}
				}
			)
		}
	}

	onSortInit = (e) => {
		const { fetchLen, fetchOrderBy, fetchKeyword, onFetch } = this.state
		const { administratorList, token } = this.props
		const pages = 1, target = e.target, value = target.value
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchSortBy: value },
				async () => {
					const resp = await administratorList(pages, fetchLen, value, fetchOrderBy, JSON.stringify(token), fetchKeyword)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					}
				}
			)
		}
	}

	onTargetSortInit = (data) => {
		let page = 1, value = data.id
		const { fetchSortBy, fetchOrderBy, fetchKeyword, fetchLen, onFetch } = this.state
		const { administratorList, token } = this.props
		const orders = fetchSortBy != value ? 'desc' : fetchOrderBy == 'desc' ? 'asc' : 'desc'
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchSortBy: value, fetchOrderBy: orders },
				async () => {
					const resp = await administratorList(page, fetchLen, value, orders, JSON.stringify(token), fetchKeyword)
					if(resp.status) {
						this.setState({ fetchPage: page, onFetch: false })
					}
				}
			)
		}
	}

	onSearchKeyInit = (keywords) => {
		let pages = 1, orders = "desc", sorts = "created"
		const { fetchLen, onFetch } = this.state
		const { administratorList, token } = this.props
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchKeyword: keywords, fetchSortBy: sorts, fetchOrderBy: orders },
				async () => {
					const resp = await administratorList(pages, fetchLen, sorts, orders, JSON.stringify(token), keywords)
					if(resp.status) {
						this.setState({ fetchPage: pages, onFetch: false })
					}
				}
			)
		}
	}

	render() {
		const { 
			showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, tableHead, tableSortItems, listAdministrator, onFetch, fetchSortBy, fetchOrderBy, fetchPage, fetchLen 
		} = this.state
		// console.log(listAdministrator)
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
                            <h1 className="text-primary">List Administrator</h1>
							<span><i className="icon-paperclip mx-1" />Total {listAdministrator.total_elements} {listAdministrator.total_elements > 1 ? 'Administrators' : 'Administrator'}</span>
                        </Col>
						<Col xs="12" className="d-flex justify-content-end mb-3">
							<Button size="sm" color="primary" className="py-2 px-3" onClick={() => this.addNewAdmin()}>
								<i className="icon icon-user-plus mr-2" /> Add Administrator
							</Button>
						</Col>
						<Col xs="12">
							<AdvanceTableBox 
								isResponsive={true} 
								tHead={tableHead}
								listNumber={true}
								sortItems={tableSortItems}
								onSortClick={this.onSortInit}
								sortValue={fetchSortBy}
								orderValue={fetchOrderBy}
								onTargetSortClick={this.onTargetSortInit}
								onKeySearch={this.onSearchKeyInit}
								searchCategory={["First Name", "Email"]}
								noResult={listAdministrator.content.length === 0}
								pagination={
									<Pagination 
										ariaLabel="Page navigation"
										size="sm"
										totalContent={listAdministrator.total_elements}
										currentPage={fetchPage}
										contentMaxLength={fetchLen}
										onClick={this.onPaginationClick}
									/>
								}
							>
								{
									!onFetch ?
										listAdministrator.content.map((customer, i) => (
											<tr key={i}>
												<th scope="row" className="pt-2" width="50px">{(i + 1) + (fetchPage > 1 ? (fetchPage-1) * fetchLen : 0)}</th>
												<td className="text-wrap text-break pt-2 pr-3" style={{maxWidth: "250px"}}>{customer.full_name}</td>
												<td className="text-wrap text-break pt-2 pr-3" style={{maxWidth: "250px"}}>{customer.account.username}</td>
												<td className="pt-2">
													{
														customer.account.enabled ? 
															<span style={{color:"green"}}>Active</span> : <span style={{color:"gray"}}>Inactive</span>
													}
												</td>
												<td className="pt-2">{utcToDateTime(customer.created, true)}</td>
												<td className="pt-2">
													<div className="d-flex w-100">
														<Button 
															color='warning' 
															size="sm" 
															className="mr-1 mb-1"
															onClick={() => this.editModal(customer)}
														><i className="icon icon-edit"/></Button>
														<Button 
															color="danger" 
															className="mr-1 mb-1" 
															size="sm" 
															onClick={() => {this.deleteModal(customer)}}
														><i className="icon icon-trash-2"/></Button>
													</div>
												</td>
											</tr>
										))
										:
										<tr><td colSpan="6"><LoaderCard {...tableLoaderProps} /></td></tr>
								}
							</AdvanceTableBox>
						</Col>
					</Row>
				</Container>
				{ this.renderModalRegister() }
				{ this.renderModalDeleteConfirmation() }
				{ this.renderModalEdit() }
				{ this.renderModalAlert() }
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		administratorList: bindActionCreators(administratorList, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(UserAdministrator)