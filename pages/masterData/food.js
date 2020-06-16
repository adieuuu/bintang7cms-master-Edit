import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import { AvForm } from 'availity-reactstrap-validation'
import FormInputValidation from '../../components/form/validateInputForm'
import ContentBox from '../../components/contentBox'
import ModalBox from '../../components/cards/modalBoxCard'
import AdvanceTableBox from '../../components/tables/advanceTable'
import Pagination from '../../components/cards/PaginationCard'
import LoaderCard from '../../components/cards/LoaderCard'
import { Container, Row, Col, Button, FormText } from 'reactstrap'
import { regexHtmlTag, numberWithDot } from '../../components/functions'
import { auth, getList_masterData, post_masterData, delete_item, put_masterData } from '../../components/actions'
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

class MasterFood extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/master-food", 
			page: 1, size: 10, sortBy: "name", orderBy: "desc", keyword: "", token: token, fetch_category: "food"
		}
		try {
			await store.dispatch(getList_masterData(props.fetch_category, props.page ,props.size, props.sortBy, props.orderBy, token, props.keyword))
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
            _listProduct: props.listFood,
			fetchPage: props.page,
			fetchLen: props.size,
			fetchSortBy: props.sortBy,
			fetchOrderBy: props.orderBy,
			fetchKeyword: props.keyword,
			onFetch: false,
			isEdited: false,
			showAddEditItemModal: false,
			selectedItem: null,
			payloadProductName: "",
			payloadProductPrice: "",
			payloadProductDescription: "",
			payloadProductImage: null,
			showZoomImageModal: false, 
			zoomImage: null,
			showAlertModal: false, 
			alertModalMessage: ""
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			_listProduct: nextProps.listFood
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
	}
	
	// START METHOD
	handleChange = (e) => {
		const target = e.target, value = target.value, name = target.name
		this.setState({ [name]: regexHtmlTag(value) })
	}

	addItemModal = () => this.setState({showAddEditItemModal: true, isEdited: false})
	editItemModal = (data) => this.setState({
			selectedItem: data,
			showAddEditItemModal: true,
			isEdited: true,
			payloadProductName: data.name,
			payloadProductPrice: data.price,
			payloadProductDescription: data.description,
			payloadProductImage: data.link ? data.link : data.image_url
		})
 	closeAddEditItemModal = () => this.setState({
			selectedItem: null,
			showAddEditItemModal: false,
			isEdited: false,
			payloadProductName: "",
			payloadProductPrice: "",
			payloadProductDescription: "",
			payloadProductImage: null
		})

	showDeleteConfirmation = (data) => this.setState({selectedItem: data, showDeleteConfirmationModal: true})
	closeDeleteConfirmation = () => this.setState({selectedItem: null, showDeleteConfirmationModal: false})

	doDeleteItem = () => {
		const { onFetch, fetchPage, selectedItem } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					const { fetch_category, token } = this.props
					const resp = await delete_item(fetch_category, selectedItem.id, JSON.stringify(token))
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

	doPutItem= () => {
		const { onFetch, selectedItem, payloadProductName, payloadProductPrice, payloadProductDescription, payloadProductImage, fetchPage } = this.state 
		if(payloadProductName && payloadProductPrice && payloadProductDescription && payloadProductImage) {
			if(!onFetch) {
				let datas = {
					name: payloadProductName,
					price: payloadProductPrice,
					available: true,
					description: payloadProductDescription,
					link: payloadProductImage
				}
				this.setState(
					{ onFetch: true },
					async () => {
						const { fetch_category, token } = this.props
						const resp = await put_masterData(fetch_category, datas, selectedItem.id, JSON.stringify(token))
						if(resp.status) {
							this.closeAddEditItemModal()
							this.setState({onFetch: false}, () => this.onPaginationClick(fetchPage))
						} else {
							this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
						}
					}
				)
			}
		} else {
			this.setState({onFetch: false, showAlertModal: true, alertModalMessage: "Please complete all the required form"})
		}
	}

	doPostItem = () => {
		const { onFetch, payloadProductName, payloadProductPrice, payloadProductDescription, payloadProductImage } = this.state 
		if(payloadProductName && payloadProductPrice && payloadProductDescription && payloadProductImage) {
			if(!onFetch) {
				let datas = {
					name: payloadProductName,
					price: payloadProductPrice,
					available: true,
					description: payloadProductDescription,
					link: payloadProductImage
				}
				this.setState(
					{ onFetch: true },
					async () => {
						const { fetch_category, token } = this.props
						const resp = await post_masterData(fetch_category, datas, JSON.stringify(token))
						if(resp.status) {
							let page = 1
							this.closeAddEditItemModal()
							this.setState({onFetch: false, fetchPage: page, fetchSortBy: "name", fetchOrderBy: "desc", fetchKeyword: ""}, () => this.onPaginationClick(page))
						} else {
							this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
						}
					}
				)
			}
		} else {
			this.setState({onFetch: false, showAlertModal: true, alertModalMessage: "Please complete all the required form"})
		}
	}
	
	readFile = (e) => {
		if(!this.state.onFetch) {
			let files = e.target.files
			this.setState(
				{ onFetch: true },
				async () => {
					for(var i = 0; i < files.length; i++) {
						let reader = new FileReader()
						let extension = files[i].type
						try {
							reader.onload = (e) => this.setState({ 
									payloadProductImage: {
										type: extension,
										url: e.target.result 
									}
								})
							reader.readAsDataURL(files[i]);
						} catch (error) {
							console.log("err", error)
						}
					}
					this.setState({ onFetch: false })
				}
			)
		}
	}
	
	renderModalDeleteConfirmation() {
		const { onFetch, showDeleteConfirmationModal, deletedItem } = this.state
		return (
			<ModalBox
				size="lg"
				title={(<div>Confirm to delete <b>{deletedItem && deletedItem.name ? deletedItem.name : ''}</b>?</div>)}
				className="absolute-center" 
				showModal={showDeleteConfirmationModal} 
				toogleModal={this.closeDeleteConfirmation}
				body={(
					<Container className="p-2" style={{minWidth: "300px"}}>
						<div>This product will be <b>Remove</b> from the list when deleted.</div>
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
					</Container>
				)}
			>
				<Button color="danger" className="mr-2" disabled={onFetch} onClick={this.doDeleteItem}>Continue</Button>
				<Button color="secondary" className="float-right" disabled={onFetch} onClick={this.closeDeleteConfirmation}>Cancel</Button>
			</ModalBox>
		)
	}

	renderModalAddEditItem() {
		const { onFetch, isEdited, showAddEditItemModal, payloadProductName, payloadProductPrice, payloadProductImage, payloadProductDescription } = this.state
		return (
			<ModalBox 
				title={isEdited ? `Edit - ${payloadProductName}` : 'New Food Package'} 
				size="lg" 
				className="absolute-center" 
				showModal={showAddEditItemModal} 
				body={(
					<Container className="p-0" style={{minWidth: "300px"}}>
						<AvForm method="post" autoComplete="off">
							<Row>
								<Col sm="12" lg="12">
									<Row>
										<Col lg="12">
											<FormInputValidation 
												withLabel={true}
												labelName="Food Package Name"
												labelClassName="font-14 mb-0 text-999999"
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="formProductName" 
												formType="text" 
												formName="payloadProductName" 
												formPlaceholder="Input text here..." 
												formErrorMessage="This form cannot be empty" 
												onChange={this.handleChange} 
												formValue={payloadProductName}
												formValidate={{
													required: { value: true, errorMessage: 'This form cannot be empty' },
													minLength: { value: 5, errorMessage: 'Name must be minimum 5 characters' },
													maxLength: { value: 100, errorMessage: 'Name must be maximum 100 characters' }
												}} 
											/>
										</Col>
										<Col lg="12">
											<FormInputValidation 
												withLabel={true}
												labelName="Food Package Price"
												labelClassName="font-14 mb-0 text-999999"
												containerClassName="mb-1"
												formClassName="p-2 bg-white mb-0"
												formId="formProductPrice" 
												formType="number" 
												formName="payloadProductPrice" 
												formPlaceholder="Input number here..." 
												formErrorMessage="This form cannot be empty"
												onChange={this.handleChange} 
												formValue={payloadProductPrice}
												formValidate={{
													required: { value: true, errorMessage: 'This form cannot be empty' }
												}} 
											/>
											<FormText className="mb-3">Package Price: <b>IDR {numberWithDot(Number(payloadProductPrice))}</b></FormText>
										</Col>
										<Col lg="12">
											<FormInputValidation 
												withLabel={true}
												labelName="Food Package Description"
												labelClassName="font-14 mb-0 text-999999"
												containerClassName="mb-3"
												formClassName="p-2 bg-white mb-0"
												formId="formProductDescription" 
												formType="textarea" 
												formName="payloadProductDescription" 
												formPlaceholder="Input text here..." 
												formErrorMessage="This form cannot be empty" 
												onChange={this.handleChange} 
												formValue={payloadProductDescription}
												formValidate={{
													required: { value: true, errorMessage: 'This form cannot be empty' },
													minLength: { value: 10, errorMessage: 'Description must be minimum 10 characters' },
													maxLength: { value: 250, errorMessage: 'Description must be maximum 250 characters' }
												}} 
											/>
										</Col>
										<Col lg="4">
											<ContentBox title="Food Package Photo" className="p-1 overflow-auto" titleClass="font-14 mb-2 text-999999">
											{
												payloadProductImage ? 
													<div className="p-2 border border-grey d-inline-block" style={{maxWidth: "600px"}} >
														<img width="100%" height="auto" src={payloadProductImage.url ? payloadProductImage.url : payloadProductImage}/>
													</div> : ""
											}
											</ContentBox>
										</Col>
										<Col lg="12">
											<div className="form-group p-0">
												<div id="box-img" className="dropzone-wrapper">
													<div className="absolute-center text-center w-100">
														<i className="icon icon-image" />
														<p className="mt-2">Choose an image file or drag it here.</p>
													</div>
													<input 
														id="input-dnd-image" 
														type="file" 
														accept="image/png,image/x-png,image/jpeg,image/jpg" 
														name="img_thumbnail" 
														className="dropzone" 
														onChange={this.readFile} 
													/>
												</div>
											</div>
										</Col>
									</Row>
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
				<Button color="primary" className="mr-2" disabled={onFetch} onClick={isEdited ? this.doPutItem : this.doPostItem}>Save</Button>
				<Button color="secondary" className="float-right" disabled={onFetch} onClick={this.closeAddEditItemModal}>Cancel</Button>
			</ModalBox>
		)
	}

	onPaginationClick = (page) => {
		const { fetchLen, fetchSortBy, fetchOrderBy, fetchKeyword, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					const { getList_masterData, token, fetch_category } = this.props
					const resp = await getList_masterData(fetch_category, page, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(token), fetchKeyword)
					if(resp.status) {
						this.setState({fetchPage: page, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				} 
			)
		}
	}

	onSortInit = (e) => {
		const { fetchLen, fetchOrderBy, fetchKeyword, onFetch } = this.state
		const target = e.target, value = target.value, pages = 1
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchSortBy: value },
				async () => {
					const { getList_masterData, token, fetch_category } = this.props
					const resp = await getList_masterData(fetch_category, pages, fetchLen, value, fetchOrderBy, JSON.stringify(token), fetchKeyword)
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
		let pages = 1
		const { fetchLen, fetchSortBy, fetchOrderBy, fetchKeyword, onFetch } = this.state
		const orders = fetchSortBy != data.id ? 'desc' : fetchOrderBy == 'desc' ? 'asc' : 'desc'
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchSortBy: data.id, fetchOrderBy: orders },
				async () => {
					const { getList_masterData, token, fetch_category } = this.props
					const resp = await getList_masterData(fetch_category, pages, fetchLen, data.id, orders, JSON.stringify(token), fetchKeyword)
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
		let pages = 1, orders = "asc", sorts = "name"
		const { fetchLen, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchKeyword: keywords, fetchSortBy: sorts, fetchOrderBy: orders },
				async () => {
					const { getList_masterData, token, fetch_category } = this.props
					const resp = await getList_masterData(fetch_category, pages, fetchLen, sorts, orders, JSON.stringify(token), keywords)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	zoomImage = (data) => this.setState({showZoomImageModal: true, zoomImage: data})
	closeZoomImage = () => this.setState({showZoomImageModal: false, zoomImage: ""})

	// GENERAL MODAL
	renderModalZoomImg() {
		const { zoomImage, showZoomImageModal } = this.state
		return (
			<ModalBox
				title={zoomImage ? zoomImage.name : "Food Package"}
				size="lg"
				className="absolute-center" 
				bodyClassName="p-0"
				showModal={showZoomImageModal} 
				toogleModal={this.closeZoomImage}
				body={(
					<Container className="p-0" style={{minWidth: "300px", maxWidth: "800px"}}>
						{
							zoomImage ? 
								<img src={zoomImage.link ? zoomImage.link.url : zoomImage.image_url} width="100%" height="auto" /> 
								:
								<LoaderCard {...tableLoaderProps} />
						}
						
					</Container>
				)}
			>
				<Button color="secondary" className="mr-2 float-right" onClick={this.closeZoomImage}>Close</Button>
			</ModalBox>
		)
	}

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
		const { 
			showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, _listProduct, onFetch, fetchSortBy, fetchOrderBy, fetchKeyword, fetchPage, fetchLen 
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
							<h1 className="text-primary">FOOD PACKAGES</h1>
							<span><i className="icon-paperclip mx-1" />Total {_listProduct.total_elements} Food {_listProduct.total_elements > 1 ? 'Packages' : 'Package'}</span>
						</Col>
						<Col xs="12" className="d-flex justify-content-end mb-3">
							<Button size="sm" color="primary" className="py-2 px-3" onClick={this.addItemModal}>
								<i className="icon icon-plus" /> ADD NEW
							</Button>
						</Col>
                        <Col xs="12">
                            <AdvanceTableBox 
								isResponsive={true} 
								tHead={[
									{ name: "Image" },
									{ id: "name", name: "Name" },
									{ id: "price", name: "Price" },
									{ name: "Action"}
								]}
								listNumber={true}
								sortItems={[
									{ id: "name", name: "Name" },
									{ id: "price", name: "Price" }
								]}
								onSortClick={this.onSortInit}
								sortValue={fetchSortBy}
								onTargetSortClick={this.onTargetSortInit}
								orderValue={fetchOrderBy}
								onKeySearch={this.onSearchKeyInit}
								searchCategory={["Name"]}
								noResult={_listProduct.content.length === 0}
								pagination={
									<Pagination 
										ariaLabel="Page navigation"
										size="sm"
										totalContent={_listProduct.total_elements}
										currentPage={fetchPage}
										contentMaxLength={fetchLen}
										onClick={this.onPaginationClick}
									/>
								}
							>
								{
									!onFetch ?
										_listProduct.content.map((product, i) => (
											<tr key={i}>
												<th scope="row" className="pt-2" width="50px">{(i + 1) + (fetchPage > 1 ? (fetchPage-1) * fetchLen : 0)}</th>
												<td className="pt-2">
													<Button 
														color="transparent"
														className="mx-0 p-0 mb-1 overflow-hidden"
														style={{maxWidth: "150px", maxHeight: "150px"}}
														onClick={() => this.zoomImage(product)}
													>
														<img src={product.link ? product.link.url : product.image_url} width="100px" height="auto" />
													</Button>
												</td>
												<td className="pt-2">{product.name}<br/><span style={{color:"#c1c1c1"}}>{product.description}</span></td>
												<td className="pt-2">IDR {numberWithDot(product.price)}</td>
												<td className="pt-2">
													<div className="d-flex w-100">
														<Button 
															color="warning" 
															size="sm" 
															className="mr-1 mb-1" 
															onClick={() => this.editItemModal(product)}
														>
															<i className="icon icon-edit"/>
														</Button>
														<Button 
															color="danger" 
															size="sm" 
															className="mb-1" 
															onClick={() => this.showDeleteConfirmation(product)}
														>
															<i className="icon icon-trash-2"/>
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
					{ this.renderModalAddEditItem() }
					{ this.renderModalDeleteConfirmation() }
					{ this.renderModalZoomImg() }
					{ this.renderModalAlert() }
				</Container>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getList_masterData: bindActionCreators(getList_masterData, dispatch)
	}
}


export default connect(state => state, mapDispatchToProps)(MasterFood)