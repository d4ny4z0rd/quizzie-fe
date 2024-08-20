import axios from "axios";

const BACKEND_URL = "https://quizzie-be.vercel.app/api/v1/users";

const login = async (email, password) => {
	try {
		const response = await axios.post(
			`${BACKEND_URL}/login`,
			{
				email,
				password,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		);
		return response;
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.message);
		} else {
			throw new Error("Error while Login");
		}
	}
};

const register = async (fullName, email, password) => {
	try {
		const response = await axios.post(`${BACKEND_URL}/register`, {
			fullName,
			email,
			password,
		});

		console.log("signup", response.data);
		return response;
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};

export { login, register };
