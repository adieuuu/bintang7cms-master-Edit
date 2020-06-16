import React from 'react'
import Link from 'next/link'
import { Container, Row, Col, Button } from 'reactstrap'
import { AvForm } from 'availity-reactstrap-validation'
import ModalBox from '../components/cards/modalBoxCard'
import FormInputValidation from '../components/form/validateInputForm'
import LoaderCard from '../components/cards/LoaderCard'
import { changePasswordRequest } from '../components/actions'
import { regexHtmlTag } from '../components/functions'

export default class ChangePassword extends React.Component {
	static async getInitialProps(ctx) {
		const { query } = ctx
		let props = { 
			showHeader: false, showFooter: false, pageName: "/change",
			reset_id: query.id, reset_email: query.email 
		}
		try {
			// props.withHeader = false
		} catch (e) {
			props.error = 'Unable to fetch AsyncData on server'
		}
		return props
	}

	constructor(props) {
		super(props)
		this.state = {
			licensed: props.cmsLicensed,
			title: "Reset password",
			showHeader: props.showHeader,
			onFetch: false,
			formResetId: props.reset_id,
			formEmailAddress: props.reset_email,
			formNewPassword: "",
			formConfirmPassword: "",
			
			showAlertModal: false, 
			alertModalMessage: "",
			showSuccessModal: false, 
			successModalMessage: "",
			showPassword: false
		}
	}

	handleChange = (e) => {
		const target = e.target, value = target.value, name = target.name
		this.setState({ [name]: regexHtmlTag(value) })
	}

	handleSubmit = () => {
		const { formEmailAddress, formResetId, formNewPassword, onFetch } = this.state
		let isEmail = formNewPassword == formEmailAddress
		let isAllowed = !onFetch && !isEmail
		if(isAllowed) {
			this.setState(
				{ onFetch: true },
				async () => {
					let datas = { password: formNewPassword }
					const resp = await changePasswordRequest(formResetId, formEmailAddress, datas)
					if(resp.status) {
						this.setState({onFetch: false, showSuccessModal: true, successModalMessage: resp.message})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}
	 
	toggleShowPassword = () => this.setState({showPassword: !this.state.showPassword})
	toggleShowConfirmPassword = () => this.setState({showConfirmPassword: !this.state.showConfirmPassword})

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

	renderModalSuccess() {
		const { showSuccessModal, successModalMessage } = this.state
		return (
			<ModalBox
				title={(<div>Reset Password Success</div>)}
				size="lg"
				className="absolute-center" 
				showModal={showSuccessModal} 
				body={(
					<div style={{minWidth: 310}}>{successModalMessage}</div>
				)}
			>
				<Link href="/">
					<a className="btn btn-primary mr-2 float-right" onClick={() => this.setState({showSuccessModal: false, successModalMessage: "", formEmailAddress: ""})}>Close</a>
				</Link>
			</ModalBox>
		)
	}
	
	render() {
		const { showHeader, headerHeight, licensed, title, onFetch, formEmailAddress, formNewPassword, formConfirmPassword, showPassword } = this.state
		return (
			<div role="main" style={{paddingTop: showHeader ? headerHeight : 0}}>
				<Container fluid className="loginBox absolute-center bg-light p-3" style={{maxWidth: "375px"}}>
					<div className="w-100 text-center">
						<h5 style={{padding: "6px 8px"}} className="text-center bg-danger d-inline-block rounded-circle mb-0">
							<span className="icon-lock font-22 text-white" />
						</h5>
					</div>
					<h5 className="text-center mb-3 mt-2 pt-1">{title}</h5>
					<AvForm onValidSubmit={this.handleSubmit} method="post" autoComplete="off" >
						<div className="position-relative pr-5">
							<FormInputValidation 
								withLabel={true}
								labelName="New Password"
								labelClassName="inputLabel position-absolute font-12 text-primary bg-light"
								containerClassName="mb-3"
								formClassName="p-2 bg-light mb-0"
								formStyle={{height: "50px"}}
								formId="yourFormNewPassword" 
								formValue={formNewPassword}
								formType={showPassword ? "text" : "password"} 
								formName="formNewPassword" 
								formPlaceholder="Your new password" 
								formErrorMessage="Invalid password" 
								onChange={this.handleChange} 
								formValidate={{
									required: { value: true, errorMessage: 'Password cannot be empty' },
									minLength: { value: 6, errorMessage: 'Password must be minimum 6 characters' },
									maxLength: { value: 16, errorMessage: 'Password must be maximum 16 characters' }
								}} 
								formReadOnly={onFetch ? true : false}
							/>
							<div 
								className="absolute-top-right font-24 text-666666 pt-1 mt-3 mr-1 cursor-pointer"
								onClick={this.toggleShowPassword}
							>
								<i className={`icon ${showPassword ? 'icon-eye' : 'icon-eye-off'}`} />
							</div>
						</div>
						<div className="position-relative">
							<FormInputValidation 
								withLabel={true}
								labelName="Confirm Password"
								labelClassName="inputLabel position-absolute font-12 text-primary bg-light"
								containerClassName="mb-3"
								formClassName="p-2 bg-light mb-0"
								formStyle={{height: "50px"}}
								formId="yourFormConfirmPassword" 
								formType="password"
								formValue={formConfirmPassword}
								formName="formConfirmPassword" 
								formPlaceholder="Your confirm password" 
								formErrorMessage="Invalid password" 
								onChange={this.handleChange} 
								formValidate={{
									required: { value: true, errorMessage: 'Password cannot be empty' },
									minLength: { 
										value: formConfirmPassword == formNewPassword ? formNewPassword.length : formConfirmPassword.length + 1, 
										errorMessage: 'Your password and confirmation password do not match.' 
									}
								}} 
								formReadOnly={onFetch ? true : false}
							/>
						</div>
						<Row>
							<Col lg="12" className="pr-1">
								<Button block color="primary" className="mb-0 text-uppercase font-12" disabled={onFetch}>
									{
										onFetch ?
											<LoaderCard 
												className="position-relative d-block w-100 text-center"
												style={{
													height: "100%",
													padding: "9px 0"
												}}
												height="100%" 
												loaderColor="light" 
												loaderSize="sm" 
											/> : "Submit Change"
									}
									
								</Button>
							</Col>
						</Row>
					</AvForm>
					<div className="p-3">
						<div className="text-center text-secondary mt-4">
							<p className="font-12 mb-0" dangerouslySetInnerHTML={{__html: licensed}} />
						</div>
					</div>
				</Container>
				{ this.renderModalAlert() }
				{ this.renderModalSuccess() }
			</div>
		)
	}
}