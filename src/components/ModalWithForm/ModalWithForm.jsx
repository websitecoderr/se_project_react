import React from "react";
import "./ModalWithForm.css";

function ModalWithForm({
  children,
  title,
  isOpen,
  onClose,
  onSubmit,
  styleState = true,
  onSwitch = null,
  switchText = "Sign Up",
  buttonText = "Submit",
  buttonDisabled = true,
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

        <h2 className="modal__title">{title}</h2>

        <form
          className="modal__form"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("styleState:", styleState);
            console.log("onSubmit function:", onSubmit);
            console.log("typeof onSubmit:", typeof onSubmit);

            if (styleState && typeof onSubmit === "function") {
              onSubmit(e);
            }
          }}
        >
          {children}

          <button
            type="submit"
            className="modal__submit-button"
            disabled={buttonDisabled}
          >
            {buttonText}
          </button>

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
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
