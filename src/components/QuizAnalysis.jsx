import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./QuizAnalysis.module.css";
import CreateQuizModal from "./CreateQuizModal";
import { createQuiz } from "../api/quiz";

const QuizAnalysis = () => {
	const { quizId } = useParams();
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isPoll, setIsPoll] = useState(false);
	const [quizData, setQuizData] = useState(null);
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const response = await axios.get(
					`https://quizzie-be.vercel.app/api/v1/analytics/get/${quizId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
						},
					}
				);
				if (response.data && Array.isArray(response.data.analytics)) {
					setQuestions(response.data.analytics);
					setIsPoll(response.data.isPoll);
					setQuizData(response.data.quizData);
				} else {
					throw new Error(
						"Unexpected response structure or missing analytics data"
					);
				}
			} catch (error) {
				console.error("Error fetching question analysis:", error.message);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchQuizData();
	}, [quizId]);

	const handleCreateQuiz = async (quizData) => {
		try {
			await createQuiz(quizData);
			setIsModalOpen(false);
		} catch (error) {
			console.error("Error creating quiz:", error.message);
		}
	};

	const navigateToAnalytics = () => {
		navigate("/analytics");
	};

	const getNavButtonClass = (path) => {
		return location.pathname === path ? styles.active : "";
	};

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("user");
		navigate("/login");
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className={styles.quizAnalysisPage}>
			<aside className={styles.sidebar}>
				<h1 className={styles.logo}>QUIZZIE</h1>
				<ul className={styles.navList}>
					<li className={styles.navItem}>
						<button
							style={{ marginTop: "200px", marginLeft: "10px" }}
							className={`${styles.navButton} ${getNavButtonClass(
								"/dashboard"
							)}`}
							onClick={() => navigate("/dashboard")}>
							{" "}
							Dashboard
						</button>
					</li>
					<li className={styles.navItem}>
						<button
							style={{ marginLeft: "10px" }}
							className={`${styles.navButton} ${getNavButtonClass(
								"/analytics"
							)}`}
							onClick={navigateToAnalytics}>
							{" "}
							Analytics
						</button>
					</li>
					<li className={styles.navItem}>
						<button
							style={{ marginBottom: "-500px", marginLeft: "10px" }}
							className={styles.navButton}
							onClick={() => setIsModalOpen(true)}>
							{" "}
							Create Quiz
						</button>
					</li>
					<li className={styles.navItem}>
						<button
							className={styles.logoutButton}
							onClick={handleLogout}
							style={{ marginTop: "300px", marginLeft: "10px" }}>
							Logout
						</button>
					</li>
				</ul>
			</aside>
			<div className={styles.content}>
				<h2 className={styles.pageTitle}>Question-wise Analysis</h2>
				{quizData && (
					<>
						<div className={styles.createdOn}>
							Created on: {new Date(quizData.createdAt).toLocaleDateString()}
						</div>
						<div className={styles.impressions}>
							Impressions: {quizData.impressions}
						</div>
					</>
				)}
				<div className={styles.analysisContainer}>
					{questions.length === 0 ? (
						<p>No data available</p>
					) : (
						questions.map((question, index) => (
							<div key={index} className={styles.questionBlock}>
								<p className={styles.questionText}>
									Q{index + 1}.{" "}
									{question.questionText ||
										`Question placeholder for analysis?`}
								</p>
								<div className={styles.stats}>
									<div className={styles.statBox}>
										<p className={styles.statNumber}>
											{question.attempted || 0}
										</p>
										<p className={styles.statLabel}>
											people Attempted the question
										</p>
									</div>
									<div className={styles.statBox}>
										<p className={styles.statNumber}>{question.correct || 0}</p>
										<p className={styles.statLabel}>
											people Answered Correctly
										</p>
									</div>
									<div className={styles.statBox}>
										<p className={styles.statNumber}>
											{question.incorrect || 0}
										</p>
										<p className={styles.statLabel}>
											people Answered Incorrectly
										</p>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
			<CreateQuizModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleCreateQuiz}
			/>
		</div>
	);
};

export default QuizAnalysis;
