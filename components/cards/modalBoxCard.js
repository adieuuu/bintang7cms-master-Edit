import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

export default (props) => {
    const { className, bodyClassName, showModal, size, toogleModal, title, body, children } = props
    return (
        <div>
            <Modal isOpen={showModal} toggle={toogleModal} className={className} size={size ? size : 'sm'}>
                {title ? <ModalHeader toggle={toogleModal}>{title}</ModalHeader> : ""}
                <ModalBody className={bodyClassName}>{body}</ModalBody>
                <ModalFooter className="d-block w-100">{children}</ModalFooter>
            </Modal>
        </div>
    )
}
