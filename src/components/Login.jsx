import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/user";
import styles from "./Login.module.css";

const Login = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const validateForm = () => {
		const newErrors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!formData.email || !emailRegex.test(formData.email)) {
			newErrors.email = "Invalid email";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			const response = await login(formData.email, formData.password);

			if (response.status === 200) {
				localStorage.setItem("accessToken", response.data.accessToken);
				localStorage.setItem("refreshToken", response.data.refreshToken);
				localStorage.setItem("user", JSON.stringify(response.data.user));
				navigate("/dashboard");
				window.location.reload();
			} else {
				setErrors({ apiError: "Login failed" });
			}
		} catch (err) {
			setErrors({
				apiError: err.response?.data?.message || "An error occurred",
			});
		}
	};

	const handleLoginRedirect = () => {
		navigate("/login");
	};

	const handleSignupRedirect = () => {
		navigate("/signup");
	};

	return (
		<div className={styles.pageContainer}>
			<div className={styles.container}>
				<h1 style={{ marginTop: "-100px", marginBottom : "5%" }}>QUIZZIE</h1>
				<div className={styles.toggleButtons}>
					<button
						type="button"
						style={{marginTop : "40px", marginBottom : "40px"}}
						className={`${styles.toggleButton} ${styles.active}`}
						onClick={handleLoginRedirect}
						disabled>
						Login
					</button>
					<button
						type="button"
						className={styles.toggleButton}
						onClick={handleSignupRedirect}>
						Sign Up
					</button>
				</div>
				<div className={styles.newDiv}>
					{errors.apiError && <p className={styles.error}>{errors.apiError}</p>}
					<form onSubmit={handleSubmit}>
						<div className={styles.formGroup}>
							<label>Email:</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className={errors.email ? styles.inputError : ""}
							/>
							{errors.email && <p className={styles.error}>{errors.email}</p>}
						</div>
						<div className={styles.formGroup}>
							<label>Password:</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className={errors.password ? styles.inputError : ""}
							/>
							{errors.password && (
								<p className={styles.error}>{errors.password}</p>
							)}
						</div>
						<button type="submit" className={styles.loginButton}>
							Login
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
