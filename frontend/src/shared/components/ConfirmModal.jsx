import "../styles/ConfirmModal.css";

export default function ConfirmModal({
    open,
    title = "Onay",
    message,
    confirmText = "Onayla",
    cancelText = "İptal",
    loadingText = "İşlem yapılıyor...",
    onConfirm,
    onCancel,
    loading = false,
    danger = false,
    children,
}) {
    if (!open) return null;

    const handleConfirm = () => {
        if (!loading) {
            onConfirm?.();
        }
    };

    const handleCancel = () => {
        if (!loading) {
            onCancel?.();
        }
    };

    return (
        <div
            className="confirm-modal-backdrop"
            onClick={handleCancel}
            role="presentation"
        >
            <div
                className="confirm-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="confirm-modal-title">{title}</h3>

                {message && (
                    <p className="confirm-modal-text">
                        {message}
                    </p>
                )}

                {children}

                <div className="confirm-modal-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={danger ? "danger" : "primary"}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? loadingText : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
