import React from 'react'
import nextCookie from 'next-cookies'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, Row, Col, Button } from 'reactstrap'
import { AvForm } from 'availity-reactstrap-validation'
import ContentBox from '../../components/contentBox'
import FormInputValidation from '../../components/form/validateInputForm'
import LoaderCard from '../../components/cards/LoaderCard'
import ModalBox from '../../components/cards/modalBoxCard'
import dynamic from 'next/dynamic'
import { regexHtmlTag } from '../../components/functions'
import { auth, getTermConditions, putTermConditions } from '../../components/actions'

const loaderProps = {
	className: "position-absolute w-100 h-100 d-block",
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

class TermAndCondition extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { showHeader: true, showFooter: true, pageName: "/term-and-condition", token: token }
		try {
			await store.dispatch(getTermConditions(token))
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
			_term_conditon: props.termsCondition,
			formTnCTitle: props.termsCondition.title,
			formTnCContent: props.termsCondition.content,
			showAlertModal: false, 
			alertModalMessage: ""
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			_term_conditon: nextProps.termsCondition
		})
	}

	handleChange = (e) => {
		const target = e.target, value = regexHtmlTag(target.value), name = target.name
		this.setState({ [name]: value })
	}

	onContentStateChange = (value) => this.setState({ formTnCContent: value })

	handleSubmit = () => {
		const { onFetch, formTnCContent, formTnCTitle } = this.state
		if(!onFetch) {
			let datas = {
				title: formTnCTitle,
				content: formTnCContent
			}
			this.setState(
				{ onFetch: true },
				async () => {
					const { putTermConditions, token } = this.props
					const resp = await putTermConditions(datas, JSON.stringify(token))
					if(resp.status) {
						this.setState({onFetch: false})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
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
					<div style={{maxWidth: 310}}>{alertModalMessage}</div>
				)}
			>
				<Button color="secondary" className="mr-2 float-right" onClick={() => this.setState({showAlertModal: false})}>Close</Button>
			</ModalBox>
		)
	}

	render() {
		const { showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, formTnCContent, formTnCTitle, onFetch } = this.state
		const { title, content } = this.state._term_conditon
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
					className="contentContainer position-relative px-4 pt-4 pb-2"
					style={{
						marginLeft: navIsOpen ? navMaxWidth-navMinWidth : 0,
						width: navIsOpen ? `calc(100% - ${navMaxWidth-navMinWidth}px)` : '100%'
					}}
				>
					<AvForm autoComplete="off" className="absolute-top-center" style={{minWidth: "300px", maxWidth: "800px"}}>
						<Row>
							<Col lg="12" className="mt-5 mb-4 text-center">
								<h1 className="text-primary mb-2">Terms &amp; Conditions</h1>
							</Col>
							<Col lg="12">
								<ContentBox title="Title" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
									<FormInputValidation 
										formClassName="py-4 px-2 bg-white mb-2"
										formId="yourFormTnCTitle" 
										formType="text" 
										formName="formTnCTitle" 
										formPlaceholder="Title Text" 
										formErrorMessage="Invalid Title Text" 
										onChange={this.handleChange} 
										formValue={formTnCTitle}
										formValidate={{
											required: { value: true, errorMessage: 'Please input a valid title!' },
											minLength: { value: 5, errorMessage: 'Title must be minimum 5 characters' },
											maxLength: { value: 50, errorMessage: 'Title must be maximum 50 characters' }
										}} 
									/>
								</ContentBox>
							</Col>
							<Col lg="12">
								<ContentBox title="Content" className="py-2 px-1 mb-2" titleClass="font-16 text-primary mb-3">
									<QuillNoSSRWrapper
										value={formTnCContent} 
										onChange={this.onContentStateChange} 
										modules={modules}
										formats={formats}
										theme='snow'
									/>
								</ContentBox>
							</Col>
						</Row>
						<Button 
							size="lg" 
							color="primary" 
							className="float-right mx-1 mt-3 mb-2 px-5 text-uppercase font-14"
							disabled={formTnCContent !== content || formTnCTitle !== title ? false : true}
							onClick={this.handleSubmit}
						>Save</Button>
					</AvForm>
					{ onFetch ? <LoaderCard {...loaderProps} /> : "" }
				</Container>
				{ this.renderModalAlert() }
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getTermConditions: bindActionCreators(getTermConditions, dispatch),
		putTermConditions: bindActionCreators(putTermConditions, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(TermAndCondition)