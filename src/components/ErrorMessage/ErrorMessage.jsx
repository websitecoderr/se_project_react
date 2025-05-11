function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="error-message">
      <p>{message}</p>
      <button onClick={onClose}>&times;</button>
    </div>
  );
}

export default ErrorMessage;
