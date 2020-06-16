import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import Router from 'next/router'
import { Container, Button } from 'reactstrap'
import { AvForm } from 'availity-reactstrap-validation'
// import ModalBox from '../components/cards/modalBoxCard'
import FormInputValidation from '../components/form/validateInputForm'
import LoaderCard from '../components/cards/LoaderCard'
import { regexHtmlTag } from '../components/functions'
import { userLogin } from '../components/actions'
import nextCookie from 'next-cookies'

class Home extends React.Component {
	static async getInitialProps(ctx) {
		let props = { showHeader: false, showFooter: false, pageName: "/" }
		const { token } = nextCookie(ctx)
		try {
			// props.withHeader = false
		} catch (e) {
			props.error = 'Unable to fetch AsyncData on server'
		}
		// return { props }
		return { props, token }
	}

	constructor(props) {
		super(props)
		this.state = {
			email: '',
			password: '',
			licensed: props.cmsLicensed,
			title: props.companyName,
			subTitle: "Content Management System",
			showHeader: props.showHeader,
			onFetch: false,
			showPassword: false
		}
	}

	componentDidMount() {
		if(this.props.token) {
			Router.push('/dashboard')
		}
	}

	handleChange = (e) => {
        const target = e.target, value = target.value, name = target.name;
        this.setState({ [name]: regexHtmlTag(value) })
    }
	handleSubmit = async () => {
		const { email, password, onFetch } = this.state
		if(!onFetch) {
			this.setState({onFetch: true})
			const login = await userLogin(email, password)
			if(login) {
				Router.push('/dashboard')
			} else {
				this.setState(
					{ onFetch: false },
					() => {
						alert("User not existed!")
						window.location.reload()
					}
				)
			}
		}
	}
	toggleShowPassword = () => this.setState({showPassword: !this.state.showPassword})

	render() {
		const { showHeader, headerHeight, licensed, title, subTitle, onFetch, showPassword } = this.state
		if(this.props.token) {
			return (
				<LoaderCard 
                  className="position-fixed d-block"
                  loaderColor="primary"
                  style={{
                    top: 0,
                    left: 0,
                    backgroundColor: "rgba(255,255,255,0.75)",
                    width: "100vw",
                    height: "100vh",
                    zIndex: 1100
                  }}
                />
			)
		}
		return (
			<div role="main" style={{paddingTop: showHeader ? headerHeight : 0}}>
				<Container fluid className="loginBox absolute-center bg-light p-3" style={{maxWidth: "375px"}}>
					<div className="p-3">
						<div className="w-100 text-center">
							<h5 style={{padding: "6px 8px"}} className="text-center bg-danger d-inline-block rounded-circle mb-0">
								<span className="icon-lock font-22 text-white" />
							</h5>
						</div>
						<h4 className="text-center mb-0 mt-2 pt-1">{title}</h4>
						<p className="text-center font-12 mb-3">{subTitle}</p>
						<AvForm onValidSubmit={this.handleSubmit} method="post" autoComplete="off" >
							<FormInputValidation 
								withLabel={true}
								labelName="Email Adress"
								labelClassName="inputLabel position-absolute font-12 text-primary bg-light"
								containerClassName="mb-3"
								formClassName="p-2 bg-light mb-0"
								formStyle={{height: "50px"}}
								formId="yourEmail" 
								formType="email" 
								formName="email" 
								formPlaceholder="Your email address" 
								formErrorMessage="Invalid email address" 
								onChange={this.handleChange} 
								formValidate={{
									required: { value: true, errorMessage: 'Email cannot be empty' },
									email: true
								}} 
								formReadOnly={onFetch ? true : false}
							/>
							<div className="position-relative pr-5">
								<FormInputValidation 
									withLabel={true}
									labelName="Password"
									labelClassName="inputLabel position-absolute font-12 text-primary bg-light"
									containerClassName="mb-3"
									formClassName="p-2 bg-light mb-0"
									formStyle={{height: "50px"}}
									formId="yourPassword" 
									formType={showPassword ? "text" : "password"} 
									formName="password" 
									formPlaceholder="Your password" 
									formErrorMessage="Invalid password" 
									onChange={this.handleChange} 
									formValidate={{
										required: { value: true, errorMessage: 'Password cannot be empty' }
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
							{
								!onFetch ?
									<Button block color="primary" type="submit" className="mt-4 mb-3 text-uppercase font-12">Sign in</Button>
									:
									<Button block color="primary" className="mt-4 mb-3 text-uppercase font-12">
										<LoaderCard 
											className="position-relative d-block w-100 text-center"
											style={{height: "100%", padding: "9px 0"}}
											height="100%" 
											loaderColor="light" 
											loaderSize="sm" 
										/>
									</Button>
							}
							<Link href="/resetPassword" as="/reset">
								<a style={{width: "120px"}} className="m-auto mt-2 d-block text-center text-primary font-12">Forgot password?</a>
							</Link>
						</AvForm>
						<div className="text-center text-secondary mt-4">
							<p className="font-12 mb-0" dangerouslySetInnerHTML={{__html: licensed}} />
						</div>
					</div>
				</Container>
			</div>
		)
	}
}

export default connect(state => state, {})(Home)