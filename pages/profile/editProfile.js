import React from 'react'
import nextCookie from 'next-cookies'
import { connect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import { AvForm } from 'availity-reactstrap-validation'
import ContentBox from '../../components/contentBox'
import FormInputValidation from '../../components/form/validateInputForm'
import LoaderCard from '../../components/cards/LoaderCard'
import ModalBox from '../../components/cards/modalBoxCard'
import { regexHtmlTag } from '../../components/functions'
import { auth, changeMyProfile } from '../../components/actions'

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

class EditProfile extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, 
			pageName: "/edit-profile", token: token,
			error: 'Unable to fetch AsyncData on server' 
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
			
			formDefaultVal: {
				firstName: props.user.first_name,
				middleName: props.user.middle_name,
				lastName: props.user.last_name,
				email: props.user.email
			},
			formFirstName: props.user.first_name,
			formMiddleName: props.user.middle_name,
			formLastName: props.user.last_name,

			showSuccessModal: false,
			showAlertModal: false, 
			alertModalMessage: ""
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			formDefaultVal: {
				firstName: nextProps.user.first_name,
				middleName: nextProps.user.middle_name,
				lastName: nextProps.user.last_name,
			},
			formFirstName: nextProps.user.first_name,
			formMiddleName: nextProps.user.middle_name,
			formLastName: nextProps.user.last_name,
		})
	}

	handleChange = (e) => {
		const target = e.target, value = regexHtmlTag(target.value), name = target.name
		this.setState({ [name]: value })
	}

	handleSubmit = () => {
		const { onFetch, formFirstName, formMiddleName, formLastName, formDefaultVal } = this.state
		let isValid = formFirstName.length >= 2 && formMiddleName.length > 0 && formLastName.length > 0 && !onFetch
		if(isValid) {
			let datas = {
				account: { username: formDefaultVal.email },
				first_name: formFirstName,
				middle_name: formMiddleName,
				last_name: formLastName,
				email: formDefaultVal.email
			}
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await changeMyProfile(datas, JSON.stringify(this.props.token))
					if(resp.status) {
						this.setState({onFetch: false, showSuccessModal: true})
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
				body={(<div style={{maxWidth: 310}}>{alertModalMessage}</div>)}
			>
				<Button color="secondary" className="mr-2 float-right" onClick={() => this.setState({showAlertModal: false})}>Close</Button>
			</ModalBox>
		)
	}

	renderModalSuccess() {
		const { showSuccessModal } = this.state
		return (
			<ModalBox
				title={(<div>Edit Profile</div>)}
				size="lg"
				className="absolute-center" 
				showModal={showSuccessModal} 
				body={(<div style={{maxWidth: 310}}>Profile successfully updated.</div>)}
			>
				<Button 
					color="success" 
					className="mr-2 float-right" 
					onClick={() => this.setState({ showSuccessModal: false }, () => window.location.reload())}
				>Close</Button>
			</ModalBox>
		)
	}

	render() {
		const { showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, formFirstName, formMiddleName, formLastName, formDefaultVal, onFetch } = this.state
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
					<AvForm onValidSubmit={this.handleSubmit} method="post" autoComplete="off" className="absolute-top-center" style={{minWidth: "300px", maxWidth: "600px"}}>
						<Row>
							<Col lg="12" className="mt-5 mb-4 text-center">
								<h1 className="text-primary mb-2">Edit Profile</h1>
							</Col>
							<Col lg="12">
								<ContentBox title="First Name" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
									<FormInputValidation 
										formClassName="py-4 px-2 bg-white mb-2"
										formId="yourFormFirstName" 
										formType="text" 
										formName="formFirstName" 
										formPlaceholder="First Name" 
										formErrorMessage="First name cannot be empty" 
										onChange={this.handleChange} 
										formValue={formFirstName}
										formValidate={{
											required: { value: true, errorMessage: 'First name cannot be empty' },
											minLength: { value: 2, errorMessage: 'First name must be minimum 2 characters' },
											maxLength: { value: 50, errorMessage: 'First name must be maximum 50 characters' }
										}} 
									/>
								</ContentBox>
							</Col>
							<Col lg="12">
								<ContentBox title="Middle Name" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
									<FormInputValidation 
										formClassName="py-4 px-2 bg-white mb-2"
										formId="yourFormMiddleName" 
										formType="text" 
										formName="formMiddleName" 
										formPlaceholder="Middle Name" 
										formErrorMessage="Middle name cannot be empty" 
										onChange={this.handleChange} 
										formValue={formMiddleName}
										formValidate={{
											required: { value: true, errorMessage: 'Middle name cannot be empty' },
											minLength: { value: 1, errorMessage: 'Middle name must be minimum 1 characters' },
											maxLength: { value: 50, errorMessage: 'Middle name must be maximum 50 characters' }
										}} 
									/>
								</ContentBox>
							</Col>
							<Col lg="12">
								<ContentBox title="Last Name" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
									<FormInputValidation 
										formClassName="py-4 px-2 bg-white mb-2"
										formId="yourFormLastName" 
										formType="text" 
										formName="formLastName" 
										formPlaceholder="Retype Your New Password" 
										formErrorMessage="Last name cannot be empty" 
										onChange={this.handleChange} 
										formValue={formLastName}
										formValidate={{
											required: { value: true, errorMessage: 'Last name cannot be empty' },
											minLength: { value: 1, errorMessage: 'Last name must be minimum 1 characters' },
											maxLength: { value: 50, errorMessage: 'Last name must be maximum 50 characters' }
										}} 
									/>
								</ContentBox>
							</Col>
						</Row>
						<Button 
							size="lg" 
							color="primary" 
							className="float-right mx-1 mt-3 mb-2 px-5 text-uppercase font-14"
							disabled={
								formDefaultVal.firstName == formFirstName &&
								formDefaultVal.middleName == formMiddleName &&
								formDefaultVal.lastName == formLastName
							}
							onClick={this.handleSubmit}
						>Save</Button>
					</AvForm>
					{ onFetch ? <LoaderCard {...loaderProps} /> : "" }
				</Container>
				{ this.renderModalAlert() }
				{ this.renderModalSuccess() }
			</div>
		)
	}
}

export default connect(state => state, {})(EditProfile)