import { useState } from "react";
import styles from "./AddQuestionsModal.module.css";
import { createQuiz } from "../api/quiz";
import ShareModal from "./ShareModal";

const AddQuestionsModal = ({ isOpen, onClose, onSubmit, title, type }) => {
	const [questions, setQuestions] = useState([
		{
			question: "",
			options: [
				{ text: "", imageUrl: "" },
				{ text: "", imageUrl: "" },
			],
			timer: 0,
			correctOption: 0,
			optionType: "text",
		},
	]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [showShareModal, setShowShareModal] = useState(false);
	const [quizLink, setQuizLink] = useState("");

	const handleQuestionChange = (e) => {
		const updatedQuestions = [...questions];
		updatedQuestions[currentQuestionIndex].question = e.target.value;
		setQuestions(updatedQuestions);
	};

	const handleOptionChange = (index, key, value) => {
		const updatedQuestions = [...questions];
		updatedQuestions[currentQuestionIndex].options[index][key] = value;
		setQuestions(updatedQuestions);
	};

	const addOption = () => {
		const updatedQuestions = [...questions];
		if (updatedQuestions[currentQuestionIndex].options.length < 4) {
			updatedQuestions[currentQuestionIndex].options.push({
				text: "",
				imageUrl: "",
			});
			setQuestions(updatedQuestions);
		}
	};

	const removeOption = (index) => {
		const updatedQuestions = [...questions];
		if (updatedQuestions[currentQuestionIndex].options.length > 2) {
			updatedQuestions[currentQuestionIndex].options.splice(index, 1);
			setQuestions(updatedQuestions);
		}
	};

	const handleOptionTypeChange = (e) => {
		const updatedQuestions = [...questions];
		updatedQuestions[currentQuestionIndex].optionType = e.target.value;
		setQuestions(updatedQuestions);
	};

	const handleTimerChange = (seconds) => {
		const updatedQuestions = [...questions];
		updatedQuestions[currentQuestionIndex].timer = seconds;
		setQuestions(updatedQuestions);
	};

	const handleCorrectOptionChange = (e) => {
		const updatedQuestions = [...questions];
		updatedQuestions[currentQuestionIndex].correctOption = parseInt(
			e.target.value
		);
		setQuestions(updatedQuestions);
	};

	const addQuestion = () => {
		if (questions.length < 5) {
			setQuestions([
				...questions,
				{
					question: "",
					options: [
						{ text: "", imageUrl: "" },
						{ text: "", imageUrl: "" },
					],
					timer: 0,
					correctOption: 0,
					optionType: "text",
				},
			]);
			setCurrentQuestionIndex(questions.length);
		}
	};

	const handleSubmit = async () => {
		const quizData = {
			title,
			type,
			questions: questions.map((q) => ({
				question: q.question,
				options: q.options,
				timer: q.timer,
				correctOption: q.correctOption,
				optionType: q.optionType,
			})),
		};

		try {
			const quizResponse = await createQuiz(quizData);
			setQuizLink(
				`https://quizzie-fe.vercel.app/playquiz/${quizResponse?.quiz._id}`
			);
			setShowShareModal(true);
		} catch (error) {
			alert(error.message);
			console.log(error);
		}
	};

	const handleQuestionNavigation = (index) => {
		setCurrentQuestionIndex(index);
	};

	return (
		<div className={`${styles.modal} ${isOpen ? styles.open : styles.closed}`}>
			<div className={styles.modalContent}>
				<div className={styles.questionNavigation}>
					{questions.map((_, index) => (
						<button
							key={index}
							className={
								index === currentQuestionIndex ? styles.activeQuestion : ""
							}
							onClick={() => handleQuestionNavigation(index)}>
							{index + 1}
						</button>
					))}
					{questions.length < 5 && (
						<button onClick={addQuestion} className={styles.addQuestionButton}>
							+
						</button>
					)}
				</div>
				<h2>Add Question</h2>
				<label>
					Question:
					<input
						type="text"
						value={questions[currentQuestionIndex].question}
						onChange={handleQuestionChange}
					/>
				</label>
				<div className={styles.optionsContainer}>
					<label>Option Type:</label>
					<div>
						<label>
							<input
								type="radio"
								value="text"
								checked={questions[currentQuestionIndex].optionType === "text"}
								onChange={handleOptionTypeChange}
							/>
							Text
						</label>
						<label>
							<input
								type="radio"
								value="image"
								checked={questions[currentQuestionIndex].optionType === "image"}
								onChange={handleOptionTypeChange}
							/>
							Image URL
						</label>
						<label>
							<input
								type="radio"
								value="textImage"
								checked={
									questions[currentQuestionIndex].optionType === "textImage"
								}
								onChange={handleOptionTypeChange}
							/>
							Text & Image URL
						</label>
					</div>
					{questions[currentQuestionIndex].options.map((option, index) => (
						<div key={index} className={styles.optionRow}>
							{(questions[currentQuestionIndex].optionType === "text" ||
								questions[currentQuestionIndex].optionType === "textImage") && (
								<input
									type="text"
									value={option.text}
									placeholder="Text"
									onChange={(e) =>
										handleOptionChange(index, "text", e.target.value)
									}
									className={styles.optionInput}
								/>
							)}
							{(questions[currentQuestionIndex].optionType === "image" ||
								questions[currentQuestionIndex].optionType === "textImage") && (
								<input
									type="text"
									value={option.imageUrl}
									placeholder="Image URL"
									onChange={(e) =>
										handleOptionChange(index, "imageUrl", e.target.value)
									}
									className={styles.optionInput}
								/>
							)}
							<button
								onClick={() => removeOption(index)}
								className={styles.deleteButton}>
								🗑️
							</button>
						</div>
					))}
					<button
						onClick={addOption}
						className={styles.addOptionButton}
						disabled={questions[currentQuestionIndex].options.length >= 4}>
						Add option
					</button>
				</div>
				{type !== "Poll" && (
					<div className={styles.correctOptionContainer}>
						<label style={{ marginTop: "20px", marginBottom: "10px" }}>
							Correct Option:
						</label>
						<select
							value={questions[currentQuestionIndex].correctOption}
							onChange={handleCorrectOptionChange}>
							{questions[currentQuestionIndex].options.map((_, index) => (
								<option key={index} value={index}>
									Option {index + 1}
								</option>
							))}
						</select>
					</div>
				)}
				<div className={styles.timerContainer}>
					<label>Timer:</label>
					<div>
						<button
							onClick={() => handleTimerChange(0)}
							className={
								questions[currentQuestionIndex].timer === 0
									? styles.activeTimer
									: ""
							}>
							OFF
						</button>
						<button
							onClick={() => handleTimerChange(5)}
							className={
								questions[currentQuestionIndex].timer === 5
									? styles.activeTimer
									: ""
							}>
							5 sec
						</button>
						<button
							onClick={() => handleTimerChange(10)}
							className={
								questions[currentQuestionIndex].timer === 10
									? styles.activeTimer
									: ""
							}>
							10 sec
						</button>
					</div>
				</div>
				<div className={styles.buttonGroup}>
					<button onClick={handleSubmit} className={styles.createButton}>
						Create Quiz
					</button>
					<button onClick={onClose} className={styles.cancelButton}>
						Cancel
					</button>
				</div>
			</div>
			{showShareModal && (
				<ShareModal
					isOpen={showShareModal}
					onClose={() => setShowShareModal(false)}
					link={quizLink}
				/>
			)}
		</div>
	);
};

export default AddQuestionsModal;
