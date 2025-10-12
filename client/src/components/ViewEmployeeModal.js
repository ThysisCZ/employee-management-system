import { Modal, Button } from 'react-bootstrap';
import styles from '../css/viewEmployeeModal.module.css'; // optional custom styles

function ViewEmployeeModal({ show, setViewEmployeeShow, employee }) {

    const handleClose = () => {
        setViewEmployeeShow(false);
    };

    if (!employee) return null; // Safety check

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Employee Profile</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className={styles.profileContainer}>
                    <div className={styles.profileField}>
                        <strong>Name:</strong> {employee.name}
                    </div>
                    <div className={styles.profileField}>
                        <strong>Address:</strong> {employee.address}
                    </div>
                    <div className={styles.profileField}>
                        <strong>Phone:</strong> {employee.phone}
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ViewEmployeeModal;