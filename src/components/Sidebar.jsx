import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = ({ openModal }) => {
	const navigate = useNavigate();

	const navigateToDashboard = () => {
		navigate("/dashboard");
	};

	const navigateToAnalytics = () => {
		navigate("/analytics");
	};

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("user");
		navigate("/login");
	};

	return (
		<aside className={styles.sidebar}>
			<h1
				className={styles.logo}
				style={{ fontSize: "35px", fontWeight: "bold" }}>
				QUIZZIE
			</h1>
			<ul className={styles.navList}>
				<li className={styles.navItem}>
					<button
						className={`${styles.navButton} ${styles.active}`}
						onClick={navigateToDashboard}
						style={{ marginTop: "150px" }}>
						Dashboard
					</button>
				</li>
				<li className={styles.navItem}>
					<button className={styles.navButton} onClick={navigateToAnalytics}>
						Analytics
					</button>
				</li>
				<li className={styles.navItem}>
					<button className={styles.navButton} onClick={openModal}>
						Create Quiz
					</button>
				</li>
				<li className={styles.navItem}>
					<button
						className={styles.logoutButton}
						onClick={handleLogout}
						style={{ fontSize: "25px", marginTop: "250px" }}>
						Logout
					</button>
				</li>
			</ul>
		</aside>
	);
};

export default Sidebar;
