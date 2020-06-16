import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import { Container, Row, Col, Button, Input } from 'reactstrap'
import { AvForm } from 'availity-reactstrap-validation'
import FormInputValidation from '../../components/form/validateInputForm'
import ContentBox from '../../components/contentBox'
import ModalBox from '../../components/cards/modalBoxCard'
import LoaderCard from '../../components/cards/LoaderCard'
import AdvanceTableBox from '../../components/tables/advanceTable'
import Pagination from '../../components/cards/PaginationCard'
import dynamic from 'next/dynamic'
import { regexHtmlTag } from '../../components/functions'
import { auth, getListFaq, putListFaq, postListFaq, deleteListFaq } from '../../components/actions'

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
const QuillNoSSRWrapper = dynamic(import('react-quill'), { ssr: false, loading: () => <p>Loading ...</p> })
const modules = {
	toolbar: [
	  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
	  [{ size: [] }],
	  ['bold', 'italic', 'underline'],
	  [{ 'list': 'ordered' }, { 'list': 'bullet' }]
	],
	clipboard: {
	  matchVisual: true // toggle to add extra line breaks when pasting HTML:
	}
}
const formats = [
	'header', 'font', 'size',
	'bold', 'italic', 'underline',
	'list', 'bullet'
]

class FaqPage extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/faq", 
			token: token, page: 1, size: 10, listSortBy: "title", listOrderBy: "desc", keyword: ""
		}
		try {
			await store.dispatch(getListFaq(props.page, props.size, props.listSortBy, props.listOrderBy, token, props.keyword))
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

			fetchLen: props.size, 
			fetchPage: props.page,
			fetchSortBy: props.listSortBy,
			fetchOrderBy: props.listOrderBy,
			fetchKeyword: props.keyword,
			onFetch: false,
			faq_list: props.faqList,
			showDeleteConfirmationModal: false,
			showAddEditModal: false,
			isEdited: false,
			formQuestion: "",
			formAnswer: "",
			editedContent: null,
			deletedContent: null,
			showAlertModal: false, 
			alertModalMessage: ""
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			faq_list: nextProps.faqList,
		})
	}

	onPaginationClick = (page) => {
		const { fetchLen, fetchSortBy, fetchOrderBy, fetchKeyword, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					const { getListFaq, token } = this.props
					const resp = await getListFaq(page, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(token), fetchKeyword)
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
					const { getListFaq, token } = this.props
					const resp = await getListFaq(pages, fetchLen, value, fetchOrderBy, JSON.stringify(token), fetchKeyword)
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
					const { getListFaq, token } = this.props
					const resp = await getListFaq(pages, fetchLen, data.id, orders, JSON.stringify(token), fetchKeyword)
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
					const { getListFaq, token } = this.props
					const resp = await getListFaq(pages, fetchLen, sorts, orders, JSON.stringify(token), keywords)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	handleChange = (e) => {
		const target = e.target, value = regexHtmlTag(target.value), name = target.name
		this.setState({ [name]: value })
	}
	onContentStateChange = (value) => this.setState({ formAnswer: value })
	showDeleteModal = (data) => this.setState({deletedContent: data, showDeleteConfirmationModal: true})
	closeDeleteModal = () => this.setState({deletedContent: null, showDeleteConfirmationModal: false})
	showAddModal = () => this.setState({showAddEditModal: true, isEdited: false})
	showEditModal = (data) => this.setState({showAddEditModal: true, editedContent: data, formAnswer: data.content, formQuestion: data.title, isEdited: true})
	closeFormModal = () => this.setState({showAddEditModal: false, editedContent: null, formAnswer: "", formQuestion: "", isEdited: false})
	
	changeStatus = (data) => {
		if(!this.state.onFetch) {
			let datas = {
				id: data.id,
				title: data.title,
				content: data.content,
				published: !data.published
			}
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await putListFaq(datas, JSON.stringify(this.props.token))
					if(resp.status) {
						this.setState({onFetch: false}, () => this.onPaginationClick(1))
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	saveEditFaq = () => {
		const { editedContent, onFetch, fetchPage, formAnswer, formQuestion } = this.state
		if(!onFetch) {
			let datas = {
				id: editedContent.id,
				title: formQuestion,
				content: formAnswer,
				published: editedContent.published
			}
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await putListFaq(datas, JSON.stringify(this.props.token))
					if(resp.status) {
						this.setState({onFetch: false}, () => {
							this.closeFormModal()
							this.onPaginationClick(fetchPage)
						})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}

	addNewFaq = () => {
		const { onFetch, formAnswer, formQuestion } = this.state
		if(!onFetch && formQuestion.length >= 10 && formAnswer.length >= 10) {
			let datas = {
				title: formQuestion,
				content: formAnswer,
				published: false
			}
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await postListFaq(datas, JSON.stringify(this.props.token))
					const page = 1
					if(resp.status) {
						this.setState({onFetch: false, fetchPage: page, fetchSortBy: "title", fetchOrderBy: "desc"}, () => {
							this.closeFormModal()
							this.onPaginationClick(page)
						})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		} else {
			if(formQuestion.length < 10) {
				this.setState({onFetch: false, showAlertModal: true, alertModalMessage: "Question must be minimum 10 characters"})
			} else {
				this.setState({onFetch: false, showAlertModal: true, alertModalMessage: "Answer must be minimum 10 characters"})
			}
		}
	}	

	deleteFaq = () => {
		const { onFetch, deletedContent } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await deleteListFaq(deletedContent.id, JSON.stringify(this.props.token))
					const page = 1
					if(resp.status) {
						this.setState({onFetch: false, fetchPage: page, fetchSortBy: "title", fetchOrderBy: "desc"}, () => {
							this.closeDeleteModal()
							this.onPaginationClick(page)
						})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}
	
	// START RENDER FUNCTION
	renderAddEditForm() {
		const { showAddEditModal, formQuestion, formAnswer, onFetch, isEdited } = this.state
		return (
			<ModalBox 
				title={`FAQ - ${isEdited ? 'Edit' : 'Add New'}`} 
				size="lg" 
				className="absolute-center" 
				showModal={showAddEditModal} 
				body={(
					<Container style={{minWidth: "300px"}}>
						<AvForm autoComplete="off">
							<Row>
								<Col lg="12" className="p-0">
									<ContentBox title="Question" className="py-2 px-0 mb-2" titleClass="font-16 text-primary mb-3">
										<FormInputValidation 
											formClassName="py-4 px-2 bg-white mb-2"
											formId="yourFormQuestion" 
											formType="text" 
											formName="formQuestion" 
											formPlaceholder="Title Text" 
											formErrorMessage="Invalid Question Text" 
											onChange={this.handleChange} 
											formValue={formQuestion}
											formValidate={{
												required: { value: true, errorMessage: 'Please input a valid question!' },
												minLength: { value: 10, errorMessage: 'Question must be minimum 10 characters' },
												maxLength: { value: 300, errorMessage: 'Question must be maximum 300 characters' }
											}} 
										/>
									</ContentBox>
								</Col>
								<Col lg="12" className="p-0">
									<ContentBox title="Answer" className="py-2 px-0 mb-2" titleClass="font-16 text-primary mb-3">
										<QuillNoSSRWrapper
											value={formAnswer} 
											onChange={this.onContentStateChange} 
											modules={modules}
											formats={formats}
											theme='snow'
										/>
									</ContentBox>
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
				<Button color="primary" className="mr-2" disabled={onFetch} onClick={isEdited ? this.saveEditFaq : this.addNewFaq}>Save</Button>
				<Button color="secondary" className="float-right" disabled={onFetch} onClick={this.closeFormModal}>Cancel</Button>
			</ModalBox>
		)
	}
	// Delete Confirmation Modal
	renderDeleteModal() {
		const { onFetch, showDeleteConfirmationModal } = this.state
		return (
			<ModalBox
				title={(<div>Confirm to delete ?</div>)}
				className="absolute-center" 
				showModal={showDeleteConfirmationModal} 
				toogleModal={this.closeDeleteModal}
				size="lg"
				body={(
					<div className="p-2">
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
				<Button color="danger" className="mr-2" onClick={this.deleteFaq} disabled={onFetch}>Continue</Button>
				<Button color="secondary" className="float-right" onClick={this.closeDeleteModal} disabled={onFetch}>Cancel</Button>
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
	// END RENDER FUNCTION

	render() {
		const { 
			showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, faq_list, fetchLen, fetchPage, fetchSortBy, fetchOrderBy, fetchKeyword, onFetch 
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
							<h1 className="text-primary">Frequently Asked Questions - FAQ</h1>
							<span><i className="icon-paperclip mx-1" />Total {faq_list.total_elements} {faq_list.total_elements > 1 ? 'FAQs' : 'FAQ'}</span>
						</Col>
						<Col lg="12" className="d-flex justify-content-end mb-3">
							<Button 
								size="sm" 
								color="primary" 
								className="py-2 px-3" 
								onClick={this.showAddModal}
							>
								<i className="icon icon-plus" /> ADD NEW FAQ
							</Button>
						</Col>
						<Col lg="12">
							<AdvanceTableBox 
								isResponsive={true} 
								tHead={[
									{ id: "title", name: "Question" },
									{ id: "published", name: "Status" },
									{ name: "Action" }
								]}
								listNumber={true}
								sortItems={[
									{ id: "title", name: "Question" },
									{ id: "published", name: "Status" }
								]}
								onSortClick={this.onSortInit}
								sortValue={fetchSortBy}
								onTargetSortClick={this.onTargetSortInit}
								orderValue={fetchOrderBy}
								onKeySearch={this.onSearchKeyInit}
								searchCategory={["Question"]}
								noResult={faq_list.content.length === 0}
								pagination={
									<Pagination 
										ariaLabel="Page navigation"
										size="sm"
										onClick={this.onPaginationClick}
										totalContent={faq_list.total_elements}
										currentPage={fetchPage}
										contentMaxLength={fetchLen}
									/>
								}
							>
								{
									!onFetch ?
										faq_list.content.map((data, key) => (
											<tr key={key}>
												<th scope="row" className="pt-2" width="50px">{(key + 1) + (fetchPage > 1 ? (fetchPage-1) * fetchLen : 0)}</th>
												<td className="pt-2">{data.title}</td>
												<td className="pt-2">
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
															className="d-flex mr-1 mb-1"
															onClick={() => this.showEditModal(data)}
														><i className="icon icon-edit-3"/></Button>
														<Button 
															color="danger"
															size="sm" 
															className="d-flex mr-1 mb-1"
															disabled={data.published}
															onClick={() => this.showDeleteModal(data)}
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
				{ this.renderAddEditForm() }
				{ this.renderDeleteModal() }
				{ this.renderModalAlert() }
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getListFaq: bindActionCreators(getListFaq, dispatch),
	}
}
export default connect(state => state, mapDispatchToProps)(FaqPage)