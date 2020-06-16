import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import { Container, Row, Col, FormText, Button } from 'reactstrap'
import { AvForm } from 'availity-reactstrap-validation'
import ContentBox from '../../components/contentBox'
import FormInput from '../../components/form/inputForm'
import FormInputValidation from '../../components/form/validateInputForm'
import LoaderCard from '../../components/cards/LoaderCard'
import ModalBox from '../../components/cards/modalBoxCard'
import { regexHtmlTag, numberWithDot } from '../../components/functions' 
import { auth, getFactorySettings, saveFactorySettings } from '../../components/actions'

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

class MasterSettings extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/master-settings", token: token 
		}
		try {
			await store.dispatch(getFactorySettings(token))
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
			showAlertModal: false, 
			alertModalMessage: "",
			onFetch: false,
			formProductCredits: props.factorySettings.point,
			formAdminFee: props.factorySettings.admin_fee,
			formMaxPoin: props.factorySettings.max_credit,
			formNotifEmail: props.factorySettings.email
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			formProductCredits: nextProps.factorySettings.point,
			formAdminFee: nextProps.factorySettings.admin_fee,
			formMaxPoin: nextProps.factorySettings.max_credit,
			formNotifEmail: nextProps.factorySettings.email
		})
	}

	handleChange = (e) => {
		const target = e.target, value = regexHtmlTag(target.value), name = target.name
		this.setState({ [name]: value })
	}

	handleSubmit = () => {
		const { onFetch, formProductCredits, formAdminFee, formMaxPoin, formNotifEmail } = this.state
		if(!onFetch) {
			let datas = {
				point: formProductCredits,
				max_credit: formMaxPoin,
				email: formNotifEmail,
				admin_fee: formAdminFee
			}
			this.setState(
				{ onFetch: true },
				async () => {
					const { saveFactorySettings, factorySettings, token } = this.props
					const resp = await saveFactorySettings(factorySettings.id, datas, JSON.stringify(token))
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
					<div style={{minWidth: 310}}>{alertModalMessage}</div>
				)}
			>
				<Button color="secondary" className="mr-2 float-right" onClick={() => this.setState({showAlertModal: false})}>Close</Button>
			</ModalBox>
		)
	}

	render() {
		const { 
			showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, onFetch, formProductCredits, formAdminFee, formMaxPoin, formNotifEmail
		} = this.state
		const { point, max_credit, email, admin_fee } = this.props.factorySettings
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
								<h1 className="text-primary mb-2">Settings</h1>
							</Col>
							<Col lg="12">
								<ContentBox title="Product Credits" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
									<FormInput 
										formClassName="py-4 px-2 bg-white mb-2"
										formId="yourFormProductCredits" 
										formType="number" 
										formName="formProductCredits"
										formPlaceholder="Product Credits" 
										formValue={formProductCredits}
										onChange={this.handleChange} 
									/>
								</ContentBox>
							</Col>
							<Col lg="12">
								<ContentBox title="Admin Fee" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
									<FormInput 
										formClassName="py-4 px-2 bg-white mb-2"
										formId="yourFormAdminFee" 
										formType="number" 
										formName="formAdminFee"
										formPlaceholder="Admin Fee" 
										formValue={formAdminFee}
										onChange={this.handleChange} 
									/>
									<FormText>Admin Fee: <b>IDR {numberWithDot(formAdminFee)}</b></FormText>
								</ContentBox>
							</Col>
							<Col lg="12">
								<ContentBox title="Maximum Daily Point Cap" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
									<FormInput 
										formClassName="py-4 px-2 bg-white mb-2"
										formId="yourFormMaxPoin" 
										formType="number" 
										formName="formMaxPoin"
										formPlaceholder="Maximum Point" 
										formValue={formMaxPoin}
										onChange={this.handleChange} 
									/>
								</ContentBox>
							</Col>
							<Col lg="12">
								<ContentBox title="Point Notification Email Address" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
									<FormInputValidation 
										formClassName="py-4 px-2 bg-white mb-2"
										formId="yourFormNotifEmail" 
										formType="email" 
										formName="formNotifEmail" 
										formPlaceholder="Email Address" 
										formErrorMessage="Invalid email address" 
										onChange={this.handleChange} 
										formValue={formNotifEmail}
										formValidate={{
											required: { value: true, errorMessage: 'Please input a valid email address!' },
											email: true
										}} 
									/>
								</ContentBox>
							</Col>
						</Row>
						<Button 
							size="lg" 
							color="primary" 
							type="submit" 
							className="float-right mx-1 mt-3 mb-2 px-5 text-uppercase font-14"
							disabled={
								Number(formProductCredits) !== point || 
								Number(formAdminFee) !== admin_fee || 
								Number(formMaxPoin) !== max_credit || 
								formNotifEmail != email ? false : true
							}
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
		getFactorySettings: bindActionCreators(getFactorySettings, dispatch),
		saveFactorySettings: bindActionCreators(saveFactorySettings, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(MasterSettings)