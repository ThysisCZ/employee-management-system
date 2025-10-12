import { useAuth } from '../context/AuthContext';
import styles from '../css/employeeList.module.css';
import { useState, useEffect } from 'react';
import AddEmployeeModal from '../components/AddEmployeeModal';
import ViewEmployeeModal from '../components/ViewEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import DeleteEmployeeModal from '../components/DeleteEmployeeModal';

function EmployeeList() {
    const { manager, token } = useAuth();

    const URI = "http://localhost:8000";

    const [employeeListCall, setEmployeeListCall] = useState({
        state: "inactive",
        data: []
    });

    const [addEmployeeShow, setAddEmployeeShow] = useState(false);
    const [viewEmployeeShow, setViewEmployeeShow] = useState(false);
    const [editEmployeeShow, setEditEmployeeShow] = useState(false);
    const [deleteEmployeeShow, setDeleteEmployeeShow] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleAddEmployeeShow = () => {
        setAddEmployeeShow(true);
    };

    const handleViewEmployeeShow = (employee) => {
        setSelectedEmployee(employee);
        setViewEmployeeShow(true);
    };

    const handleEditEmployeeShow = (employee) => {
        setSelectedEmployee(employee);
        setEditEmployeeShow(true);
    };

    const handleDeleteEmployeeShow = (employee) => {
        setSelectedEmployee(employee);
        setDeleteEmployeeShow(true);
    };

    const onComplete = () => {
        fetchEmployees();
    };

    async function fetchEmployees() {
        if (!token) return; // Don't fetch if no token

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
                setEmployeeListCall({
                    state: "error",
                    error: result.message,
                    data: []
                });
            }
        } catch (e) {
            console.error('Fetch error:', e);
            setEmployeeListCall({
                state: "error",
                error: e,
                data: []
            });
        }
    };

    useEffect(() => {
        let isMounted = true;

        async function loadEmployees() {
            if (!token || !isMounted) return;

            try {
                setEmployeeListCall({ state: "pending", data: [] });

                const response = await fetch(`${URI}/user/list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (isMounted && response.ok) {
                    setEmployeeListCall({
                        state: "success",
                        data: result.data
                    });
                } else if (isMounted) {
                    setEmployeeListCall({
                        state: "error",
                        error: result.message,
                        data: []
                    });
                }
            } catch (e) {
                if (isMounted) {
                    console.error('Fetch error:', e);
                    setEmployeeListCall({
                        state: "error",
                        error: e,
                        data: []
                    });
                }
            }
        };

        loadEmployees();

        return () => {
            // Prevent state updates after unmount
            isMounted = false;
        };
    }, [token]);

    return (
        <div className={styles.employeeListContainer}>
            <div className={styles.header}>
                <h2>Welcome, {manager?.name}</h2>
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
                                        <button className={styles.viewBtn} onClick={() => handleViewEmployeeShow(employee)}>View</button>
                                        <button className={styles.editBtn} onClick={() => handleEditEmployeeShow(employee)}>Edit</button>
                                        <button className={styles.deleteBtn} onClick={() => handleDeleteEmployeeShow(employee)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <AddEmployeeModal
                show={addEmployeeShow}
                setAddEmployeeShow={setAddEmployeeShow}
                onEmployeeAdded={onComplete}
                token={token}
            />

            <ViewEmployeeModal
                show={viewEmployeeShow}
                setViewEmployeeShow={setViewEmployeeShow}
                employee={selectedEmployee}
            />

            <EditEmployeeModal
                show={editEmployeeShow}
                setEditEmployeeShow={setEditEmployeeShow}
                onEmployeeEdited={onComplete}
                token={token}
                employee={selectedEmployee}
            />

            <DeleteEmployeeModal
                show={deleteEmployeeShow}
                setDeleteEmployeeShow={setDeleteEmployeeShow}
                onEmployeeDeleted={onComplete}
                token={token}
                employee={selectedEmployee}
            />
        </div>
    );
}

export default EmployeeList;