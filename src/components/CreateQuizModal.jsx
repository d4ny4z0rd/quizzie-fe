import { useState } from "react";
import styles from "./CreateQuizModal.module.css";
import AddQuestionsModal from "./AddQuestionsModal";

const CreateQuizModal = ({ isOpen, onClose, onSubmit }) => {
const [type, setType] = useState("Q&A");
const [title, setTitle] = useState("");
const [questions, setQuestions] = useState([]);
const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
const [error, setError] = useState("");

const handleQuizTypeChange = (type) => setType(type);

const handleTitleChange = (e) => setTitle(e.target.value);

const handleAddQuestion = () => {
	if (title.trim() === "") {
		setError("Please enter a title for the quiz.");
		return;
	}
	setError(""); 
	setIsQuestionModalOpen(true);
	onClose(); 
};

const handleQuestionsSubmit = (newQuestion) => {
	setQuestions([...questions, newQuestion]);
	setIsQuestionModalOpen(false);
};

const handleClose = () => {
	setTitle(""); 
	setError(""); 
	setIsQuestionModalOpen(false); 
	onClose(); 
};

return (
	<>
		<div
			className={`${styles.modal} ${isOpen ? styles.open : styles.closed}`}>
			<div className={styles.modalContent}>
				<h2>Create Quiz</h2>
				<label>
					Title:
					<input
						type="text"
						style={{ marginTop: "10px" }}
						value={title}
						onChange={handleTitleChange}
					/>
				</label>
				{error && <p className={styles.error}>{error}</p>}
				<div className={styles.quizTypeContainer}>
					<h4
						style={{
							marginTop: "7%",
							marginLeft: "-8%",
							marginRight: "-14%",
						}}>
						Quiz Type :{" "}
					</h4>
					<button
						className={`${styles.quizTypeButton} ${
							type === "Q&A" ? styles.selected : ""
						}`}
						onClick={() => handleQuizTypeChange("Q&A")}>
						Q&A
					</button>
					<button
						style={{ marginLeft: "-50px" }}
						className={`${styles.quizTypeButton} ${
							type === "Poll" ? styles.selected : ""
						}`}
						onClick={() => handleQuizTypeChange("Poll")}>
						Poll
					</button>
				</div>
				<div
					style={{
						marginLeft: "5%",
						marginTop: "20px",
						display: "flex",
						justifyContent: "center",
					}}>
					<button
						className={`${styles.button} ${styles.continueButton}`}
						onClick={handleAddQuestion}>
						Continue
					</button>
					<button
						className={`${styles.button} ${styles.closeButton}`}
						onClick={handleClose}>
						Close
					</button>
				</div>
			</div>
		</div>

		<AddQuestionsModal
			isOpen={isQuestionModalOpen}
			onClose={() => setIsQuestionModalOpen(false)}
			onSubmit={handleQuestionsSubmit}
			title={title}
			type={type}
		/>
	</>
);
};

export default CreateQuizModal;
