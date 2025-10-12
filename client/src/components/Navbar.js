import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../css/navbar.module.css';

function Navbar() {
    const { manager, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Don't show navbar if not logged in
    if (!isAuthenticated()) {
        return null;
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContent}>
                <h3 className={styles.appTitle}>Employee Management System</h3>

                <div className={styles.navbarRight}>
                    <span className={styles.managerName}>
                        {manager.name}
                    </span>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;