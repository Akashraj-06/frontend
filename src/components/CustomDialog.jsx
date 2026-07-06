import '../styles/CustomDialog.css';

export default function CustomDialog({ isOpen, title, message, type, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="custom-dialog-overlay" onClick={onCancel}>
      <div className="custom-dialog-card" onClick={(e) => e.stopPropagation()}>
        <div className="custom-dialog-header">
          <h3>{title}</h3>
          <button className="custom-dialog-close" onClick={onCancel} aria-label="Close dialog">&times;</button>
        </div>
        <div className="custom-dialog-body">
          <p>{message}</p>
        </div>
        <div className="custom-dialog-footer">
          {type === 'confirm' && (
            <button className="custom-dialog-btn custom-dialog-btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button className="custom-dialog-btn custom-dialog-btn-confirm" onClick={onConfirm}>
            {type === 'confirm' ? 'Confirm' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}
