import { useState } from 'react'
import { Table, Row, Col, Button } from 'reactstrap'
import DatePicker from 'react-datepicker'
import FormSelect from '../form/selectForm'
import FormInput from '../form/inputForm'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { 
    addDays, timestampToDateTime, timestampToDate, 
    capitalizeString, removeAllWhiteSpaces 
} from '../functions'

import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
pdfMake.vfs = pdfFonts.pdfMake.vfs

export default (props) => {
    const { 
        title, tHead, listNumber, children, pagination, noResult, orderValue,
        onFilterDate, onKeySearch, searchCategory, searchValue, exportTitle, isResponsive, 
        onTargetSortClick, sortItems, sortValue, onSortClick, maxRangeDateFilter, onExport, 
        filterItems, onFilterReset, filterStatus, onFilterStatus
    } = props
    const [startDate, setStartDate] = useState(addDays(new Date().getTime(), -1))
    const [endDate, setEndDate] = useState(new Date())
    const [inputs, setInputs] = useState({keywords: ""})
    const [saveType, setSaveType] = useState({typeFile: undefined})
    const [filterType, setFilterType] = useState({typeFilter: undefined})
    const [statusType, setStatusType] = useState({typeStatus: undefined})
    const saveTypeOption = [{ id: 1, name: "EXCEL" }, { id: 2, name: "PDF"}]
    const handleExportSelect = (e) => {
        e.persist()
        setSaveType(() => ({typeFile: e.target.value}))
    }
    const handleFilterSelect = (e) => {
        e.persist()
        setFilterType(() => ({typeFilter: e.target.value}))
    }
    const handleSearchKeyword = (e) => {
        e.persist()
        setInputs(inputs => ({...inputs, keywords: e.target.value}))
    }
    const handleEnterKeySearch = (e) => {
        if(e.charCode === 13) {
            onKeySearch(inputs.keywords)
        }
    }
    const handleResetFilter = () => {
        setFilterType(() => ({typeFilter: ""}))
        setStatusType(() => ({typeStatus: ""}))
        onFilterReset()
    }
    const handleFilterStatusSelect = (e) => {
        e.persist()
        setStatusType(() => ({typeStatus: e.target.value}))
    }

    // Excel Scope
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    const initCreateExcel = async () => {
        const datas = await onExport(startDate.getTime(), endDate.getTime(), sortValue, inputs.keywords)
        let exportedDatas = []
        for (let i in datas) {
            exportedDatas.push({
                "Item Name": datas[i].name,     
                "QTY": datas[i].qty,
                "Item Price": datas[i].price, 
                "Total Price": datas[i].total, 
                "Buy Date": timestampToDateTime(datas[i].date)
            })
        }
        const ws = XLSX.utils.json_to_sheet(exportedDatas)
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
        const xlsBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const xlsData = new Blob([xlsBuffer], {type: fileType})
        FileSaver.saveAs(xlsData, `${removeAllWhiteSpaces(exportTitle)+new Date().getTime()}.xlsx`)
    }

    // PDF Scope
    const initCreatePdf = async () => { 
        const datas = await onExport(startDate.getTime(), endDate.getTime(), sortValue, inputs.keywords)
        let tbhData = [], tbdData = []
        for (let i in tHead) { tbhData.push([{ text: tHead[i], bold: true }]) }
        for (let i in datas) {
            tbdData.push([
                datas[i].name, 
                datas[i].qty, 
                datas[i].price, 
                datas[i].total, 
                timestampToDateTime(datas[i].date)
            ])
        }
        const docDefinition = { 
            content: [
                { text: `${exportTitle}\n\n`, bold: true, fontSize: 15 },
		        { text: `${inputs.keywords.length > 0 ? `Keywords: ${inputs.keywords}\n` : ''}`, fontSize: 12 },
                { text: `From: ${timestampToDate(startDate.getTime())}\n`, fontSize: 12 },
                { text: `To: ${timestampToDate(endDate.getTime())}\n`, fontSize: 12 },
                { text: `Sort By: ${capitalizeString(sortValue)}\n\n\n`, fontSize: 12 },
                { style: 'table table-sm', table: { body: [ tbhData, ...tbdData ] } }
            ] 
        }
        pdfMake.createPdf(docDefinition).download(removeAllWhiteSpaces(exportTitle)+new Date().getTime()+'.pdf')
    }
    return (
        <div className="bg-white rounded shadow-sm p-3 mb-3 overflow-visible">
            {title ? <h5 className="font-16 text-primary mb-3">{title}</h5> : ""}
            <Row className={onKeySearch || onFilterDate || exportTitle || onSortClick ? "pb-2" : ""}>
                {
                    onKeySearch ?
                        <Col xs="12" md={`${onFilterDate ? "4" : "6"}`} className="pt-3">
                            <div className="d-flex justify-content-start w-100">  
                                <FormInput 
                                    containerClassName="w-100"
                                    formClassName="px-2 bg-white mb-0"
                                    formId="yourFormFilterKeywords" 
                                    formType="text" 
                                    formName="keywords"
                                    formPlaceholder={`Search ${searchCategory ? searchCategory.join(', ') : "Keywords"}`}
                                    formValue={searchValue ? searchValue : inputs.keywords}
                                    formSize="sm"
                                    onChange={handleSearchKeyword} 
                                    onKeyPress={handleEnterKeySearch}
                                />
                                <Button size="md" color="primary" onClick={() => onKeySearch(inputs.keywords)} className="mb-3 ml-2 px-2 font-12 text-uppercase" style={{marginTop: "5px"}}>Search</Button>
                            </div>
                        </Col> : ""
                }
                {
                    onFilterDate ?
                        <Col xs="12" md="8" className="pt-3">
                            <Row>
                                <Col sm="12" lg="4" className="pt-2">
                                    <FormSelect
                                        containerClassName="w-100 p-0"
                                        formId="yourFormFilterBy" 
                                        formName="FormFilterBy" 
                                        formSize="sm"
                                        formPlaceholder="Filter By"
                                        formOptionData={filterItems}
                                        formValue={filterType.typeFilter}
                                        onChange={handleFilterSelect}
                                    />
                                </Col>
                                <Col sm="12" lg="4" className="pt-2">
                                    {
                                        filterType.typeFilter == "status" && onFilterStatus ?
                                            <FormSelect
                                                containerClassName="w-100 p-0"
                                                formId="yourFormFilterStatusBy" 
                                                formName="FormFilterStatusBy" 
                                                formSize="sm"
                                                formPlaceholder="Choose status..."
                                                formOptionData={filterStatus}
                                                formValue={statusType.typeStatus}
                                                onChange={handleFilterStatusSelect}
                                            />
                                            :
                                            <div className="d-flex justify-content-start w-100">
                                                <div className="mr-2 w-50">
                                                    <DatePicker
                                                        selected={startDate}
                                                        selectsStart
                                                        onChange={date => setStartDate(date)}
                                                        startDate={startDate}
                                                        dateFormat="yyyy/MM/dd"
                                                        className="px-2 bg-white mb-0 form-control-sm form-control text-center"
                                                    />
                                                </div>
                                                <div className="w-50">
                                                    <DatePicker
                                                        selected={endDate}
                                                        onChange={date => setEndDate(date)}
                                                        minDate={startDate}
                                                        selectsEnd
                                                        maxDate={addDays(new Date(startDate), maxRangeDateFilter)}
                                                        startDate={startDate}
                                                        dateFormat="yyyy/MM/dd"
                                                        className="px-2 bg-white mb-0 form-control-sm form-control text-center"
                                                    />
                                                </div>
                                            </div>
                                    }
                                </Col>
                                <Col sm="12" lg="4" className="pt-2">
                                    <div className="d-flex justify-content-start w-100">
                                        <Button 
                                            size="sm" color="primary" 
                                            onClick={() => 
                                                filterType.typeFilter == "status" && onFilterStatus ? 
                                                    onFilterStatus(statusType.typeStatus) :
                                                    onFilterDate(startDate.getTime(), endDate.getTime(), filterItems ? filterType.typeFilter : false)
                                            }
                                            className="mb-3 font-12 text-uppercase w-60 mr-1" 
                                            style={{height: "31px"}}
                                        >Filter</Button>
                                        <Button size="sm" color="success" onClick={handleResetFilter} className="mb-3 font-12 text-uppercase w-40 ml-1" style={{height: "31px"}}>Reset</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Col> : ""
                }
                {
                    exportTitle ?
                        <Col xs="12" md="4" className="pt-3">
                            <div className="d-flex justify-content-end w-100">
                                <span className="mr-2 text-left font-14" style={{paddingTop: "10px", minWidth: "60px"}}>Save As :</span>
                                <FormSelect
                                    containerClassName="w-100"
                                    formId="yourExportToFile" 
                                    formName="ExportToFile" 
                                    formSize="sm"
                                    formPlaceholder="Select Format"
                                    formOptionData={saveTypeOption}
                                    formValue={saveType.typeFile}
                                    onChange={handleExportSelect}
                                />
                                {
                                    Number(saveType.typeFile) ?
                                        <Button 
                                            size="sm" 
                                            color="primary" 
                                            className="mb-3 ml-2 px-2 font-12 text-uppercase" 
                                            style={{marginTop: "5px", height: "31px"}}
                                            onClick={() => Number(saveType.typeFile) === 1 ? initCreateExcel() : initCreatePdf()}
                                        ><i className="icon-arrow-down font-14" /></Button> : ""
                                }
                            </div>
                        </Col> : ""
                }
                {exportTitle ? <Col xs="12" md="4" /> : ""}
                {
                    !onFilterDate && sortItems && sortValue && onSortClick ?
                        <Col xs="12" md={exportTitle ? '4' : '6'} className="pt-3">
                            <div className="d-flex justify-content-end w-100 mb-3">
                                <span className="mr-2 text-left font-14" style={{paddingTop: "10px", minWidth: "60px"}}>Sort By :</span>
                                <FormSelect
                                    containerClassName="w-100"
                                    withLabel={false}
                                    formId="yourFormSortBy" 
                                    formName="FormSortBy" 
                                    formSize="sm"
                                    formPlaceholder="Sort By"
                                    formOptionData={sortItems}
                                    formValue={sortValue}
                                    onChange={onSortClick}
                                />
                            </div>
                        </Col> : ""
                }
            </Row>
            <Table size="sm" responsive={isResponsive ? isResponsive : true}>
                {
                    tHead ?
                        <thead>
                            <tr>
                                {listNumber ? <th key={0} scope="col" className="py-2">No.</th> : null}
                                {
                                    tHead.map((data, key) => (
                                        <th key={key} scope="col" className="py-2">
                                            <div
                                                className="position-relative w-100 overflow-hidden"
                                                style={{
                                                    paddingRight: data.id ? '30px' : 0,
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap"
                                                }}
                                            >
                                                {data.name}
                                                {
                                                    onTargetSortClick && data.id ?
                                                        <div 
                                                            className={`absolute-center-right mr-2 cursor-pointer ${sortValue == data.id ? 'text-primary' : 'text-secondary'}`}
                                                            style={{marginTop: "1px"}}
                                                            onClick={() => onTargetSortClick(data)}
                                                        >
                                                            {
                                                                sortValue == data.id ?
                                                                    <div>
                                                                    {
                                                                        orderValue == 'desc' ?
                                                                            <i className="icon icon-arrow-up1" />
                                                                            :
                                                                            <i className="icon icon-arrow-down1" />
                                                                    }
                                                                    </div>
                                                                    :
                                                                    <i className="icon icon-select-arrows" />
                                                            }
                                                            
                                                        </div> : ""
                                                }
                                            </div>
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead> : ""
                }
                {
                    noResult ?
                        <tbody>
                            <tr><td className="pt-5 pb-2 text-center text-secondary" colSpan={listNumber ? tHead.length + 1 : tHead.length}>No Result Found</td></tr>
                        </tbody> : <tbody>{children}</tbody>
                }
            </Table>
            {pagination ? pagination : ""}
        </div>
    )
}