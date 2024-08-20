import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Analytics.module.css";
import EditQuizModal from "./EditQuizModal";
import CreateQuizModal from "./CreateQuizModal";
import { createQuiz } from "../api/quiz";

const Analytics = () => {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [quizzes, setQuizzes] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [quizIdToDelete, setQuizIdToDelete] = useState(null);
	const [showEditModal, setShowEditModal] = useState(false);
	const [quizIdToEdit, setQuizIdToEdit] = useState(null);

	useEffect(() => {
		const fetchQuizzes = async () => {
			try {
				const response = await axios.get(
					`https://quizzie-be.vercel.app/api/v1/quiz/getquizzes`,
					{
						withCredentials: true,
					}
				);
				setQuizzes(response.data.quizzes);
			} catch (error) {
				console.error("Error fetching quizzes", error);
			}
		};

		fetchQuizzes();
	}, []);

	const handleCreateQuiz = async (quizData) => {
		try {
			await createQuiz(quizData);
			setIsModalOpen(false);
		} catch (error) {
			console.error("Error creating quiz:", error.message);
		}
	};

	const handleEdit = (quizId) => {
		setQuizIdToEdit(quizId);
		setShowEditModal(true);
	};

	const handleDeleteClick = (quizId) => {
		setQuizIdToDelete(quizId);
		setShowModal(true);
	};

	const handleDelete = async () => {
		try {
			if (quizIdToDelete) {
				await axios.delete(
					`https://quizzie-be.vercel.app/api/v1/quiz/${quizIdToDelete}`,
					{
						withCredentials: true,
					}
				);
				setQuizzes(quizzes.filter((quiz) => quiz._id !== quizIdToDelete));
				setShowModal(false);
			}
		} catch (error) {
			console.error("Error deleting quiz", error);
		}
	};

	const handleShare = async (quizId) => {
		try {
			const shareLink = `http://localhost:5173/playQuiz/${quizId}`;
			if (shareLink) {
				navigator.clipboard.writeText(shareLink);
				alert("Link copied to clipboard!");
			} else {
				alert("Failed to get share link.");
			}
		} catch (error) {
			console.error("Error sharing quiz", error);
		}
	};

	const closeModal = () => {
		setShowModal(false);
		setQuizIdToDelete(null);
	};

	const handleSaveEdit = () => {
		setShowEditModal(false);
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
		<div className={styles.analyticsPage}>
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
			<div className={styles.content}>
				<h2 style={{ textAlign: "center", color: "#5076FF" }}>Quiz Analysis</h2>
				<table className={styles.analyticsTable}>
					<thead>
						<tr>
							<th style={{ textAlign: "center" }}>S.No</th>
							<th style={{ textAlign: "center" }}>Quiz Name</th>
							<th style={{ textAlign: "center" }}>Created on</th>
							<th style={{ textAlign: "center" }}>Impressions</th>
							<th style={{ textAlign: "center" }}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{quizzes.map((quiz, index) => (
							<tr key={quiz._id}>
								<td style={{ textAlign: "center" }}>{index + 1}</td>
								<td style={{ textAlign: "center" }}>{quiz.title}</td>
								<td style={{ textAlign: "center" }}>
									{new Date(quiz.createdAt).toLocaleDateString()}
								</td>
								<td style={{ textAlign: "center" }}>{quiz.impressions}</td>
								<td
									className={styles.actions}
									style={{
										textAlign: "center",
										display: "flex",
										justifyContent: "space-evenly",
									}}>
									<button onClick={() => handleEdit(quiz._id)}>✏️</button>
									<button onClick={() => handleDeleteClick(quiz._id)}>
										🗑️
									</button>
									<button onClick={() => handleShare(quiz._id)}>🔗</button>
									<Link to={`/quizAnalysis/${quiz._id}`}>
										<button style={{ color: "black" }}>
											Question Wise Analysis
										</button>
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<CreateQuizModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleCreateQuiz}
				/>

				{showModal && (
					<div className={styles.modal}>
						<div className={styles.modalContent}>
							<h3>Are you sure you want to delete this quiz?</h3>
							<button onClick={handleDelete}>Delete</button>
							<button onClick={closeModal}>Cancel</button>
						</div>
					</div>
				)}

				{showEditModal && (
					<EditQuizModal
						isOpen={showEditModal}
						onClose={() => setShowEditModal(false)}
						quizId={quizIdToEdit}
						onSave={handleSaveEdit}
					/>
				)}
			</div>
		</div>
	);
};

export default Analytics;
