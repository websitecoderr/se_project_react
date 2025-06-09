import React from "react";
import "./DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__content modal__content_type_confirmation">
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
        <div className="modal__confirmation-content">
          <p className="modal__confirmation-message">
            Are you sure you want to delete this item?
            <br />
            This action is irreversible.
          </p>
          <div className="modal__confirmation-buttons">
            <div className="modal__confirmation-buttons_rows">
              <button
                className="modal__confirmation-button modal__confirmation-button_type_confirm"
                onClick={onConfirm}
              >
                Yes, delete item
              </button>
            </div>
            <div className="modal__confirmation-buttons_rows">
              <button
                className="modal__confirmation-button modal__confirmation-button_type_cancel"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
