import styles from "./ShareModal.module.css";

const ShareModal = ({ isOpen, onClose, link }) => {
	if (!isOpen) return null;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(link).then(() => {
			alert("Link copied to clipboard!");
		});
		window.location.reload();
	};

	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<h2>Share Quiz</h2>
				<p>Share this link to allow others to play your quiz:</p>
				<div className={styles.linkContainer}>
					<input
						type="text"
						value={link}
						readOnly
						className={styles.linkInput}
					/>
					<button onClick={copyToClipboard} className={styles.copyButton}>
						Copy Link
					</button>
				</div>
				<button onClick={onClose} className={styles.closeButton}>
					Close
				</button>
			</div>
		</div>
	);
};

export default ShareModal;
