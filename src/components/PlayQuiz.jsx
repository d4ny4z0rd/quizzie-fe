import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PlayQuiz.module.css";

const PlayQuiz = () => {
	const { quizId } = useParams();
	const navigate = useNavigate();
	const [quiz, setQuiz] = useState(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState(null);
	const [timer, setTimer] = useState(0);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const response = await fetch(
					`https://quizzie-be.vercel.app/api/v1/quiz/playquiz/${quizId}`
				);
				const data = await response.json();
				setQuiz(data.quiz);
				if (data.quiz.questions.length > 0) {
					const initialTimer = data.quiz.questions[0].timer || 0;
					setTimer(initialTimer);
				}
			} catch (error) {
				console.error("Error fetching quiz:", error);
			}
		};
		fetchQuiz();
	}, [quizId]);

	useEffect(() => {
		if (timer > 0 && !isAnswerSubmitted) {
			const countdown = setTimeout(() => setTimer(timer - 1), 1000);
			return () => clearTimeout(countdown);
		} else if (timer === 0 && quiz && !isAnswerSubmitted) {
			handleNextQuestion(false);
		}
	}, [timer, quiz, isAnswerSubmitted]);

	useEffect(() => {
		if (quiz) {
			const currentQuestion = quiz.questions[currentQuestionIndex];
			setTimer(currentQuestion.timer || 0);
		}
	}, [currentQuestionIndex, quiz]);

	const handleOptionSelect = (index) => {
		setSelectedOption(index);
	};

	const handleSubmitAnswer = async () => {
		if (selectedOption === null) return;

		const isCorrect =
			selectedOption === quiz.questions[currentQuestionIndex].correctOption;
		if (isCorrect) {
			setCorrectAnswers(correctAnswers + 1);
		}

		await fetch("https://quizzie-be.vercel.app/api/v1/analytics/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				quizId,
				questionIndex: currentQuestionIndex,
				isCorrect,
				isAnonymous: true,
				optionSelected: selectedOption,
			}),
		});

		setIsAnswerSubmitted(true);
	};

	const handleNextQuestion = (manual = true) => {
		// Always proceed to the next question
		setIsAnswerSubmitted(false);

		if (currentQuestionIndex < quiz.questions.length - 1) {
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
			setSelectedOption(null);
		} else if (manual) {
			navigate("/quizresult", {
				state: {
					correctAnswers: correctAnswers,
					totalQuestions: quiz.questions.length,
					isPoll: quiz.type === "Poll",
				},
			});
		}
	};

	if (!quiz) return <div>Loading quiz...</div>;

	const currentQuestion = quiz.questions[currentQuestionIndex];

	return (
		<div className={styles.container}>
			{timer > 0 && <div className={styles.timer}>Time left: {timer}s</div>}
			<div className={styles.questionContainer}>
				<h2 className={styles.questionTitle}>
					Question {currentQuestionIndex + 1} / {quiz.questions.length}
				</h2>
				<h3 className={styles.questionText}>{currentQuestion.question}</h3>
				<div className={styles.optionsContainer}>
					{currentQuestion.options.map((option, index) => (
						<button
							key={index}
							onClick={() => handleOptionSelect(index)}
							className={`${styles.optionButton} ${
								selectedOption === index ? styles.selected : ""
							}`}
							disabled={isAnswerSubmitted}>
							{option.text && <p style={{ fontSize: "20px" }}>{option.text}</p>}
							{option.imageUrl && (
								<img
									src={option.imageUrl}
									alt={`Option ${index + 1}`}
									className={styles.optionImage}
								/>
							)}
						</button>
					))}
				</div>
				<div className={styles.buttonGroup}>
					<button
						onClick={handleSubmitAnswer}
						disabled={isAnswerSubmitted}
						className={styles.submitButton}>
						Submit Answer
					</button>
					<button
						onClick={() => handleNextQuestion(true)}
						className={styles.nextButton}>
						{currentQuestionIndex < quiz.questions.length - 1
							? "Next"
							: "Finish"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default PlayQuiz;
