import { useAuth } from '../context/AuthContext';
import styles from '../css/employeeList.module.css';
import { useState, useEffect } from 'react';
import AddEmployeeModal from '../components/AddEmployeeModal';

function EmployeeList() {
    const { manager, token } = useAuth();

    const URI = "http://localhost:8000";

    const [employeeListCall, setEmployeeListCall] = useState({
        state: "inactive",
        data: []
    });

    const [addEmployeeShow, setAddEmployeeShow] = useState(false);

    const handleAddEmployeeShow = () => {
        setAddEmployeeShow(true);
    };

    const handleAddEmployeeClose = () => {
        setAddEmployeeShow(false);
    };

    const handleEmployeeAdded = () => {
        // Refresh employee list after adding
        fetchEmployees();
    };

    async function fetchEmployees() {
        try {
            setEmployeeListCall({ state: "pending", data: [] });

            const response = await fetch(`${URI}/user/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                setEmployeeListCall({
                    state: "success",
                    data: result.data
                });
            } else {
                setEmployeeListCall({ state: "error", error: result.message });
            }
        } catch (e) {
            setEmployeeListCall({
                state: "error",
                error: e,
                data: []
            });
        }
    }

    useEffect(() => {
        if (token) {
            fetchEmployees();
        }
    }, [token]);

    return (
        <div className={styles.employeeListContainer}>
            <div className={styles.header}>
                <h2>Welcome, {manager.name}</h2>
                <button className={styles.addBtn} onClick={handleAddEmployeeShow}>
                    + Add Employee
                </button>
            </div>

            <div className={styles.tableContainer}>
                {employeeListCall.state === "pending" && (
                    <p className={styles.loadingText}>Loading employees...</p>
                )}

                {employeeListCall.state === "error" && (
                    <p className={styles.errorText}>Error loading employees</p>
                )}

                {employeeListCall.state === "success" && employeeListCall.data.length === 0 && (
                    <p className={styles.emptyText}>No employees found. Add your first employee!</p>
                )}

                {employeeListCall.state === "success" && employeeListCall.data.length > 0 && (
                    <table className={styles.employeeTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeListCall.data.map((employee) => (
                                <tr key={employee._id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.address}</td>
                                    <td>{employee.phone}</td>
                                    <td className={styles.actionButtons}>
                                        <button className={styles.viewBtn}>View</button>
                                        <button className={styles.editBtn}>Edit</button>
                                        <button className={styles.deleteBtn}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <AddEmployeeModal
                show={addEmployeeShow}
                onClose={handleAddEmployeeClose}
                onEmployeeAdded={handleEmployeeAdded}
            />
        </div>
    );
}

export default EmployeeList;