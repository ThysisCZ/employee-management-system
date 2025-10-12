import { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import styles from '../css/addEmployeeModal.module.css';

function DeleteEmployeeModal({ show, setDeleteEmployeeShow, onEmployeeDeleted, token, employee }) {
    const URI = "http://localhost:8000";

    const [deleteCall, setDeleteCall] = useState({ state: "inactive" });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleClose = () => {
        setMessage({ type: '', text: '' });
        setDeleteEmployeeShow(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!e.target.checkValidity()) return;

        try {
            setDeleteCall({ state: "pending" });
            setMessage({ type: '', text: '' });

            const response = await fetch(`${URI}/user/delete/${employee._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setDeleteCall({ state: "success" });
                setMessage({ type: 'success', text: 'Employee deleted successfully!' });

                setTimeout(() => {
                    onEmployeeDeleted(); // refresh list
                    handleClose();
                }, 1000);
            } else {
                setDeleteCall({ state: "error", error: data.message });
                setMessage({ type: 'error', text: data.message || 'Failed to update employee' });
            }
        } catch (e) {
            console.error('Delete employee error:', e);
            setDeleteCall({ state: "error", error: e });
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Delete {employee?.name}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message.text && (
                    <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
                        {message.text}
                    </div>
                )}

                <Form onSubmit={handleSubmit}>
                    <div className={styles.buttonGroup}>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={deleteCall.state === "pending"}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={deleteCall.state === "pending"}
                        >
                            {deleteCall.state === "pending" ? "Deleting..." : "Confirm"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default DeleteEmployeeModal;