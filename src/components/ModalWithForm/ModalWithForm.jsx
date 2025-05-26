import "./ModalWithForm.css";

function ModalWithForm({
  children,
  title,
  isOpen,
  onClose,
  onSubmit,
  buttonText = "Save changes",
  buttonDisabled = false,
  styleState = true,
  onSwitch = null,
  switchText = "Sign Up",
}) {
  const handleOverlayClick = (e) => {
    if (isOpen && e.target.classList.contains("modal")) {
      onClose();
    }
  };

  return (
    <div
      className={`modal ${isOpen ? "modal_opened" : ""} ${
        styleState ? "modal_active" : "modal_disabled"
      }`}
      onClick={handleOverlayClick}
    >
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title">{title}</h2>
        <button type="button" className="modal__close" onClick={onClose}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 6.58579L13.2929 1.29289L14.7071 2.70711L9.41421 8L14.7071 13.2929L13.2929 14.7071L8 9.41421L2.70711 14.7071L1.29289 13.2929L6.58579 8L1.29289 2.70711L2.70711 1.29289L8 6.58579Z"
              fill="black"
            />
          </svg>
        </button>

        <form
          className="modal__form"
          onSubmit={(e) => {
            e.preventDefault();
            if (styleState) {
              onSubmit(e);
            }
          }}
        >
          {children}
          <div className="modal__button-container">
            {" "}
            {onSwitch && (
              <div className="modal__switch-container">
                <span>or</span>
                <button
                  type="button"
                  className="modal__switch-link"
                  onClick={onSwitch}
                >
                  <strong>{switchText}</strong>
                </button>
              </div>
            )}
            <button
              type="submit"
              className="modal__button"
              disabled={buttonDisabled}
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
