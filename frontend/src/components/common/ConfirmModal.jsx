import React from 'react';
import { Button } from './Button';

const ConfirmModal = ({
  isOpen,
  title,
  message,
  icon: Icon = null,
  iconTone = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={isLoading ? undefined : onClose}>
      <div
        className="modal-card confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="modal-close-btn" aria-label="Close" onClick={onClose} disabled={isLoading}>
            &times;
          </button>
        </div>
        <div className="confirm-modal-body">
          {Icon && <span className={`confirm-modal-icon ${iconTone}`}><Icon /></span>}
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
