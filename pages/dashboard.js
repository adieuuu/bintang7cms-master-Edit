import React from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, Row, Col } from 'reactstrap'
import AdvanceTableBox from '../components/tables/advanceTable'
import SimpleTableBox from '../components/tables/simpleTable'
import Pagination from '../components/cards/PaginationCard'
import SimpleReportCard from '../components/cards/SimpleReportCard'
import { getListTransaction, auth } from '../components/actions'
import { timestampToDateTime, numberToCurrency, numberWithDot, addDays } from '../components/functions'

class Dashboard extends React.Component {
	static async getInitialProps(ctx) {
		auth(ctx)
		const { store } = ctx
		let props = { showHeader: true, showFooter: true, transanctionPage: 0, transactionMaxLen: 10, pageName: "/dashboard" }
		let stores = await store.getState()
		try {
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
			transactionPage: props.transanctionPage,
			transactionFetchLen: props.transactionMaxLen,
			transactionDateFrom: undefined,
			transactionDateTo: undefined,
			transactionSortBy: "date",
			transactionSearchKey: "",
			listTransaction: props.listTransaction,
			totalTransaction: props.totalTransaction,
			dailyProfit: props.dailyProfit
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			navIsOpen: nextProps.navIsOpen,
			listTransaction: nextProps.listTransaction,
			totalTransaction: nextProps.totalTransaction,
			lineChart: nextProps.lineChart
		})
	}

	onPaginationClick = (page) => {
		const { transactionFetchLen, transactionDateFrom, transactionDateTo, transactionSortBy, transactionSearchKey } = this.state
		this.props.getListTransaction(page, transactionFetchLen, transactionDateFrom, transactionDateTo, transactionSortBy, transactionSearchKey)
		this.setState({transactionPage: page})
	}

	onFilterInit = (dateFrom, dateTo) => {
		const { transactionFetchLen, transactionSortBy, transactionSearchKey } = this.state
		this.props.getListTransaction(0, transactionFetchLen, dateFrom, dateTo, transactionSortBy, transactionSearchKey)
		this.setState({transactionPage: 0, transactionDateFrom: dateFrom, transactionDateTo: dateTo})
	}

	onSortInit = (e) => {
		const target = e.target, value = target.value
		const { transactionFetchLen, transactionDateFrom, transactionDateTo, transactionSearchKey } = this.state
		this.props.getListTransaction(0, transactionFetchLen, transactionDateFrom, transactionDateTo, value, transactionSearchKey)
		this.setState({transactionPage: 0, transactionSortBy: value})
	}

	onSearchKeyword = (keywords) => {
		const { transactionPage, transactionFetchLen, transactionDateFrom, transactionDateTo, transactionSortBy } = this.state
		this.props.getListTransaction(transactionPage, transactionFetchLen, transactionDateFrom, transactionDateTo, transactionSortBy, keywords)
		this.setState({transactionSearchKey: keywords})
	}

	render() {
		const { 
			showHeader, headerHeight, navIsOpen, navMinWidth, navMaxWidth
		} = this.state
		console.log(this.props.user)
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
						<Col xs="12" md="4">
							Welcome to Dashboard
						</Col>
					</Row>
				</Container>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		// getListTransaction: bindActionCreators(getListTransaction, dispatch)
	}
}
export default connect(state => state, mapDispatchToProps)(Dashboard)