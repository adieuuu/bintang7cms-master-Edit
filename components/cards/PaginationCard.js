import { Container, Pagination, PaginationItem, PaginationLink } from 'reactstrap'

export default (props) => {
    const { size, ariaLabel, totalContent, currentPage, contentMaxLength, onClick } = props
    const totalPage = Math.ceil(totalContent/contentMaxLength)
    const generatePagination = () => {
        var lists = [],
            current = currentPage,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [], rangeWithDots = [], l

        for (let i = 1; i <= totalPage; i++) {
            if (i == 1 || i == totalPage || i >= left && i < right) {
                range.push(i)
            }
        }
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1)
                } else if (i - l !== 1) {
                    rangeWithDots.push('...')
                }
            }
            rangeWithDots.push(i)
            l = i
        }

        for (let i of rangeWithDots) {
            const btn = i == '...' ? 
                <PaginationItem key={i}>
                    <PaginationLink>{i}</PaginationLink>
                </PaginationItem>
                :
                <PaginationItem key={i} onClick={() => onClick(i)} className={i === current ? 'active': ''}>
                    <PaginationLink>{i}</PaginationLink>
                </PaginationItem>

            lists.push(btn)
        }
        return lists
    }
    
    return (
        <Container fluid className="w-100 d-inline-block p-0 mt-1">
            <Pagination size={size} aria-label={ariaLabel}>
                {
                    currentPage > 1 ?
                        <PaginationItem>
                            <PaginationLink onClick={() => onClick(1)}>
                                <i className="font-12 icon-chevron-left" />
                            </PaginationLink>
                        </PaginationItem> : ""
                }
                {generatePagination()}
                {
                    currentPage < totalPage ?
                        <PaginationItem>
                            <PaginationLink onClick={() => onClick(totalPage)}>
                                <i className="font-12 icon-chevron-right" />
                            </PaginationLink>
                        </PaginationItem> : ""
                }
            </Pagination>
        </Container>
    )
}