import { useLocation } from "react-router-dom";
import styles from "./QuizResult.module.css";
import quizImage from "../assets/image.png"; 

const QuizResult = () => {
	const location = useLocation();
	const { correctAnswers, totalQuestions, isPoll } = location.state || {
		correctAnswers: 0,
		totalQuestions: 0,
		isPoll: false,
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<h2>Quiz Result</h2>
				{isPoll ? (
					<p>Thanks for participating in the poll!</p>
				) : (
					<p>
						You answered {correctAnswers} out of {totalQuestions} questions
						correctly.
					</p>
				)}
				{!isPoll && (
					<img src={quizImage} alt="Quiz Result" className={styles.image} />
				)}
			</div>
		</div>
	);
};

export default QuizResult;
