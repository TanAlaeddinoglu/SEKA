import "../styles/ProductImageItem.css";

export default function ProductImageItem({
                                             image,
                                             onDelete,
                                             onSetCover,
                                             onPreview,
                                         }) {
    return (
        <div className="product-image-item">
            {image.cover && (
                <span className="cover-badge">Kapak</span>
            )}

            <img
                src={image.url}
                alt="Ürün görseli"
                onClick={() => onPreview?.(image)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onPreview?.(image);
                    }
                }}
            />

            <div className="image-actions">
                {!image.cover && (
                    <button
                        className="cover-btn"
                        onClick={() => onSetCover(image.id)}
                    >
                        Kapak Yap
                    </button>
                )}

                <button
                    className="delete-btn"
                    onClick={() => {
                        if (
                            window.confirm(
                                "Bu görsel silinsin mi?"
                            )
                        ) {
                            onDelete(image.id);
                        }
                    }}
                >
                    Sil
                </button>
            </div>
        </div>
    );
}
