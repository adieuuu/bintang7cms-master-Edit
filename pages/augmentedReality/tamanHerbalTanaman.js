import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import AdvanceTableBox from '../../components/tables/advanceTable'
import Pagination from '../../components/cards/PaginationCard'
import { Container, Row, Col, Button } from 'reactstrap'
import ModalBox from '../../components/cards/modalBoxCard'
import LoaderCard from '../../components/cards/LoaderCard'
import { AvForm } from 'availity-reactstrap-validation'
import FormInputValidation from '../../components/form/validateInputForm'
import FormInput from '../../components/form/inputForm'
import { regexHtmlTag } from '../../components/functions'
import { auth, getListTHPlant, addNewTHPlant, editTHPlant, deleteTHPlant } from '../../components/actions'
import QRCode from 'qrcode'
import $ from 'jquery'

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

class ARTamanHerbalTanaman extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/taman-herbal-plant",
			page: 1, size: 10, sortBy: "name", orderBy: "desc", keyword: "", token: token
		}
		try {
			await store.dispatch(getListTHPlant(props.page, props.size, props.sortBy, props.orderBy, token, props.keyword))
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
			listTamanHerbal: props.tamanHerbal_plant,
			fetchPage: props.page,
			fetchLen: props.size,
			fetchSortBy: props.sortBy,
			fetchOrderBy: props.orderBy,
			fetchSearchKey: props.keyword,
			onFetch: false,

			editedContent: null,
			deletedContent: null,
			showDeleteConfirmationModal: false,
			showNewItemFormModal: false,

			formNamaTumbuhan: "",
			formNamaLatinTumbuhan: "",
			formDescription: "",
			formMarkerCode: "",
			formManfaat: [],
			formTempManfaat: "",
			formImageThumbs: [],

			showQRModal: false,
			selectedTamanHerbal: null,
			showAlertModal: false, 
			alertModalMessage: ""
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			listTamanHerbal: nextProps.tamanHerbal_plant
		})
	}

	componentDidMount() {
		$('.dropzone-wrapper').on('dragover', function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).addClass('dragover');
		});
		$('.dropzone-wrapper').on('dragleave', function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).removeClass('dragover');
		});
		// $(".dropzone").change(function() { readFile(this); });
	}

	readFile = (e) => {
		let files = e.target.files
		for(var i = 0; i < files.length; i++) {
			let reader = new FileReader()
			let extension = files[i].type
			try {
				reader.onload = (e) => this.setState({ formImageThumbs: [...this.state.formImageThumbs, { type: extension, url: e.target.result }] })
				reader.readAsDataURL(files[i]);
			} catch (error) {
				console.log("err", error)
			}
		}
	}
	removeThumbs = (index) => {
		let arr = Object.assign([], this.state.formImageThumbs)
		arr.splice(index, 1)
		this.setState({formImageThumbs: arr})
	}

	editModal = (data) => this.setState({
			editedContent: data, 
			formNamaTumbuhan: data.name, 
			formNamaLatinTumbuhan: data.latin_name, 
			formDescription: data.description, 
			formMarkerCode: data.code, 
			formManfaat: data.benefit, 
			formTempManfaat: "",
			formImageThumbs: data.images,
			showNewItemFormModal: true,
			isEdited: true
		})
	closeEditModal = () => this.setState({
			formNamaTumbuhan: "", 
			formNamaLatinTumbuhan: "", 
			formDescription: "", 
			formMarkerCode: "", 
			formManfaat: [], 
			formTempManfaat: "",
			formImageThumbs: [],
			showNewItemFormModal: false, 
			editedContent: null,
			isEdited: false
		})

	deleteConfirmModal = (data) => this.setState({deletedContent: data, showDeleteConfirmationModal: true})
	closeDeleteConfirmation = () => this.setState({showDeleteConfirmationModal: false, deletedContent: null})

	handleChange = (e) => {
		const target = e.target, value = target.value, name = target.name
		this.setState({ [name]: regexHtmlTag(value) })
	}

	onPaginationClick = (page) => {
		const { onFetch, fetchLen, fetchSortBy, fetchOrderBy, fetchSearchKey } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					const { getListTHPlant, token } = this.props
					const resp = await getListTHPlant(page, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(token), fetchSearchKey)
					if(resp.status) {
						this.setState({onFetch: false, fetchPage: page})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		} 
	}

	onSortInit = (e) => {
		const { fetchLen, fetchOrderBy, fetchSearchKey, onFetch } = this.state
		const target = e.target, value = target.value, pages = 1
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchSortBy: value },
				async () => {
					const { getListTHPlant, token } = this.props
					const resp = await getListTHPlant(pages, fetchLen, value, fetchOrderBy, JSON.stringify(token), fetchSearchKey)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onSearchKeyword = (keywords) => {
		let pages = 1, orders = "desc", sorts = "name"
		const { fetchLen, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchSearchKey: keywords, fetchSortBy: sorts, fetchOrderBy: orders },
				async () => {
					const { getListTHPlant, token } = this.props
					const resp = await getListTHPlant(pages, fetchLen, sorts, orders, JSON.stringify(token), keywords)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	onTargetSort = (data) => {
		let pages = 1
		const { fetchLen, fetchSortBy, fetchOrderBy, fetchSearchKey, onFetch } = this.state
		const orders = fetchSortBy != data.id ? 'desc' : fetchOrderBy == 'desc' ? 'asc' : 'desc'
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchSortBy: data.id, fetchOrderBy: orders },
				async () => {
					const { getListTHPlant, token } = this.props
					const resp = await getListTHPlant(pages, fetchLen, data.id, orders, JSON.stringify(token), fetchSearchKey)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	// SHOW QRCODE
	generateQRCode = async (data) => {
		const opts = {
			errorCorrectionLevel: 'H',
			type: 'image/jpeg',
			quality: 1,
			margin: 1,
			width: 300
		}
		this.setState(
			{ selectedTamanHerbal: data, showQRModal: true },
			() => {
				QRCode.toDataURL(JSON.stringify(data.code), opts, function (err, url) {
					if (err) throw err
					var img = document.getElementById('canvas-qrcode')
					img.src = url
				})
			}
		)
	}
	closeQRCode = () => this.setState({ selectedTamanHerbal: null, showQRModal: false })
	renderQRCode() {
		const { selectedTamanHerbal, showQRModal } = this.state
		return (
			<ModalBox
				title={(
					<Row>
						<Col lg="12">Name: <b>{selectedTamanHerbal ? selectedTamanHerbal.name : ""}</b></Col>
						<Col lg="12">Code: <b>{selectedTamanHerbal ? selectedTamanHerbal.code : ""}</b></Col>
					</Row>
				)}
				className="absolute-center" 
				showModal={showQRModal} 
				toogleModal={this.closeQRCode}
				size="lg"
				body={(
					<div style={{minWidth: "300px"}}>
						<img id="canvas-qrcode" className="w-100 h-100" align="center" />
					</div>
				)}
			>
				<Button color="secondary" style={{"textAlign": "center"}} onClick={this.closeQRCode}>Close</Button>
			</ModalBox>
		)
	}

	// ADD NEW CONTENT SECTION
	// Add New Component Form & Modal
	showAddNewModal = () => this.setState({showNewItemFormModal: true})
	closeAddNewModal = () => this.setState({
		showNewItemFormModal: false, 
		formNamaTumbuhan: "",
		formNamaLatinTumbuhan: "",
		formDescription: "",
		formMarkerCode: "",
		formManfaat: [],
		formTempManfaat: "",
		formImageThumbs: []
	})

	addManfaat = () => {
		const { formManfaat, formTempManfaat } = this.state
		if(formTempManfaat.length > 0) {
			this.setState({formManfaat: [...formManfaat, formTempManfaat], formTempManfaat: ""})
		}
	}
	removeManfaat = (index) => {
		let arr = Object.assign([], this.state.formManfaat)
		arr.splice(index, 1)
		this.setState({formManfaat: arr})
	}

	saveNewContent = () => {
		const { onFetch, isEdited, formNamaTumbuhan, formNamaLatinTumbuhan, formDescription, formMarkerCode, formManfaat, formImageThumbs } = this.state
		let options = {
			name: formNamaTumbuhan,
			code: formMarkerCode,
			description: formDescription,
			latin_name: formNamaLatinTumbuhan,
			benefit: formManfaat,
			images: formImageThumbs
		}
		if(formNamaTumbuhan.length > 0 && formNamaLatinTumbuhan.length > 0 && formDescription.length > 0 && formMarkerCode.length > 0 && formManfaat.length > 0 && formImageThumbs.length > 0) {
			if(!onFetch && !isEdited) {
				this.setState(
					{ onFetch: true },
					async () => {
						const resp = await addNewTHPlant(options, JSON.stringify(this.props.token))
						if(resp.status) {
							this.closeAddNewModal()
							this.setState({onFetch: false, fetchPage: 1, fetchSortBy: "name", fetchOrderBy: "desc", fetchSearchKey: ""}, () => this.onPaginationClick(1))
						} else {
							this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
						}
					}
				)
			}
		} else {
			this.setState({showAlertModal: true, alertModalMessage: "Please fill in all the required forms"})
		}
	}

	// Save Changes Function
	saveEditedContent = () => {
		const { 
			onFetch, isEdited, fetchPage, editedContent, formNamaTumbuhan, formNamaLatinTumbuhan, formDescription, formMarkerCode, formManfaat, formImageThumbs 
		} = this.state
		let options = {
			name: formNamaTumbuhan,
			code: formMarkerCode,
			description: formDescription,
			latin_name: formNamaLatinTumbuhan,
			benefit: formManfaat,
			images: formImageThumbs
		}
		if(formNamaTumbuhan.length > 0 && formNamaLatinTumbuhan.length > 0 && formDescription.length > 0 && formMarkerCode.length > 0 && formManfaat.length > 0 && formImageThumbs.length > 0) {
			if(!onFetch && isEdited) {
				this.setState(
					{ onFetch: true },
					async () => {
						const resp = await editTHPlant(editedContent.id, options, JSON.stringify(this.props.token))
						if(resp.status) {
							this.closeAddNewModal()
							this.setState({onFetch: false}, () => this.onPaginationClick(fetchPage))
						} else {
							this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
						}
					}
				)
			}
		} else {
			this.setState({showAlertModal: true, alertModalMessage: "Please fill in all the required forms"})
		}
	}

	renderModalAddEditItem() {
		const { 
			showNewItemFormModal, formNamaTumbuhan, formNamaLatinTumbuhan, formDescription, formMarkerCode, formManfaat, formTempManfaat, formImageThumbs, onFetch, isEdited 
		} = this.state
		return (
			<ModalBox 
				title={isEdited ? `Edit ${formNamaTumbuhan}` : "Add New Item"} 
				size="lg" 
				className="absolute-center" 
				showModal={showNewItemFormModal} 
				body={(
					<Container className="p-0" style={{minWidth: "300px"}}>
						<AvForm method="post" autoComplete="off">
							<Row>
								<Col lg="6">
									<FormInputValidation 
										withLabel={true}
										labelName="Name"
										labelClassName="font-weight-bold font-14 mb-1"
										containerClassName="mb-3"
										formClassName="p-2 bg-white mb-0"
										formId="yourFormNamaTumbuhan" 
										formType="text" 
										formName="formNamaTumbuhan" 
										formPlaceholder="Name" 
										formErrorMessage="This form cannot be empty" 
										onChange={this.handleChange} 
										formValue={formNamaTumbuhan}
										formValidate={{
											required: { value: true, errorMessage: 'This form cannot be empty' },
											minLength: { value: 2, errorMessage: 'Name must be minimum 2 characters' },
											maxLength: { value: 100, errorMessage: 'Name must be maximum 100 characters' }
										}} 
									/>
								</Col>
								<Col lg="6">
									<FormInputValidation 
										withLabel={true}
										labelName="Latin Name"
										labelClassName="font-weight-bold font-14 mb-1"
										containerClassName="mb-3"
										formClassName="p-2 bg-white mb-0"
										formId="yourFormNamaLatinTumbuhan" 
										formType="text" 
										formName="formNamaLatinTumbuhan" 
										formPlaceholder="Latin Name" 
										formErrorMessage="This form cannot be empty" 
										onChange={this.handleChange} 
										formValue={formNamaLatinTumbuhan}
										formValidate={{
											required: { value: true, errorMessage: 'This form cannot be empty' },
											minLength: { value: 2, errorMessage: 'Latin name must be minimum 2 characters' },
											maxLength: { value: 100, errorMessage: 'Latin name must be maximum 100 characters' }
										}} 
									/>
								</Col>
								<Col lg="12">
									<FormInputValidation 
										withLabel={true}
										labelName="Marker Code"
										labelClassName="font-weight-bold font-14 mb-1"
										containerClassName="mb-3"
										formClassName="p-2 bg-white mb-0"
										formId="yourFormMarkerCode" 
										formType="text" 
										formName="formMarkerCode" 
										formPlaceholder="Marker Code" 
										formErrorMessage="This form cannot be empty" 
										onChange={this.handleChange} 
										formValue={formMarkerCode}
										formValidate={{
											required: { value: true, errorMessage: 'This form cannot be empty' }
										}} 
									/>
								</Col>
								<Col lg="12">
									<FormInputValidation 
										withLabel={true}
										labelName="Information"
										labelClassName="font-weight-bold font-14 mb-1"
										containerClassName="mb-3"
										formClassName="p-2 bg-white mb-0"
										formId="yourFormDescription" 
										formType="textarea" 
										formName="formDescription" 
										formPlaceholder="Description" 
										formErrorMessage="This form cannot be empty" 
										onChange={this.handleChange} 
										formValue={formDescription}
										formValidate={{
											required: { value: true, errorMessage: 'This form cannot be empty' },
											minLength: { value: 5, errorMessage: 'Information must be minimum 5 characters' },
											maxLength: { value: 250, errorMessage: 'Information must be maximum 250 characters' }
										}} 
									/>
								</Col>
								<Col lg="12" className="pl-3"><span className="font-weight-bold font-14">Benefits</span></Col>
								{
									formManfaat ?
										<Col lg="12">
										{
											formManfaat.map((data, index) => (
												<div key={index} className="position-relative">
													<FormInput
														containerClassName={index + 1 === formManfaat.length ? 'mb-2' : ''}
														formClassName="p-2 pr-5 bg-light mb-0"
														formType="text" 
														formPlaceholder="" 
														formValue={data}
														readOnly={true}
														disabled="disabled"
													/>
													<div 
														className="absolute-center-right btn btn-sm btn-danger cursor-pointer" 
														style={{marginTop: "2px", marginRight: "4px"}}
														onClick={() => this.removeManfaat(index)}
													><i className="icon icon-x" /></div>
												</div>
											))
										}
									</Col> : ""
								}
								<Col xs="8" sm="8" md="10" lg="10" className="pr-0">
									<FormInput
										containerClassName="mb-3"
										formClassName="p-2 bg-white mb-0"
										formId="yourFormTempManfaat" 
										formType="text" 
										formName="formTempManfaat"
										formPlaceholder="Benefits" 
										formValue={formTempManfaat}
										onChange={this.handleChange}
									/>
								</Col>
								<Col xs="4" sm="4" md="2" lg="2" className="pl-2" style={{paddingTop: "1px"}}>
									<div className="btn btn-primary mt-1 w-100 cursor-pointer" onClick={this.addManfaat}><i className="icon icon-plus" /></div>
								</Col>
								<Col lg="12">
									<span className="font-weight-bold font-14">Photo</span>
									{
										formImageThumbs && formImageThumbs.length > 0 ?
											<div className="w-100 mt-3 mb-2">
												{
													formImageThumbs.map((data, key) => (
														<div key={key} className="p-1 position-relative d-inline-block border mr-4">
															<img width="auto" height="60" src={data.url} />
															<Button 
																className="position-absolute rounded-circle" 
																color="danger" 
																style={{height: "30px", width: "30px", top: "-15px", right: "-15px"}}
																onClick={() => this.removeThumbs(key)}
															>
																<i className="absolute-center icon icon-trash-2" />
															</Button>
														</div>
													))
												}
											</div> : ""
									}	
									<div id="box-img" className="dropzone-wrapper mt-2">
										<div className="absolute-center text-center w-100">
											<i className="icon icon-image" />
											<p className="mt-2">Choose an image file or drag it here.</p>
										</div>
										<input 
											id="input-dnd-image" 
											type="file" 
											multiple
											accept="image/png,image/x-png,image/jpeg,image/jpg" 
											name="img_thumbnail" 
											className="dropzone" 
											onChange={this.readFile} 
										/>
									</div>
								</Col>
							</Row>
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
						</AvForm>
					</Container>
				)}
			>
				<Button color="primary" className="mr-2" onClick={!isEdited ? this.saveNewContent : this.saveEditedContent} disabled={onFetch}>Save</Button>
				<Button color="secondary" className="float-right" onClick={!isEdited ? this.closeAddNewModal : this.closeEditModal} disabled={onFetch}>Cancel</Button>
			</ModalBox>
		)
	}

	// DELETE SECTION
	// Delete Confirmation Modal
	renderModalDeleteConfirmation() {
		const { listTamanHerbal, deletedContent, onFetch } = this.state
		let header = deletedContent ? ` ${listTamanHerbal.content.filter(item => item.id == Number(deletedContent))[0].name} ` : " "
		return (
			<ModalBox
				size="lg"
				title={(<div>Confirm to delete<b>{header}</b>?</div>)}
				className="absolute-center" 
				showModal={this.state.showDeleteConfirmationModal} 
				toogleModal={this.closeDeleteConfirmation}
				body={(
					<div className="p-2" style={{minWidth: "300px"}}>
						<div>This content will be automatically <b>Removed</b> from the list when deleted.</div>
						<div className="mt-2 clearfix">Are you sure you want to continue?</div>
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
					</div>
				)}
			>
				<Button color="danger" className="mr-2" onClick={this.deleteContent} disabled={onFetch}>Continue</Button>
				<Button color="secondary" className="float-right" onClick={this.closeDeleteConfirmation} disabled={onFetch}>Cancel</Button>
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

	// Delete Function
	deleteContent = () => {
		const { onFetch, deletedContent, fetchPage } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await deleteTHPlant(deletedContent, JSON.stringify(this.props.token))
					if(resp.status) {
						this.closeDeleteConfirmation()
						this.setState({onFetch: false}, () => this.onPaginationClick(fetchPage))
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	render() {
		const { 
			showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, listTamanHerbal, fetchPage, fetchLen, fetchSortBy, fetchOrderBy, onFetch
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
						<Col lg="12" className="mb-5">
							<h1 className="text-primary mb-2">Taman Herbal - Plant</h1>
							<span><i className="icon-paperclip mx-1" />Total {listTamanHerbal.total_elements} {listTamanHerbal.total_elements > 1 ? 'Herbal Plants' : 'Herbal Plant'}</span>
						</Col>
						<Col lg="12" className="d-flex justify-content-end mb-3">
							<Button size="sm" color="primary" className="py-2 px-3" onClick={() => this.showAddNewModal()}>
								<i className="icon icon-plus" /> ADD NEW
							</Button>
						</Col>
						<Col lg="12">
							<AdvanceTableBox 
								isResponsive={true} 
								tHead={[
									{ id: "name", name: "Name" },
									{ id: "latin_name", name: "Latin Name" },
									{ id: "code", name: "Marker Code" },
									{ name: "Actions" }
								]}
								listNumber={true}
								sortItems={[
									{ id: "name", name: "Name" }, 
									{ id: "latin_name", name: "Latin Name" },
									{ id: "code", name: "Marker Code" }
								]}
								onSortClick={this.onSortInit}
								onTargetSortClick={this.onTargetSort}
								sortValue={fetchSortBy}
								orderValue={fetchOrderBy}
								onKeySearch={this.onSearchKeyword}
								searchCategory={["Name", "Latin Name", "Marker Code"]}
								noResult={listTamanHerbal.content.length === 0}
								pagination={
									<Pagination 
										ariaLabel="Page navigation"
										size="sm"
										totalContent={listTamanHerbal.total_elements}
										currentPage={fetchPage}
										contentMaxLength={fetchLen}
										onClick={this.onPaginationClick}
									/>
								}
							>
								{
									!onFetch ?
										listTamanHerbal.content.map((data, key) => (
											<tr key={key}>
												<th scope="row" className="pt-2" width="50px">{(key + 1) + (fetchPage > 1 ? (fetchPage-1) * fetchLen : 0)}</th>
												<td className="pt-2">{data.name} </td>
												<td className="pt-2">{data.latin_name} </td>
												<td className="pt-2">{data.code}</td>
												<td className="pt-2">
													<div className="d-flex w-100">
														<Button 
															color="primary" 
															size="sm" 
															className="mr-1 mb-1" 
															onClick={() => this.generateQRCode(data)}
														>Marker</Button>
														<Button 
															color="warning" 
															size="sm" 
															className="mr-1 mb-1" 
															onClick={() => this.editModal(data)}
														><i className="icon icon-edit-3"/></Button>
														<Button 
															color="danger" 
															size="sm" 
															className="mb-1" 
															onClick={() => this.deleteConfirmModal(data.id)}
														><i className="icon icon-trash-2"/></Button>
													</div>
												</td>
											</tr>
										))
										:
										<tr><td colSpan="4"><LoaderCard {...tableLoaderProps} /></td></tr>
								}
							</AdvanceTableBox>
						</Col>
					</Row>
				</Container>
				{ this.renderModalDeleteConfirmation() }
				{ this.renderModalAddEditItem() }
				{ this.renderQRCode() }
				{ this.renderModalAlert() }
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getListTHPlant: bindActionCreators(getListTHPlant, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(ARTamanHerbalTanaman)