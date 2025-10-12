import { useState } from 'react';
import { Form, Button, Modal, Stack } from 'react-bootstrap';
import styles from '../css/addEmployeeModal.module.css';
import { useAuth } from '../context/AuthContext';

function AddEmployeeModal({ show, onClose, onEmployeeAdded }) {
    const defaultForm = {
        name: '',
        address: '',
        phone: ''
    };

    const [formData, setFormData] = useState(defaultForm);
    const [validated, setValidated] = useState(false);
    const [createCall, setCreateCall] = useState({ state: "inactive" });
    const [message, setMessage] = useState({ type: '', text: '' });
    const { token } = useAuth();

    const setField = (name, val) => {
        setFormData((formData) => ({ ...formData, [name]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);

        if (!e.target.checkValidity()) return;

        try {
            setCreateCall({ state: "pending" });
            setMessage({ type: '', text: '' });

            const response = await fetch('http://localhost:8000/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setCreateCall({ state: "success" });
                setMessage({ type: 'success', text: 'Employee added successfully!' });

                // Clear form
                setFormData(defaultForm);
                setValidated(false);

                // Notify parent component to refresh list
                setTimeout(() => {
                    onEmployeeAdded();
                    onClose();
                    setMessage({ type: '', text: '' });
                    setCreateCall({ state: "inactive" });
                }, 1500);
            } else {
                setCreateCall({ state: "error", error: data.message });
                setMessage({ type: 'error', text: data.message || 'Failed to add employee' });
            }
        } catch (e) {
            console.error('Create employee error:', e);
            setCreateCall({ state: "error", error: e });
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Employee</Modal.Title>
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
                                isInvalid={validated && formData.name.length === 0}
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
                                isInvalid={validated && formData.address.length === 0}
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
                                isInvalid={validated && formData.phone.length === 0}
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Stack>

                    <div className={styles.buttonGroup}>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={createCall.state === "pending"}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={createCall.state === "pending"}
                        >
                            {createCall.state === "pending" ? "Adding..." : "Add Employee"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddEmployeeModal;