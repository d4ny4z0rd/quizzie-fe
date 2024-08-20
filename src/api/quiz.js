import axios from "axios";

const BACKEND_URL = "https://quizzie-be.vercel.app/api/v1/quiz";

const fetchQuizzes = async () => {
	try {
		const response = await axios.get(`${BACKEND_URL}/getquizzes`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.message);
		} else {
			throw new Error("Error while fetching quizzes");
		}
	}
};

const createQuiz = async (quizData) => {
	try {
		const response = await axios.post(`${BACKEND_URL}/create`, quizData, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});
		console.log(response.data);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.message);
		} else {
			throw new Error("Error while creating quiz");
		}
	}
};

export { fetchQuizzes, createQuiz };
