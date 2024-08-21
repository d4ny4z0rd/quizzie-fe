import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import CreateQuizModal from "./CreateQuizModal";
import ShareModal from "./ShareModal";
import { useState, useEffect } from "react";
import { fetchQuizzes, createQuiz } from "../api/quiz";

const Dashboard = () => {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [quizzes, setQuizzes] = useState([]);
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);
	const [shareLink, setShareLink] = useState("");
	const [numberOfQuizzes, setNumberOfQuizzes] = useState(0);
	const [numberOfQuestions, setNumberOfQuestions] = useState(0);
	const [numberOfImpressions, setNumberOfImpressions] = useState(0);

	const loadQuizzes = async () => {
		try {
			const data = await fetchQuizzes();
			setQuizzes(data.quizzes);
			setNumberOfQuizzes(data.numberOfQuizzes);
			setNumberOfQuestions(data.numberOfQuestions);
			setNumberOfImpressions(data.numberOfImpressions);
		} catch (error) {
			console.error("Error fetching quizzes:", error.message);
		}
	};

	useEffect(() => {
		loadQuizzes();
	}, []);

	const handleCreateQuiz = async (quizData) => {
		try {
			await createQuiz(quizData);
			setIsModalOpen(false);
			loadQuizzes();
		} catch (error) {
			console.error("Error creating quiz:", error.message);
		}
	};

	const handleShareQuiz = (quizId) => {
		const link = `https://quizzie-fe.vercel.app/playquiz/${quizId}`;
		setShareLink(link);
		setIsShareModalOpen(true);
	};

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("user");
		navigate("/login");
		window.location.reload();
	};

	const navigateToAnalytics = () => {
		navigate("/analytics");
	};

	const formatDate = (dateString) => {
		const options = { day: "numeric", month: "short", year: "numeric" };
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-GB", options).format(date);
	};

	const formatNumber = (number) => {
		if (number >= 1000000) {
			return (number / 1000000).toFixed(1) + "M";
		} else if (number >= 1000) {
			return (number / 1000).toFixed(1) + "k";
		} else {
			return number;
		}
	};

	// Filter quizzes with more than 10 impressions
	const trendingQuizzes = quizzes.filter((quiz) => quiz.impressions > 10);

	return (
		<div className={styles.dashboardContainer}>
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
							onClick={() => navigate("/dashboard")}
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
						<button
							className={styles.navButton}
							onClick={() => setIsModalOpen(true)}>
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
			<main className={styles.mainContent}>
				<div className={styles.statistics}>
					<div
						className={styles.statItem}
						style={{ color: "red", fontSize: "20px" }}>
						<h3 className={styles.statNumber}>{numberOfQuizzes}</h3>
						<span style={{ fontSize: "30px" }}>Quiz Created</span>
					</div>
					<div
						className={styles.statItem}
						style={{ color: "lightgreen", fontSize: "20px" }}>
						<h3 className={styles.statNumber}>{numberOfQuestions}</h3>
						<span style={{ fontSize: "30px" }}>Questions Created</span>
					</div>
					<div
						className={styles.statItem}
						style={{ color: "blue", fontSize: "20px" }}>
						<h3 className={styles.statNumber}>
							{formatNumber(numberOfImpressions)}
						</h3>
						<span style={{ fontSize: "30px" }}>Total Impressions</span>
					</div>
				</div>
				<div className={styles.quizList}>
					<h2>Trending Quizzes</h2>
					<div className={styles.quizzesGrid}>
						{trendingQuizzes.length === 0 ? (
							<p>No quiz of yours is trending right now...</p>
						) : (
							trendingQuizzes.map((quiz) => (
								<div key={quiz._id} className={styles.quizCard}>
									<div className={styles.quizTitleContainer}>
										<h3
											className={styles.quizTitle}
											style={{ fontSize: "25px" }}>
											{quiz.title}
										</h3>
										<div className={styles.impressionsContainer}>
											<img
												src="fe/src/assets/eye.svg"
												alt="Impressions"
												className={styles.eyeIcon}
											/>
											<span
												className={styles.impressions}
												style={{ color: "red", fontSize: "20px" }}>
												{formatNumber(quiz.impressions)}
											</span>
										</div>
									</div>
									<p style={{ color: "green", fontSize: "20px" }}>
										Created on: {formatDate(quiz.createdAt)}
									</p>
								</div>
							))
						)}
					</div>
				</div>
			</main>
			<CreateQuizModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleCreateQuiz}
			/>
			<ShareModal
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
				link={shareLink}
			/>
		</div>
	);
};

export default Dashboard;
