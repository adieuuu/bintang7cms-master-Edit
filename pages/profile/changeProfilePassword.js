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
import { auth, logout, changeMyPassword } from '../../components/actions'

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

class ChangeProfilePassword extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, 
			pageName: "/change-profile-password", token: token,
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
			
			formPassword: "",
			formNewPassword: "",
			formConfirmNewPassword: "",

			showSuccessModal: false,
			showAlertModal: false, 
			alertModalMessage: ""
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen
		})
	}

	handleChange = (e) => {
		const target = e.target, value = regexHtmlTag(target.value), name = target.name
		this.setState({ [name]: value })
	}

	handleSubmit = () => {
		const { onFetch, formPassword, formNewPassword, formConfirmNewPassword } = this.state
		let isValid = formPassword != formNewPassword && formNewPassword == formConfirmNewPassword && !onFetch
		if(isValid) {
			let datas = {
				password: formPassword,
				new_password: formNewPassword
			}
			this.setState(
				{ onFetch: true },
				async () => {
					const resp = await changeMyPassword(datas, JSON.stringify(this.props.token))
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
				title={(<div>Change Password</div>)}
				size="lg"
				className="absolute-center" 
				showModal={showSuccessModal} 
				body={(<div style={{maxWidth: 310}}>Password successfully changed, please re-Login to prevent security issue.</div>)}
			>
				<Button color="success" className="mr-2 float-right" onClick={logout}>Close</Button>
			</ModalBox>
		)
	}

	render() {
		const { showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, formPassword, formNewPassword, formConfirmNewPassword, onFetch } = this.state
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
					<AvForm onValidSubmit={this.handleSubmit} method="post" autoComplete="off" className="absolute-top-center" style={{minWidth: "300px", maxWidth: "600px"}} >
						<Row>
							<Col lg="12" className="mt-5 mb-4 text-center">
								<h1 className="text-primary mb-2">Change Password</h1>
							</Col>
							<Col lg="12">
								<ContentBox title="Current Password" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
									<FormInputValidation 
										formClassName="py-4 px-2 bg-white mb-2"
										formId="yourFormPassword" 
										formType="password" 
										formName="formPassword" 
										formPlaceholder="Your Current Password" 
										formErrorMessage="Password cannot be empty" 
										onChange={this.handleChange} 
										formValue={formPassword}
										formValidate={{
											required: { value: true, errorMessage: 'Password cannot be empty' },
											minLength: { value: 6, errorMessage: 'Password must be minimum 6 characters' },
											maxLength: { value: 16, errorMessage: 'Password must be maximum 16 characters' }
										}} 
									/>
								</ContentBox>
							</Col>
							<Col lg="12">
								<ContentBox title="New Password" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
									<FormInputValidation 
										formClassName="py-4 px-2 bg-white mb-2"
										formId="yourFormNewPassword" 
										formType="password" 
										formName="formNewPassword" 
										formPlaceholder="Your New Password" 
										formErrorMessage="Password cannot be empty" 
										onChange={this.handleChange} 
										formValue={formNewPassword}
										formValidate={{
											required: { value: true, errorMessage: 'Password cannot be empty' },
											minLength: { value: 6, errorMessage: 'Password must be minimum 6 characters' },
											maxLength: { value: 16, errorMessage: 'Password must be maximum 16 characters' }
										}} 
									/>
								</ContentBox>
							</Col>
							<Col lg="12">
								<ContentBox title="Retype New Password" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
									<FormInputValidation 
										formClassName="py-4 px-2 bg-white mb-2"
										formId="yourFormConfirmNewPassword" 
										formType="password" 
										formName="formConfirmNewPassword" 
										formPlaceholder="Retype Your New Password" 
										formErrorMessage="Password cannot be empty" 
										onChange={this.handleChange} 
										formValue={formConfirmNewPassword}
										formValidate={{
											required: { value: true, errorMessage: 'Password cannot be empty' },
											minLength: { 
												value: formConfirmNewPassword == formNewPassword ? formNewPassword.length : formConfirmNewPassword.length + 1, 
												errorMessage: 'Your password and confirmation password do not match.' 
											}
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
								formPassword.length < 6 ||
								formPassword == formNewPassword ||
								formNewPassword.length < 6 ||
								formConfirmNewPassword.length !== formNewPassword.length ||
								formConfirmNewPassword !== formNewPassword
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

export default connect(state => state, {})(ChangeProfilePassword)