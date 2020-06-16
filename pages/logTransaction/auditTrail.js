import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import nextCookie from 'next-cookies'
import { Container, Row, Col } from 'reactstrap'
// import ModalBox from '../../components/cards/modalBoxCard'
import AdvanceTableBox from '../../components/tables/advanceTable'
import Pagination from '../../components/cards/PaginationCard'
import { auth, getLogTrail } from '../../components/actions'

class AuditTrail extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		const { token } = nextCookie(ctx)
		let props = { 
			showHeader: true, showFooter: true, pageName: "/audit-trail", 
			listPage: 1, listMaxLen: 10, listSortBy: "number", listOrderBy: "desc", keyword: "", token: token 
		}
		try {
			await store.dispatch(getLogTrail(props.listPage, props.listMaxLen, props.listSortBy, props.listOrderBy, token, props.keyword))
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
			fetchPage: props.listPage,
			fetchLen: props.listMaxLen,
			fetchSortBy: props.listSortBy,
			fetchOrderBy: props.listOrderBy,
			fetchKeyword: props.keyword,
			onFetch: false,
			audit_trail: props.auditTrail,
			// showEditor: false,
			// titleTnC: null,
			// content: null
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			audit_trail: nextProps.auditTrail
		})
	}

	onPaginationClick = (page) => {

	}

	render() {
		const { 
			showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth, 
			audit_trail, fetchPage, fetchLen, fetchOrderBy, fetchSortBy 
		} = this.state
            
        console.log("Audit Trail", audit_trail)
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
					<Col lg="12" className="mb-2"><h1 className="text-primary">Audit Trail</h1></Col>
					<Col xs="12">
                    <AdvanceTableBox 
						isResponsive={true} 
						tHead={[
							{ id: "userid", name: "USER ID" },
							{ id: "date", name: "Date Transaction" },
							{ id: "activity", name: "Activity" },
							{ id: "out", name: "Out" },
							{ id: "in", name: "In" },
							{ id: "balance", name: "Balance" }
						]}
						listNumber={true}
						noResult={audit_trail.length === 0}
						pagination={
							<Pagination 
								ariaLabel="Page navigation"
								size="sm"
								onClick={this.onPaginationClick}
								totalContent={audit_trail.total_elements}
								currentPage={fetchPage}
								contentMaxLength={fetchLen}
							/>
						}
					>
						{
							audit_trail.map((audit, key) => (
								<tr key={key}>
									<th scope="row" className="pt-2">{key+1}</th>
									<td className="pt-2">{audit.user.id} </td>
									<td className="pt-2">{audit.date}</td>
									<td className="pt-2">{audit.activity}</td>
									<td className="pt-2">{audit.out}</td>
									<td className="pt-2">{audit.in}</td>
									<td className="pt-2">{audit.balance}</td>
									{/* <td className="font-20 pt-2">{data.isPublished ? <i className="icon icon-check text-success ml-1" /> : <i className="icon icon-x text-danger ml-1" />}</td> */}
									{/* <td className="pt-2">
										<div className="d-flex w-100">
											
											<Button 
												color="warning" 
												size="sm" 
												className="mr-1 mb-1" 
												onClick={() => data.isPublished ? this.editConfirmModal(data.id) : this.editModal(data.id)}
											><i className="icon icon-edit-3"/></Button>
											<Button color="danger" size="sm" className="mb-1" onClick={() => this.deleteConfirmModal(data.id)}><i className="icon icon-trash-2"/></Button>
										</div>
									</td> */}
								</tr>
							))
						}
					</AdvanceTableBox>
					</Col>
					</Row>
					
					
				</Container>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getLogTrail: bindActionCreators(getLogTrail, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(AuditTrail)