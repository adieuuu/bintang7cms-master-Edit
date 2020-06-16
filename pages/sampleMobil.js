import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, Col, Row, Button } from 'reactstrap'
import AdvanceTableBox from '../components/tables/advanceTable'
import ModalBox from '../components/cards/modalBoxCard'
import Pagination from '../components/cards/PaginationCard'
import { getListMobil } from '../components/actions'
import LoaderCard from '../components/cards/LoaderCard'

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

class SampleMobil extends React.Component {
    static async getInitialProps({store}) {
        let props = { showHeader: true, showFooter: true, mobilPage: 1, mobilMaxLen: 10 }
        let stores = await store.getState()
        try {
            if(!stores.listMobil) await store.dispatch(getListMobil(props.mobilPage, props.mobilMaxLen))
        } catch (e) {
            props.error = 'Unable to fetch AsyncData on Server'
        }
        return props
    }

    constructor(props) {
        super(props)
        this.state = {
            title: props.companyName,
            subTitle: "Content Management System",
            showHeader: props.showHeader,
            showFooter: props.showFooter,
            headerHeight: props.headerHeight,
            navIsOpen: props.navIsOpen,
            navMinWidth: props.showHeader ? props.navMinWidth : "0px",
            navMaxWidth: props.showHeader ? props.navMaxWidth : "0px",
            mobilPage: props.mobilPage,
            mobilMaxLen: props.mobilMaxLen,
            mobilSortBy: "name",
            mobilSearchKeyword: "",
            mobilOrderBy: "asc",
            mobilFilterOption: { value: "" },
            showZoomImageModal: false,
            zoomImage: null,
            listMobil: props.listMobil,
            totalMobil: props.totalMobil
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            navIsOpen: nextProps.navIsOpen,
            listMobil: nextProps.listMobil,
            totalMobil: nextProps.totalMobil
        })
    }

    onPaginationClick = (page) => {
        const { mobilMaxLen, mobilSortBy, mobilSearchKeyword, mobilOrderBy } = this.state
        this.props.getListMobil(page, mobilMaxLen, mobilSortBy, mobilOrderBy,mobilSearchKeyword)
        this.setState({ mobilPage: page })
    }

    onSortInit = (e) => {
        const target = e.target, value = target.value, pages = 1
        const { mobilMaxLen, mobilOrderBy,mobilSearchKeyword } = this.state
        this.props.getListMobil(pages, mobilMaxLen, value, mobilOrderBy, mobilSearchKeyword)
        this.setState({ mobilPage: pages, mobilSortBy: value })
    }

    onTargetSortInit = (data) => {
        const { mobilMaxLen, mobilSearchKeyword, mobilOrderBy, mobilSortBy } = this.state
        const orders = mobilSortBy != data.id ? 'desc' : mobilOrderBy == 'desc' ? 'asc' : 'desc'
        this.props.getListMobil(1, mobilMaxLen, data.id, orders, mobilSearchKeyword)
        this.setState({ mobilPage: 1, mobilSortBy: data.id, mobilOrderBy: orders })
    }

    onSearchKeyInit = (keywords) => {
        const { mobilPage, mobilMaxLen, mobilSortBy, mobilOrderBy } = this .state
        this.props.getListMobil(mobilPage, mobilMaxLen, mobilSortBy, mobilOrderBy, keywords)
        this.setState({ mobilSearchKeyword: keywords})
    }

    onFilterStatus = (data) => {
        let filterOpt = {value: data}
        const { mobilMaxLen, mobilSearchKeyword } = this.state
        this.props.getListMobil(1, mobilMaxLen, mobilSearchKeyword, filterOpt, "brand")
        this.setState({ mobilPage: 1, mobilFilterOption: filterOpt })
    }

    zoomImage = (data) => this.setState({ showZoomImageModal: true, zoomImage: data })
    closeZoomImage = () => this.setState({ showZoomImageModal: false, zoomImage: "" })

    renderModalZoomImage() {
        const { zoomImage, showZoomImageModal } = this.state
        return (
            <ModalBox
                title={zoomImage ? zoomImage.name : "Mobil"}
                size="lg"
                className="absolute-center"
                bodyClassName="p-0"
                showModal={showZoomImageModal}
                toogleModal={this.closeZoomImage}
                body={(
                    <Container className="p-0" style={{minWidth: "300px", maxWidth: "800px"}}>
                        {
                            zoomImage ?
                            <img  src={zoomImage.picture} width="100%" height="auto" />
                            :
                            <LoaderCard {...tableLoaderProps} />
                        }
                    </Container>
                )}
            >
                <Button color="secondary" className="mr-2 float-right" onClick={this.closeZoomImage}>Close</Button>
            </ModalBox>
        )
    }

    renderStatus = (value) => {
		let newVal = value.toLowerCase()
		switch (newVal) {
			case 'toyota':
				return <strong className="text-danger">TOYOTA</strong>
			case 'nissan':
				return <strong className="text-success">NISSAN</strong>
			case 'daihatsu':
				return <strong className="text-666666">DAIHATSU</strong>
			case 'mitshubisi':
				return <strong className="text-primary">MITSHUBISI</strong>
			}
			return value;
	}

    render() {
        const { showHeader, headerHeight, navIsOpen,
                navMinWidth, navMaxWidth, listMobil, 
                totalMobil, mobilPage, mobilMaxLen,
                mobilSortBy, mobilOrderBy
        } = this.state
        console.log(listMobil)
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
						<Col xs="12">
							<AdvanceTableBox 
                                title="Advance Table"
                                isReponsive={true}
                                tHead={[
                                    { name: "Image" },
                                    { id: "name", name: "Name" },
                                    { id: "qty", name: "Quantity" },
                                    { id: "price", name: "Price" },
                                    { id: "brand", name: "Brand" }
                                ]}
                                listNumber={true}
                                sortItems={[
                                    { id: "name", name: "Name" },
                                    { id: "qty", name: "Quantity" },
                                    { id: "price", name: "Price" },
                                    { id: "brand", name: "Brand" }
                                ]}
                                onSortClick={this.onSortInit}
                                sortValue={mobilSortBy}
                                onTargetSortClick={this.onTargetSortInit}
								orderValue={mobilOrderBy}
                                onKeySearch={this.onSearchKeyInit}
                                onKeySearch={this.onSearchKeyInit}
                                filterItems={[
                                    { id: "brand", name: "brand" }
                                ]}
                                filterStatus={[
                                    { id: "Toyota", name: "TOYOTA" },
                                    { id: "Daihatsu", name: "DAIHATSU" },
                                    { id: "Nissan", name: "NISSAN" },
                                    { id: "Mitshubisi", name: "MITSHUBISI" }
                                ]}
                                onFilterStatus={this.onFilterStatus}
                                noResult={listMobil.length === 0}
                                pagination={
                                    <Pagination 
                                        arialLabel="Pagi navigation"
                                        size="sm"
                                        totalContent={totalMobil}
                                        currentPage={mobilPage}
                                        contentMaxLength={mobilMaxLen}
                                        onClick={this.onPaginationClick}
                                    />
                                }
							>
								{
                                    listMobil.map((data, key) => (
                                        <tr key={key}>
                                            <th scope="row">
                                                {(key + 1) + (mobilPage > 1 ? (mobilPage - 1) * mobilMaxLen : 0)}
                                            </th>
                                            <td>
                                                <Button
                                                    color="transparent"
                                                    className="mx-0 p-0 mb-1 overflow-hidden"
                                                    style={{maxWidth: "150px", maxHeight: "150px"}}
                                                    onClick={() => this.zoomImage(data)}
                                                >
                                                    <img  src={data.picture} width="100px" height="auto" />
                                                </Button>
                                            </td>
                                            <td>{data.name}</td>
                                            <td>{data.qty}</td>
                                            <td>{data.price}</td>
                                            <td className="text-upper">{this.renderStatus(data.brand)}</td>
                                        </tr>
                                    ))
                                }
							</AdvanceTableBox>
						</Col>
					</Row>
                    {this.renderModalZoomImage()}
				</Container>
			</div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getListMobil: bindActionCreators(getListMobil, dispatch)
    }
}

export default connect(state => state, mapDispatchToProps)(SampleMobil)