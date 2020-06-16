import React from 'react'
import Link from 'next/link'
import { Container, Row, Col, Button } from 'reactstrap'
import { AvForm } from 'availity-reactstrap-validation'
import ModalBox from '../components/cards/modalBoxCard'
import FormInputValidation from '../components/form/validateInputForm'
import LoaderCard from '../components/cards/LoaderCard'
import { forgotPassword } from '../components/actions'
import { regexHtmlTag } from '../components/functions'

export default class ResetPassword extends React.Component {
	static async getInitialProps() {
		let props = { showHeader: false, showFooter: false, pageName: "/reset-password" }
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
			title: "Forgot password?",
			showHeader: props.showHeader,
			onFetch: false,
			formEmailAddress: "",
			showAlertModal: false, 
			alertModalMessage: "",
			showSuccessModal: false, 
			successModalMessage: ""
		}
	}

	handleChange = (e) => {
		const target = e.target, value = target.value, name = target.name
		this.setState({ [name]: regexHtmlTag(value) })
	}

	handleSubmit = () => {
		const { formEmailAddress, onFetch } = this.state
		if(!onFetch) {
			this.setState(
				{ onFetch: true },
				async () => {
					let datas = { email: formEmailAddress }
					const resp = await forgotPassword(datas)
					if(resp.status) {
						this.setState({onFetch: false, showSuccessModal: true, successModalMessage: resp.message})
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
					<a className="btn btn-primary mr-2 float-right" onClick={() => this.setState({formEmailAddress: ""})}>Close</a>
				</Link>
			</ModalBox>
		)
	}
	
	render() {
		const { showHeader, headerHeight, licensed, title, onFetch, formEmailAddress } = this.state
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
						<FormInputValidation 
							withLabel={true}
							labelName="Email Address"
							labelClassName="inputLabel position-absolute font-12 text-primary bg-light"
							containerClassName="mb-3"
							formClassName="p-2 bg-light mb-0"
							formId="yourFormEmailAddress" 
							formType="email" 
							formName="formEmailAddress" 
							formValue={formEmailAddress}
							formPlaceholder="Your email address" 
							formErrorMessage="Invalid email address" 
							onChange={this.handleChange} 
							formValidate={{
								required: { value: true, errorMessage: "Email address not registered!" },
								email: true
							}} 
						/>
						<Row>
							<Col xs="6" className="pr-1">
								<Button block color="danger" className="mb-0 text-uppercase font-12" disabled={onFetch}>
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
											/> : "Reset"
									}
									
								</Button>
							</Col>
							<Col xs="6" className="pl-1">
								<Link href="/">
									<a className="btn btn-primary btn-block my-0 text-uppercase font-12">Cancel</a>
								</Link>
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