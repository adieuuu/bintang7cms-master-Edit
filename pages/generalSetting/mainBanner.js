import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import { Container, Row, Col, Button } from 'reactstrap'
import ContentBox from '../../components/contentBox'
import ModalBox from '../../components/cards/modalBoxCard'
import LoaderCard from '../../components/cards/LoaderCard'
import { auth, getSingleLinkBanner, putSingleLinkBanner } from '../../components/actions'
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

class MainBanner extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { showHeader: true, showFooter: true, pageName: "/main-banner", token: token }
		try {
            await store.dispatch(getSingleLinkBanner(token))
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
			_main_banner: props.singleLink_banner[0],
			formMainBanner: props.singleLink_banner[0].url,
			showAlertModal: false, 
			alertModalMessage: ""
        }
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			_main_banner: nextProps.singleLink_banner[0]
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
		if(!this.state.onFetch) {
			let files = e.target.files
			this.setState(
				{ onFetch: true },
				async () => {
					for(var i = 0; i < files.length; i++) {
						let reader = new FileReader()
						try {
							reader.onload = (e) => this.setState({ formMainBanner:  e.target.result })
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

	// START METHOD 
	cancelChange = () => this.setState({formMainBanner: this.state._main_banner.url})
	submitChange = () => {
		const { onFetch, formMainBanner } = this.state
		if(!onFetch) {
			const datas = [{ type: "single_banner_image", url: formMainBanner }]
			this.setState(
				{ onFetch: true },
				async () => {
					const { putSingleLinkBanner, token } = this.props
					const resp = await putSingleLinkBanner(datas, JSON.stringify(token))
					if(resp.status) {
						this.setState({onFetch: false, formMainBanner: resp.data[0].url})
					} else {
						this.setState({onFetch: false, showAlertModal: true, alertModalMessage: resp.message})
					}
				}
			)
		}
	}
	// END METHOD
	
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
		const { showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, _main_banner, formMainBanner, onFetch } = this.state
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
					<Row className="absolute-top-center" style={{minWidth: "300px", maxWidth: "800px"}}>
						<Col lg="12" className="mt-5 mb-4 text-center">
							<h1 className="text-primary mb-2">Main Banner</h1>
						</Col>
						<Col lg="12">
							{ 
								formMainBanner ? 
									<ContentBox title="Preview" className="py-2 px-1 mb-2 overflow-auto" titleClass="font-16 text-primary mb-1">
										<div className="p-2 border border-grey mb-2 d-inline-block">
											<img width="100%" height="auto" src={formMainBanner}/>
										</div>
									</ContentBox> : "" 
							}
						</Col>
						<Col lg="12">
							<div id="box-img" className="dropzone-wrapper mt-2">
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
						<Col lg="12">
						{
							!onFetch && _main_banner.url != formMainBanner ?
								<Button 
									size="lg" 
									color="secondary" 
									className="float-right mx-1 mt-3 mb-2 px-3 text-uppercase font-14"
									onClick={this.cancelChange}
								>Cancel</Button> : ""
						}
						<Button 
							size="lg" 
							color="primary" 
							className="float-right mx-1 mt-3 mb-2 px-5 text-uppercase font-14"
							disabled={!onFetch && _main_banner.url != formMainBanner ? false : true}
							onClick={this.submitChange}
						>Save</Button>
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
						</Col>
					</Row>
				</Container>
				{ this.renderModalAlert() }
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getSingleLinkBanner: bindActionCreators(getSingleLinkBanner, dispatch),
		putSingleLinkBanner: bindActionCreators(putSingleLinkBanner, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(MainBanner)