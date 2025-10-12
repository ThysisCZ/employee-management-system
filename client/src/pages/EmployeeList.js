import { useAuth } from '../context/AuthContext';
import styles from '../css/employeeList.module.css';

function EmployeeList() {
    const { manager } = useAuth();

    return (
        <div className={styles.employeeListContainer}>
            <div className={styles.header}>
                <h2>Employee Management</h2>
                <button className={styles.addBtn}>
                    + Add Employee
                </button>
            </div>

            <div className={styles.tableContainer}>
                <p>Manager: {manager?.name}</p>
                <p>Employee list will appear here...</p>
            </div>
        </div>
    );
}

export default EmployeeList;