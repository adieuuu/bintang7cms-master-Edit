import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import AdvanceTableBox from '../../components/tables/advanceTable'
import Pagination from '../../components/cards/PaginationCard'
import { Container, Row, Col, Button, Label, Input } from 'reactstrap'
import ModalBox from '../../components/cards/modalBoxCard'
import LoaderCard from '../../components/cards/LoaderCard'
import { AvForm } from 'availity-reactstrap-validation'
import FormInputValidation from '../../components/form/validateInputForm'
import FormInput from '../../components/form/inputForm'
import { regexHtmlTag } from '../../components/functions'
import { auth, getListTHHero, addNewTHHero, editTHHero, deleteTHHero } from '../../components/actions'
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

class ARTamanHerbalHero extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/taman-herbal-hero",
			page: 1, size: 10, sortBy: "name", orderBy: "desc", keyword: "", token: token
		}
		try {
			await store.dispatch(getListTHHero(props.page, props.size, props.sortBy, props.orderBy, token, props.keyword))
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
			listTamanHerbal: props.tamanHerbal_hero,
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
			editedQuestionIndex: 0,

			formNamaTumbuhan: "",
			formDescription: "",
			formQuestionAnswer: [],
			formTempQuestion: "",
			formTempChoiceA: "",
			formTempChoiceB: "",
			formTempChoiceC: "",
			formTempChoiceD: "",
			formTempCorrectAnswer: null,
			formImageThumbs: [],

			showQRModal: false,
			selectedTamanHerbal: null,
			showAlertModal: false, 
			alertModalMessage: "",

			showAddQAFormModal: false,
			isEdited: false
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			listTamanHerbal: nextProps.tamanHerbal_hero
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
					const { getListTHHero, token } = this.props
					const resp = await getListTHHero(page, fetchLen, fetchSortBy, fetchOrderBy, JSON.stringify(token), fetchSearchKey)
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
					const { getListTHHero, token } = this.props
					const resp = await getListTHHero(pages, fetchLen, value, fetchOrderBy, JSON.stringify(token), fetchSearchKey)
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
					const { getListTHHero, token } = this.props
					const resp = await getListTHHero(pages, fetchLen, sorts, orders, JSON.stringify(token), keywords)
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
					const { getListTHHero, token } = this.props
					const resp = await getListTHHero(pages, fetchLen, data.id, orders, JSON.stringify(token), fetchSearchKey)
					if(resp.status) {
						this.setState({fetchPage: pages, onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}
	
	// ADD NEW CONTENT SECTION
	// Add New Component Form & Modal
	showAddHeroModal = () => this.setState({
			showNewItemFormModal: true, 
			isEdited: false
		})
	editHeroModal = (data) => this.setState({
			editedContent: data, 
			formNamaTumbuhan: data.name, 
			formDescription: data.description, 
			formQuestionAnswer: data.questions, 
			formTempQuestion: "",
			formImageThumbs: data.images,
			showNewItemFormModal: true,
			isEdited: true
		})
	closeAddEditHeroModal = () => this.setState({
			showNewItemFormModal: false, 
			formNamaTumbuhan: "",
			formDescription: "",
			formQuestionAnswer: [],
			formTempQuestion: "",
			formImageThumbs: [],
			editedContent: null,
			isEdited: false
		})
	editQuestion = (data, index) => this.setState({
			showAddQAFormModal: true,
			editedQuestionIndex: index,
			formTempQuestion: data.question, 
			formTempCorrectAnswer: data.answer, 
			formTempChoiceA: data.choices[0] ? data.choices[0] : "", 
			formTempChoiceB: data.choices[1] ? data.choices[1] : "", 
			formTempChoiceC: data.choices[2] ? data.choices[2] : "", 
			formTempChoiceD: data.choices[3] ? data.choices[3] : ""
		})
	removeQA = (index) => {
		let arr = Object.assign([], this.state.formQuestionAnswer)
		arr.splice(index, 1)
		this.setState({formQuestionAnswer: arr})
	}
	addQuestion = () => this.setState({showAddQAFormModal: true})
	closeAddEditQuestion = () => this.setState({
			showAddQAFormModal: false,
			editedQuestionIndex: 0,
			formTempQuestion: "", 
			formTempCorrectAnswer: null, 
			formTempChoiceA: "", 
			formTempChoiceB: "", 
			formTempChoiceC: "", 
			formTempChoiceD: ""
		})
	setCorrectedAnswer = (data) => this.setState({formTempCorrectAnswer: data})
	tempSaveQA = () => {
		const { 
			isEdited, editedQuestionIndex, formQuestionAnswer, formTempQuestion, formTempCorrectAnswer, formTempChoiceA, formTempChoiceB, formTempChoiceC, formTempChoiceD 
		} = this.state
		let choice = [formTempChoiceA, formTempChoiceB, formTempChoiceC, formTempChoiceD]
		choice = choice.filter((el) => { return el.length > 0 })
		if(formQuestionAnswer.length < 4 && formTempQuestion && formTempCorrectAnswer && choice.length > 0 ) {
			if(!isEdited) { // Add New Question
				this.setState(
					{ formQuestionAnswer: [ ...formQuestionAnswer, { question: formTempQuestion, choices: choice, answer: formTempCorrectAnswer } ] },
					() => this.closeAddEditQuestion()
				)
			} else { // Edit Question
				let arr = Object.assign([], formQuestionAnswer)
				arr.splice(editedQuestionIndex, 1)
				this.setState(
					{ formQuestionAnswer: arr },
					() => {
						this.setState(
							{ formQuestionAnswer: [ ...formQuestionAnswer, { question: formTempQuestion, choices: choice, answer: formTempCorrectAnswer } ] },
							() => this.closeAddEditQuestion()
						)
					}
				)
			}
		} else {
			if(formQuestionAnswer.length === 4) {
				this.setState({showAlertModal: true, alertModalMessage: "You have reached the maximum number of answer choices"})
			} else if(!formTempCorrectAnswer) {
				this.setState({showAlertModal: true, alertModalMessage: "You have not selected the correct answer"})
			} else {
				this.setState({showAlertModal: true, alertModalMessage: "Please fill in all the required forms"})
			}
		}
	}
	renderModalAddEditQA() {
		const { showAddQAFormModal, formTempQuestion, formTempChoiceA, formTempChoiceB, formTempChoiceC, formTempChoiceD, formTempCorrectAnswer } = this.state
		return (
			<ModalBox
				size="lg"
				title={(<div>Add Question &amp; Answer</div>)}
				className="absolute-center" 
				showModal={showAddQAFormModal} 
				toogleModal={this.closeAddEditQuestion}
				body={(
					<Container className="p-0" style={{minWidth: "300px"}}>
						<AvForm method="post" autoComplete="off">
							<Row>
								<Col lg="12">
									<FormInputValidation 
										withLabel={true}
										labelName="Question"
										labelClassName="font-weight-bold font-14 mb-1"
										containerClassName="mb-3"
										formClassName="p-2 bg-white mb-0"
										formId="yourFormTempQuestion" 
										formType="text" 
										formName="formTempQuestion" 
										formPlaceholder="Question" 
										formErrorMessage="This form cannot be empty" 
										onChange={this.handleChange} 
										formValue={formTempQuestion}
										formValidate={{
											required: { value: true, errorMessage: 'This form cannot be empty' },
											maxLength: { value: 200, errorMessage: 'Question must be maximum 200 characters' }
										}} 
									/>
								</Col>
								<Col lg="12" className="pl-3 mb-2"><span className="font-weight-bold font-14">Answer</span></Col>
								<Col lg="12">
									<Row>
										<Col lg="12">
											<div className="d-flex w-100">
												<div className="font-weight-bold font-20 pr-2" style={{paddingTop: "5px"}}>A.</div>
												<FormInput 
													containerClassName="mb-3 p-0 w-100"
													formClassName="p-2 bg-white mb-0"
													formId="yourFormTempChoiceA"
													formType="text" 
													formName="formTempChoiceA"
													formPlaceholder="Choice A - Answer" 
													onChange={this.handleChange} 
													formValue={formTempChoiceA}
												/>
												<div className="d-flex font-weight-bold font-20" style={{paddingTop: "5px", paddingLeft: "35px"}}>
													<Label check>
														<Input 
															type="radio" 
															name="correctAnswer" 
															disabled={formTempChoiceA.length < 1} 
															defaultChecked={formTempChoiceA == formTempCorrectAnswer}
															onClick={() => this.setCorrectedAnswer(formTempChoiceA)}
														/>{' '}Correct
													</Label>
												</div>
											</div>
										</Col>
									</Row>
									<Row>
										<Col lg="12">
											<div className="d-flex w-100">
												<div className="font-weight-bold font-20 pr-2" style={{paddingTop: "5px"}}>B.</div>
												<FormInput 
													containerClassName="mb-3 p-0 w-100"
													formClassName="p-2 bg-white mb-0"
													formId="yourFormTempChoiceB"
													formType="text" 
													formName="formTempChoiceB"
													formPlaceholder="Choice B - Answer" 
													onChange={this.handleChange} 
													formValue={formTempChoiceB}
												/>
												<div className="d-flex font-weight-bold font-20" style={{paddingTop: "5px", paddingLeft: "35px"}}>
													<Label check>
														<Input 
															type="radio" 
															name="correctAnswer" 
															disabled={formTempChoiceB.length < 1} 
															defaultChecked={formTempChoiceB == formTempCorrectAnswer}
															onClick={() => this.setCorrectedAnswer(formTempChoiceB)}
														/>{' '}Correct
													</Label>
												</div>
											</div>
										</Col>
									</Row>
									<Row>
										<Col lg="12">
											<div className="d-flex w-100">
												<div className="font-weight-bold font-20 pr-2" style={{paddingTop: "5px"}}>C.</div>
												<FormInput 
													containerClassName="mb-3 p-0 w-100"
													formClassName="p-2 bg-white mb-0"
													formId="yourFormTempChoiceC"
													formType="text" 
													formName="formTempChoiceC"
													formPlaceholder="Choice C - Answer" 
													onChange={this.handleChange} 
													formValue={formTempChoiceC}
												/>
												<div className="d-flex font-weight-bold font-20" style={{paddingTop: "5px", paddingLeft: "35px"}}>
													<Label check>
														<Input 
															type="radio" 
															name="correctAnswer" 
															disabled={formTempChoiceC.length < 1}
															defaultChecked={formTempChoiceC == formTempCorrectAnswer}
															onClick={() => this.setCorrectedAnswer(formTempChoiceC)}
														/>{' '}Correct
													</Label>
												</div>
											</div>
										</Col>
									</Row>
									<Row>
										<Col lg="12">
											<div className="d-flex w-100">
												<div className="font-weight-bold font-20 pr-2" style={{paddingTop: "5px"}}>D.</div>
												<FormInput 
													containerClassName="mb-3 p-0 w-100"
													formClassName="p-2 bg-white mb-0"
													formId="yourFormTempChoiceD"
													formType="text" 
													formName="formTempChoiceD"
													formPlaceholder="Choice D - Answer" 
													onChange={this.handleChange} 
													formValue={formTempChoiceD}
												/>
												<div className="d-flex font-weight-bold font-20" style={{paddingTop: "5px", paddingLeft: "35px"}}>
													<Label check>
														<Input 
															type="radio" 
															name="correctAnswer" 
															disabled={formTempChoiceD.length < 1} 
															defaultChecked={formTempChoiceD == formTempCorrectAnswer}
															onClick={() => this.setCorrectedAnswer(formTempChoiceD)}
														/>{' '}Correct
													</Label>
												</div>
											</div>
										</Col>
									</Row>
								</Col>
							</Row>
						</AvForm>
					</Container>
				)}
			>
				<Button color="danger" className="mr-2" onClick={this.tempSaveQA}>Save Q&amp;A</Button>
				<Button color="secondary" className="float-right" onClick={this.closeAddEditQuestion}>Cancel</Button>
			</ModalBox>
		)
	}

	saveNewContent = () => {
		const { onFetch, isEdited, formNamaTumbuhan, formDescription, formQuestionAnswer, formImageThumbs } = this.state
		let options = {
			name: formNamaTumbuhan,
			description: formDescription,
			questions: formQuestionAnswer,
			images: formImageThumbs
		}
		if(formQuestionAnswer.length > 0 && formNamaTumbuhan && formDescription && formImageThumbs.length > 0) {
			if(!onFetch && !isEdited) {
				this.setState(
					{ onFetch: true },
					async () => {
						const resp = await addNewTHHero(options, JSON.stringify(this.props.token))
						if(resp.status) {
							this.closeAddEditHeroModal()
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
		const { onFetch, isEdited, fetchPage, editedContent, formNamaTumbuhan, formDescription, formImageThumbs, formQuestionAnswer } = this.state
		let options = {
			name: formNamaTumbuhan,
			description: formDescription,
			questions: formQuestionAnswer,
			images: formImageThumbs
		}
		if(formQuestionAnswer.length > 0 && formNamaTumbuhan && formDescription && formImageThumbs.length > 0) {
			if(!onFetch && isEdited) {
				this.setState(
					{ onFetch: true },
					async () => {
						const resp = await editTHHero(editedContent.id, options, JSON.stringify(this.props.token))
						if(resp.status) {
							this.closeAddEditHeroModal()
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
		const { showNewItemFormModal, formNamaTumbuhan, formDescription, formQuestionAnswer, formTempQuestion, formImageThumbs, onFetch, isEdited } = this.state
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
								<Col lg="12">
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
											maxLength: { value: 100, errorMessage: 'Name must be maximum 100 characters' }
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
								<Col lg="12" className="pl-3 mb-2"><span className="font-weight-bold font-14">Question &amp; Answer</span></Col>
								{
									formQuestionAnswer ?
										<Col lg="12" className={formQuestionAnswer.length < 4 ? "" : "mb-3"}>
										{
											formQuestionAnswer.map((data, index) => (
												<div 
													key={index} 
													className="w-25 position-relative d-inline-block border mr-4 mt-3 mb-2 shadow-sm cursor-pointer"
												>
													<div
														className="d-inline-block p-1 w-100 cursor-pointer"
														onClick={() => this.editQuestion(data, index)}
													>
														<div className="w-100 text-substr font-14 px-2 pt-2"><b>Q:</b>{' '}{data.question}</div>
														<div className="w-100 text-substr font-14 px-2 pb-1"><b>A:</b>{' '}{data.answer}</div>
													</div>
													<Button 
														className="absolute-center-right rounded-circle" 
														color="danger" 
														style={{height: "30px", width: "30px", top: "0", right: "-15px"}}
														onClick={() => this.removeQA(index)}
													>
														<i className="absolute-center icon icon-trash-2" />
													</Button>
												</div>
											))
										}
									</Col> : ""
								}
								{
									formQuestionAnswer.length < 4 ?
										<Col lg="12">
											<Row>
												<Col xs="8" sm="8" md="10" lg="10" className="pr-0">
													<FormInput 
														containerClassName="mb-3"
														formClassName="p-2 bg-white mb-0"
														formId="yourFormTempQuestion" 
														formType="text" 
														formName="formTempQuestion" 
														formPlaceholder="Question" 
														onChange={this.handleChange} 
														formValue={formTempQuestion}
													/>
												</Col>
												<Col xs="4" sm="4" md="2" lg="2" className="pl-2" style={{paddingTop: "1px"}}>
													<div className="btn btn-primary mt-1 w-100 cursor-pointer" onClick={this.addQuestion}><i className="icon icon-plus" /></div>
												</Col>
											</Row>
										</Col> : ""
								}
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
				<Button color="secondary" className="float-right" onClick={this.closeAddEditHeroModal} disabled={onFetch}>Cancel</Button>
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
					const resp = await deleteTHHero(deletedContent, JSON.stringify(this.props.token))
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
		const { showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, listTamanHerbal, fetchPage, fetchLen, fetchSortBy, fetchOrderBy, onFetch } = this.state
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
							<h1 className="text-primary mb-2">Taman Herbal - Hero</h1>
							<span><i className="icon-paperclip mx-1" />Total {listTamanHerbal.total_elements} {listTamanHerbal.total_elements > 1 ? 'Herbal Heroes' : 'Herbal Hero'}</span>
						</Col>
						<Col lg="12" className="d-flex justify-content-end mb-3">
							<Button size="sm" color="primary" className="py-2 px-3" onClick={() => this.showAddHeroModal()}>
								<i className="icon icon-plus" /> ADD NEW
							</Button>
						</Col>
						<Col lg="12">
							<AdvanceTableBox 
								isResponsive={true} 
								tHead={[
									{ id: "name", name: "Name" },
									{ name: "Actions" }
								]}
								listNumber={true}
								sortItems={[
									{ id: "name", name: "Name" }
								]}
								onSortClick={this.onSortInit}
								onTargetSortClick={this.onTargetSort}
								sortValue={fetchSortBy}
								orderValue={fetchOrderBy}
								onKeySearch={this.onSearchKeyword}
								searchCategory={["Name"]}
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
												<td className="pt-2 pr-2">{data.name}</td>
												<td className="pt-2">
													<div className="d-flex w-100">
														<Button 
															color="warning" 
															size="sm" 
															className="mr-1 mb-1" 
															onClick={() => this.editHeroModal(data)}
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
										<tr><td colSpan="3"><LoaderCard {...tableLoaderProps} /></td></tr>
								}
							</AdvanceTableBox>
						</Col>
					</Row>
				</Container>
				{ this.renderModalDeleteConfirmation() }
				{ this.renderModalAddEditItem() }
				{ this.renderModalAddEditQA() }
				{ this.renderModalAlert() }
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getListTHHero: bindActionCreators(getListTHHero, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(ARTamanHerbalHero)