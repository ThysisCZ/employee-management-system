import { useState, useEffect } from 'react';
import { Form, Button, Modal, Stack } from 'react-bootstrap';
import styles from '../css/addEmployeeModal.module.css';

function EditEmployeeModal({ show, setEditEmployeeShow, onEmployeeEdited, token, employee }) {
    const defaultForm = {
        name: '',
        address: '',
        phone: ''
    };

    const URI = "http://localhost:8000";

    const [formData, setFormData] = useState(defaultForm);
    const [validated, setValidated] = useState(false);
    const [editCall, setEditCall] = useState({ state: "inactive" });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Pre-fill form when modal opens
        if (employee && show) {
            setFormData({
                name: employee.name || '',
                address: employee.address || '',
                phone: employee.phone || ''
            });
        }
    }, [employee, show]);

    const setField = (name, val) => {
        setFormData((formData) => ({ ...formData, [name]: val }));
    };

    const handleClose = () => {
        setFormData(defaultForm);
        setValidated(false);
        setMessage({ type: '', text: '' });
        setEditEmployeeShow(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);

        if (!e.target.checkValidity()) return;

        try {
            setEditCall({ state: "pending" });
            setMessage({ type: '', text: '' });

            const response = await fetch(`${URI}/user/update/${employee._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setEditCall({ state: "success" });
                setMessage({ type: 'success', text: 'Employee updated successfully!' });

                setTimeout(() => {
                    onEmployeeEdited(); // refresh list
                    handleClose();
                }, 1000);
            } else {
                setEditCall({ state: "error", error: data.message });
                setMessage({ type: 'error', text: data.message || 'Failed to update employee' });
            }
        } catch (e) {
            console.error('Edit employee error:', e);
            setEditCall({ state: "error", error: e });
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message.text && (
                    <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
                        {message.text}
                    </div>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Stack gap={3}>
                        <Form.Group>
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setField("name", e.target.value)}
                                maxLength={50}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Address:</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.address}
                                onChange={(e) => setField("address", e.target.value)}
                                maxLength={100}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Phone:</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setField("phone", e.target.value)}
                                maxLength={20}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Stack>

                    <div className={styles.buttonGroup}>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={editCall.state === "pending"}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={editCall.state === "pending"}
                        >
                            {editCall.state === "pending" ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditEmployeeModal;