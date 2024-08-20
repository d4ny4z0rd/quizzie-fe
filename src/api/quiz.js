import axios from "axios";

const BACKEND_URL = "https://quizzie-be.vercel.app/api/v1/quiz";

const fetchQuizzes = async () => {
	try {
		const accessToken = localStorage.getItem("accessToken");
		const response = await axios.get(`${BACKEND_URL}/getquizzes`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
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
		const accessToken = localStorage.getItem("accessToken");
		const response = await axios.post(`${BACKEND_URL}/create`, quizData, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			withCredentials: true,
		});
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
