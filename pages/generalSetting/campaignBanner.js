import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import { Container, Row, Col, Button } from 'reactstrap'
import AdvanceTableBox from '../../components/tables/advanceTable'
import Pagination from '../../components/cards/PaginationCard'
import ContentBox from '../../components/contentBox'
import ModalBox from '../../components/cards/modalBoxCard'
import LoaderCard from '../../components/cards/LoaderCard'
import { AvForm } from 'availity-reactstrap-validation'
import FormInputValidation from '../../components/form/validateInputForm'
import { regexHtmlTag } from '../../components/functions'
import { auth, getListBannerCampaign, putBannerCampaign, postBannerCampaign, deleteBannerCampaign } from '../../components/actions'
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

class CampaignBanner extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/campaign-banner", 
			page: 1, size: 10, sortBy: 'title', orderBy: 'desc', keyword: '', token: token 
		}
		try {
            await store.dispatch(getListBannerCampaign(props.page, props.size, props.sortBy, props.orderBy, token, props.keyword))
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
			onFetch: false,
			fetchPage: props.page,
			fetchLen: props.size,
			fetchSortBy: props.sortBy,
			fetchOrderBy: props.orderBy,
			fetchKeyword: props.keyword,
			listBanner: props.listCampaign_banner,

			showAddEditBannerModal: false,
			isEdited: false,
			editedItem: null,
			showDeleteConfirmationModal: false,
			deletedItem: null, 
			
			showZoomImageModal: false,
			zoomImage: "",

			formTitleCampaign: "",
			formUrlCampaign: "",
			formImageCampaign: "",

			showAlertModal: false, 
			alertModalMessage: ""
        }
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			listBanner: nextProps.listCampaign_banner
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

	handleChange = (e) => {
		const target = e.target, value = target.value, name = target.name
		this.setState({ [name]: regexHtmlTag(value) })
	}

	readFile = (e) => {
		if(!this.state.onFetch) {
			let files = e.target.files
			this.setState(
				{ onFetch: true },
				async () => {
					for(var i = 0; i < files.length; i++) {
						let reader = new FileReader()
						try {
							reader.onload = (e) => this.setState({ formImageCampaign:  e.target.result })
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

	onPaginationClick = (page) => {
		const { fetchLen, fetchSortBy, fetchOrderBy, fetchKeyword, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					const { getListBannerCampaign, token } = this.props
					const resp = await getListBannerCampaign(page, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(token), fetchKeyword)
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
					const { getListBannerCampaign, token } = this.props
					const resp = await getListBannerCampaign(pages, fetchLen, value, fetchOrderBy, JSON.stringify(token), fetchKeyword)
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
					const { getListBannerCampaign, token } = this.props
					const resp = await getListBannerCampaign(pages, fetchLen, data.id, orders, JSON.stringify(token), fetchKeyword)
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
		let pages = 1, orders = "desc", sorts = "title"
		const { fetchLen, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true, fetchKeyword: keywords, fetchSortBy: sorts, fetchOrderBy: orders },
				async () => {
					const { getListBannerCampaign, token } = this.props
					const resp = await getListBannerCampaign(pages, fetchLen, sorts, orders, JSON.stringify(token), keywords)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	editItemModal = (data) => this.setState({
			showAddEditBannerModal: true,
			formTitleCampaign: data.title,
			formUrlCampaign: data.links[1].url,
			formImageCampaign: data.links[0].url,
			editedItem: data,
			isEdited: true
		})
	addNewItemModal = () => this.setState({showAddEditBannerModal: true, isEdited: false})
	closeAddEditModal = () => this.setState({
			showAddEditBannerModal: false,
			formTitleCampaign: "",
			formUrlCampaign: "",
			formImageCampaign: "",
			editedItem: null,
			isEdited: false
		})

	saveNewItem = () => {
		const { onFetch, formTitleCampaign, formUrlCampaign, formImageCampaign, fetchPage } = this.state
		if(!onFetch) {
			let datas = {
				title: formTitleCampaign,
				links: [
					{ type: "image_url", url: formImageCampaign }, 
					{ type: "webview_url", url: formUrlCampaign }
				],
				published: false
			}
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await postBannerCampaign(datas, JSON.stringify(this.props.token))
					if(resp.status) {
						this.closeAddEditModal()
						this.setState({onFetch: false}, () => this.onPaginationClick(fetchPage))
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	saveEditItem = () => {
		const { onFetch, formTitleCampaign, formUrlCampaign, formImageCampaign, editedItem } = this.state
		if(!onFetch) {
			let datas = {
				id: editedItem.id,
				title: formTitleCampaign,
				links: [
					{ type: "image_url", url: formImageCampaign }, 
					{ type: "webview_url", url: formUrlCampaign }
				],
				published: editedItem.published
			}
			let page = 1
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await putBannerCampaign(datas, JSON.stringify(this.props.token))
					if(resp.status) {
						this.closeAddEditModal()
						this.setState({onFetch: false, fetchPage: page, fetchSortBy: "title", fetchOrderBy: "desc", fetchKeyword: ""}, () => this.onPaginationClick(page))
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	changeStatus = (data) => {
		const { onFetch, fetchPage } = this.state 
		if(!onFetch) {
			let datas = {
				id: data.id,
				published: !data.published
			}
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await putBannerCampaign(datas, JSON.stringify(this.props.token))
					if(resp.status) {
						this.setState({onFetch: false}, () => this.onPaginationClick(fetchPage))
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}
	zoomImage = (data) => this.setState({showZoomImageModal: true, zoomImage: data})
	closeZoomImage = () => this.setState({showZoomImageModal: false, zoomImage: ""})

	deleteConfirmModal = (data) => this.setState({deletedItem: data, showDeleteConfirmationModal: true})
	closeDeleteConfirmation = () => this.setState({showDeleteConfirmationModal: false, deletedItem: null})
	deleteCampaign = () => {
		const { onFetch, deletedItem, fetchPage } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await deleteBannerCampaign(deletedItem, JSON.stringify(this.props.token))
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
	// END METHOD

	// ADD EDIT MODAL
	renderAddEditModal() {
		const { showAddEditBannerModal, isEdited, formImageCampaign, formTitleCampaign, formUrlCampaign, onFetch } = this.state
		return (
			<ModalBox
				title={isEdited ? `Edit ${formTitleCampaign}` : "Add New Campaign"}
				size="lg"
				className="absolute-center" 
				showModal={showAddEditBannerModal} 
				body={(
					<Container className="p-0" style={{minWidth: "300px"}}>
						<AvForm autoComplete="off">
							<Row>
								<Col lg="12">
									<ContentBox title="Title / Name" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
										<FormInputValidation 
											containerClassName="mb-2"
											formClassName="p-2 bg-white mb-0"
											formId="yourFormTitleCampaign" 
											formType="text" 
											formName="formTitleCampaign" 
											formPlaceholder="Campaign Name" 
											formErrorMessage="This form cannot be empty" 
											onChange={this.handleChange} 
											formValue={formTitleCampaign}
											formValidate={{
												required: { value: true, errorMessage: 'This form cannot be empty' },
												minLength: { value: 2, errorMessage: 'Title/Name must be minimum 5 characters' },
												maxLength: { value: 100, errorMessage: 'Title/Name must be maximum 100 characters' }
											}} 
										/>
									</ContentBox>
								</Col>
								<Col lg="12">
									<ContentBox title="Link / URL" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
										<FormInputValidation 
											containerClassName="mb-2"
											formClassName="p-2 bg-white mb-0"
											formId="yourFormUrlCampaign" 
											formType="text" 
											formName="formUrlCampaign" 
											formPlaceholder="e.g. https://domain.com" 
											formErrorMessage="Invalid Campaign URL" 
											onChange={this.handleChange} 
											formValue={formUrlCampaign}
											formValidate={{ 
												required: { value: true, errorMessage: 'Invalid Campaign URL' },
												pattern: { 
													value: '(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})', 
													errorMessage: 'Invalid Campaign URL' 
												},
												minLength: { value: 10, errorMessage: 'Link/URL must be minimum 10 characters' },
												maxLength: { value: 250, errorMessage: 'Link/URL must be maximum 250 characters' }
											}} 
										/>
									</ContentBox>
								</Col>
								<Col lg="4">
									<ContentBox title="Image Banner" className="py-2 px-1 overflow-auto" titleClass="font-16 text-primary mb-3">
										{ 
											formImageCampaign ? 
												<div className="w-100 p-2 border border-grey d-block overflow-hidden">
													<div className="w-100 overflow-hidden" style={{maxHeight: "300px"}}>
														<img width="100%" height="auto" src={formImageCampaign}/>
													</div>
												</div> : "" 
										}
									</ContentBox>
								</Col>
								<Col lg="12">
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
				<Button color="primary" disabled={onFetch} onClick={!isEdited ? this.saveNewItem : this.saveEditItem}>Save</Button>
				<Button color="secondary" className="mr-2 float-right" disabled={onFetch} onClick={this.closeAddEditModal}>Close</Button>
			</ModalBox>
		)
	}

	// DELETE SECTION
	// Delete Confirmation Modal
	renderModalDeleteConfirmation() {
		const { deletedItem, onFetch } = this.state
		let header = deletedItem ? ` ${deletedItem.title} ` : " "
		return (
			<ModalBox
				title={(<div>Confirm to delete<b>{header}</b>?</div>)}
				className="absolute-center" 
				showModal={this.state.showDeleteConfirmationModal} 
				toogleModal={this.closeDeleteConfirmation}
				body={(
					<Container className="p-2">
						<div>This content will be automatically <b>Unpublished</b> and <b>Removed</b> from the list when deleted.</div>
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
				<Button color="danger" className="mr-2" onClick={this.deleteCampaign} disabled={onFetch}>Continue</Button>
				<Button color="secondary" className="float-right" onClick={this.closeDeleteConfirmation} disabled={onFetch}>Cancel</Button>
			</ModalBox>
		)
	}

	renderModalZoomImg() {
		const { zoomImage, showZoomImageModal } = this.state
		return (
			<ModalBox
				title={zoomImage ? zoomImage.title : "Campaign Banner"}
				size="lg"
				className="absolute-center" 
				bodyClassName="p-0"
				showModal={showZoomImageModal} 
				toogleModal={this.closeZoomImage}
				body={(
					<Container className="p-0" style={{minWidth: "300px", maxWidth: "800px"}}>
						{
							zoomImage ? 
								<img src={zoomImage.links[0].url} width="100%" height="auto" /> 
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
		const { showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, listBanner, onFetch, fetchPage, fetchLen, fetchSortBy, fetchOrderBy } = this.state
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
					className="contentContainer px-4 pt-4 pb-2 position-relative"
					style={{
						marginLeft: navIsOpen ? navMaxWidth-navMinWidth : 0,
						width: navIsOpen ? `calc(100% - ${navMaxWidth-navMinWidth}px)` : '100%'
					}}
				>
					<Row>
						<Col lg="12" className="mb-5">
							<h1 className="text-primary mb-2">Campaign Banner</h1>
							<span><i className="icon-paperclip mx-1" />Total {listBanner.total_elements} {listBanner.total_elements > 1 ? 'Banners' : 'Banner'}</span>
						</Col>
						<Col lg="12" className="d-flex justify-content-end mb-3">
							<Button size="sm" color="primary" className="py-2 px-3" onClick={() => this.addNewItemModal()}>
								<i className="icon icon-plus" /> ADD CAMPAIGN
							</Button>
						</Col>
						<Col lg="12">
							{
								listBanner ?
									<AdvanceTableBox 
										isResponsive={true} 
										tHead={[
											{ name: "Image" },
											{ id: "title", name: "Name" },
											{ name: "Links" },
											{ id: "published", name: "Status" },
											{ name: "Action" }
										]}
										listNumber={true}
										sortItems={[
											{ id: "title", name: "Campaign Name" },
											{ id: "published", name: "Status" }
										]}
										onSortClick={this.onSortInit}
										sortValue={fetchSortBy}
										onTargetSortClick={this.onTargetSortInit}
										orderValue={fetchOrderBy}
										onKeySearch={this.onSearchKeyInit}
										searchCategory={["Name"]}
										noResult={listBanner.content.length === 0}
										pagination={
											<Pagination 
												ariaLabel="Page navigation"
												size="sm"
												onClick={this.onPaginationClick}
												totalContent={listBanner.total_elements}
												currentPage={fetchPage}
												contentMaxLength={fetchLen}
											/>
										}
									>
										{
											!onFetch ?
												listBanner.content.map((data, key) => (
													<tr key={key}>
														<th scope="row" width="50px">{(key + 1) + (fetchPage > 1 ? (fetchPage-1) * fetchLen : 0)}</th>
														<td className="pt-2 pr-3">
															<Button 
																color="transparent"
																className="mx-0 p-0 mb-1"
																onClick={() => this.zoomImage(data)}
															>
																<img src={data.links[0].url} width="100px" height="auto" />
															</Button>
														</td>
														<td className="pt-2 pr-3">{data.title}</td>
														<td className="pt-2 pr-3">{data.links[1].url}</td>
														<td className="pt-2 pr-3">
															{
																data.published ? 
																	<span style={{color:"green"}}>Published</span> : <span style={{color:"gray"}}>Unpublish</span>
															}
														</td>
														<td>
															<div className="d-flex w-100">
																<Button 
																	color={data.published ? "danger" : "primary"} 
																	size="sm" 
																	className="d-flex mr-1 mb-1"
																	onClick={() => this.changeStatus(data)}
																>{data.published ? "Unpublish" : "Publish"}</Button>
																<Button 
																	color="warning" 
																	size="sm" 
																	className="mr-1 mb-1" 
																	onClick={() => this.editItemModal(data)}
																><i className="icon icon-edit-3"/></Button>
																<Button 
																	color="danger" 
																	size="sm" 
																	className="mb-1" 
																	onClick={() => this.deleteConfirmModal(data)}
																><i className="icon icon-trash-2"/></Button>
															</div>
														</td>
													</tr>
												))
												:
												<tr><td colSpan="5"><LoaderCard {...tableLoaderProps} /></td></tr>
										}
									</AdvanceTableBox>
									:
									<div className="w-100 bg-white text-center py-5 text-999999">No data available</div>
							}
						</Col>
					</Row>
				</Container>
				{ this.renderModalDeleteConfirmation() }
				{ this.renderAddEditModal() }
				{ this.renderModalZoomImg() }
				{ this.renderModalAlert() }
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getListBannerCampaign: bindActionCreators(getListBannerCampaign, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(CampaignBanner)