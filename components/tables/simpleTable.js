import { Table } from 'reactstrap'

export default (props) => {
    const { title, tHead, listNumber, children, pagination, noResult, isResponsive, className } = props
    return (
        <div className={className ? className : 'bg-white rounded shadow-sm p-3 mb-3 overflow-visible'}>
            {title ? <h5 className="font-16 text-primary mb-3">{title}</h5> : ""}
            <Table size="sm" responsive={isResponsive ? isResponsive : true}>
                {
                    tHead ?
                        <thead>
                            <tr>
                                {listNumber ? <th key={0} scope="col">No.</th> : null}
                                {tHead.map((data, key) => <th key={key} scope="col">{data}</th>)}
                            </tr>
                        </thead> : ""
                }
                {
                    noResult ?
                        <tbody>
                            <tr>
                                <td className="pt-5 pb-2 text-center text-secondary" colSpan={listNumber ? tHead.length + 1 : tHead.length}>No Result Found</td>
                            </tr>
                        </tbody>
                        :
                        <tbody>{children}</tbody>
                }
            </Table>
            {pagination ? pagination : ""}
        </div>
    )
}