import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditQuizModal.module.css"; 

const EditQuizModal = ({ quizId, onClose }) => {
	const [quiz, setQuiz] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

	
	const fetchQuizData = async () => {
		try {
			const response = await axios.get(
				`https://quizzie-be.vercel.app/api/v1/quiz/playquiz/${quizId}`
			);
			console.log(response);
			setQuiz(response.data.quiz);
			setLoading(false);
		} catch (err) {
			setError("Error fetching quiz data");
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchQuizData();
	}, [quizId]);

	const handleUpdate = async () => {
		try {
			if (!quiz) return; 
			const updatedQuiz = {
				questions: quiz.questions.map((q) => ({
					_id: q._id,
					question: q.question,
					options: q.options.map((o) => ({ text: o.text })),
					timer: q.timer,
					correctOption: q.correctOption,
				})),
			};

			const token = localStorage.getItem("accessToken"); 
			await axios.put(
				`https://quizzie-be.vercel.app/api/v1/quiz/updatequiz/${quizId}`,
				updatedQuiz,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			onClose(); 
		} catch (err) {
			console.error("Error updating quiz", err);
			setError("Error updating quiz");
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;
	if (!quiz) return <p>No quiz data available</p>;

	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<h2>Edit Quiz</h2>
				<div>
					<label>Title:</label>
					<input type="text" value={quiz.title || ""} readOnly />{" "}
				</div>
				<div>
					<label>Type:</label>
					<select value={quiz.type || ""} disabled>
						{" "}
						<option value="Q&A">Q&A</option>
						<option value="Poll">Poll</option>
					</select>
				</div>
				<div>
					<h3>Select Question:</h3>
					<select
						value={selectedQuestionIndex}
						onChange={(e) =>
							setSelectedQuestionIndex(parseInt(e.target.value, 10))
						}>
						{quiz.questions.map((_, index) => (
							<option key={index} value={index}>
								Question {index + 1}
							</option>
						))}
					</select>
				</div>
				<div>
					<h3>Edit Question:</h3>
					{quiz.questions.length > 0 ? (
						<div className={styles.question}>
							<label>Question:</label>
							<input
								type="text"
								value={quiz.questions[selectedQuestionIndex]?.question || ""}
								onChange={(e) => {
									const updatedQuestions = [...quiz.questions];
									updatedQuestions[selectedQuestionIndex].question =
										e.target.value;
									setQuiz({ ...quiz, questions: updatedQuestions });
								}}
							/>
							<div>
								<label>Options:</label>
								{quiz.questions[selectedQuestionIndex]?.options &&
								quiz.questions[selectedQuestionIndex].options.length > 0 ? (
									quiz.questions[selectedQuestionIndex].options.map(
										(option, idx) => (
											<div key={idx} className={styles.option}>
												<input
													type="text"
													value={option?.text || ""}
													onChange={(e) => {
														const updatedQuestions = [...quiz.questions];
														updatedQuestions[selectedQuestionIndex].options[
															idx
														] = {
															...updatedQuestions[selectedQuestionIndex]
																.options[idx],
															text: e.target.value,
														};
														setQuiz({ ...quiz, questions: updatedQuestions });
													}}
												/>
											</div>
										)
									)
								) : (
									<p>No options available</p>
								)}
							</div>
							<label>Timer:</label>
							<input
								type="number"
								value={quiz.questions[selectedQuestionIndex]?.timer || 0}
								onChange={(e) => {
									const updatedQuestions = [...quiz.questions];
									updatedQuestions[selectedQuestionIndex].timer =
										parseInt(e.target.value, 10) || 0;
									setQuiz({ ...quiz, questions: updatedQuestions });
								}}
							/>
						</div>
					) : (
						<p>No questions available</p>
					)}
				</div>
				<button onClick={handleUpdate}>Update Quiz</button>
				<button onClick={onClose}>Close</button>
			</div>
		</div>
	);
};

export default EditQuizModal;
