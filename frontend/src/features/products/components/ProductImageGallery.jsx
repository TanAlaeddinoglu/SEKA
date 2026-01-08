import ProductImageItem from "./ProductImageItem";
import "../styles/ProductImageGallery.css";

export default function ProductImageGallery({
                                                images,
                                                onDelete,
                                                onSetCover,
                                            }) {
    if (!images || !images.length) {
        return (
            <p style={{ fontSize: 13, color: "#64748b" }}>
                Bu ürün için henüz görsel yok.
            </p>
        );
    }

    return (
        <div className="image-gallery">
            {images.map((img) => (
                <ProductImageItem
                    key={img.id}
                    image={img}
                    onDelete={onDelete}
                    onSetCover={onSetCover}
                />
            ))}
        </div>
    );
}
