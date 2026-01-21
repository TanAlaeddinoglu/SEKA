import { useState } from "react";
import ProductImageItem from "./ProductImageItem";
import "../styles/ProductImageGallery.css";

export default function ProductImageGallery({
                                                images,
                                                onDelete,
                                                onSetCover,
                                            }) {
    const [previewImage, setPreviewImage] = useState(null);

    if (!images || !images.length) {
        return (
            <p style={{ fontSize: 13, color: "#64748b" }}>
                Bu ürün için henüz görsel yok.
            </p>
        );
    }

    return (
        <>
            <div className="image-gallery">
                {images.map((img) => (
                    <ProductImageItem
                        key={img.id}
                        image={img}
                        onDelete={onDelete}
                        onSetCover={onSetCover}
                        onPreview={setPreviewImage}
                    />
                ))}
            </div>

            {previewImage && (
                <div
                    className="image-preview-overlay"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="image-preview-dialog"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={previewImage.url}
                            alt="Ürün görseli büyük"
                        />
                        <button
                            className="image-preview-close"
                            type="button"
                            onClick={() => setPreviewImage(null)}
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
