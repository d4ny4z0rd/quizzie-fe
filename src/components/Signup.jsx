import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register } from "../api/user";
import styles from "./Signup.module.css";

const Signup = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const location = useLocation(); 

	const validateForm = () => {
		const newErrors = {};
		const nameRegex = /^[a-zA-Z\s]+$/;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

		if (!formData.fullName || !nameRegex.test(formData.fullName)) {
			newErrors.fullName = "Invalid name";
		}
		if (!formData.email || !emailRegex.test(formData.email)) {
			newErrors.email = "Invalid email";
		}
		if (!formData.password || !passwordRegex.test(formData.password)) {
			newErrors.password = "Weak password";
		}
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords don't match";
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
			const response = await register(
				formData.fullName,
				formData.email,
				formData.password
			);
			if (response.status === 201) {
				navigate("/login");
			}
		} catch (err) {
			setErrors({ apiError: err.message });
		}
	};

	const navigateToPage = (page) => {
		navigate(page);
	};

	return (
		<div className={styles.pageContainer}>
			<div className={styles.container}>
				<div className={styles.newContainer}>
					<h2 style={{ marginTop: "-70px", marginBottom : "70px" }}>QUIZZIE</h2>

					<div className={styles.buttonGroup}>
						<button
							className={`${styles.pageButton} ${
								location.pathname === "/login" ? styles.active : ""
							}`}
							onClick={() => navigateToPage("/login")}>
							Log In
						</button>
						<button
							className={`${styles.pageButton} ${
								location.pathname === "/signup" ? styles.active : ""
							}`}
							onClick={() => navigateToPage("/signup")}>
							Sign Up
						</button>
					</div>

					{errors.apiError && <p className={styles.error}>{errors.apiError}</p>}
					<form onSubmit={handleSubmit}>
						<div className={styles.formGroup}>
							<label>Name</label>
							<input
								type="text"
								name="fullName"
								value={formData.fullName}
								onChange={handleChange}
								className={errors.fullName ? styles.inputError : ""}
							/>
							{errors.fullName && (
								<p className={styles.error}>{errors.fullName}</p>
							)}
						</div>
						<div className={styles.formGroup}>
							<label>Email</label>
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
							<label>Password</label>
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
						<div className={styles.formGroup}>
							<label>Confirm Password</label>
							<input
								type="password"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								className={errors.confirmPassword ? styles.inputError : ""}
							/>
							{errors.confirmPassword && (
								<p className={styles.error}>{errors.confirmPassword}</p>
							)}
						</div>
						<button type="submit" className={styles.signupButton}>
							Sign Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;
