import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/ProductCard.css";

export default function ProductCard({ product }) {
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl =
        product?.coverImage?.url ||
        product?.coverImageUrl ||
        product?.images?.[0]?.url ||
        product?.images?.[0]?.imageUrl ||
        null;

    const showImage = imageUrl && !imageFailed;
    const productName = product?.name
        ? product.name.charAt(0).toUpperCase() + product.name.slice(1)
        : "Ürün";

    const productId = product?.id;
    const productLink = productId ? `/urunler/${productId}` : "/urunler";

    return (
        <NavLink className="product-card-public" to={productLink}>
            <div className="product-card-media">
                {showImage ? (
                    <img
                        src={imageUrl}
                        alt={productName}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="450"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="product-card-placeholder">Görsel</div>
                )}
                <div className="product-card-overlay">
                    <span className="material-symbols-outlined">
                        search
                    </span>
                </div>
            </div>

            <div className="product-card-body">
                <div className="product-card-title">
                    <h3>{productName}</h3>
                    {product?.brand ? (
                        <span className="product-card-brand">
                            {product.brand}
                        </span>
                    ) : null}
                    {(product?.productFeature?.size ||
                        product?.productFeature?.unitPerPack != null ||
                        product?.productFeature?.unitPerCarton != null) && (
                        <span className="product-card-size">
                            {product?.productFeature?.size ? (
                                <span>Boyut: {product.productFeature.size}</span>
                            ) : null}
                            {product?.productFeature?.unitPerPack != null ? (
                                <span className="product-card-size-sub">
                                    Pakette: {product.productFeature.unitPerPack}{" "}
                                    adet
                                </span>
                            ) : null}
                            {product?.productFeature?.unitPerCarton != null ? (
                                <span className="product-card-size-sub">
                                    Kolide: {product.productFeature.unitPerCarton}{" "}
                                    paket
                                </span>
                            ) : null}
                        </span>
                    )}
                </div>
                <p>{product?.description || ""}</p>
            </div>
        </NavLink>
    );
}
