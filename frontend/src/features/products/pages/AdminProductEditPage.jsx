import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { useProduct } from "../hooks/useProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import ProductFeatureForm from "../components/ProductFeatureForm";
import { useUpdateProductFeature } from "../hooks/useUpdateProductFeature";
import ProductImageGallery from "../components/ProductImageGallery";
import { useProductImages } from "../hooks/useProductImages";
import ProductImageUploader from "../components/ProductImageUploader";
import { useUploadProductImages } from "../hooks/useUploadProductImages";
import { useDeleteProductImage } from "../hooks/useDeleteProductImage";
import { useSetCoverImage } from "../hooks/useSetCoverImage";


import "../styles/ProductEditPage.css";

export default function AdminProductEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading } = useProduct(id);
    const feature = data?.productFeature;

    const updateMutation = useUpdateProduct(id);
    const featureMutation = useUpdateProductFeature(feature?.id);

    const { data: images, isLoading: imagesLoading } =
        useProductImages(id);

    const uploadMutation = useUploadProductImages(id);
    const deleteImageMutation = useDeleteProductImage(id);
    const setCoverMutation = useSetCoverImage(id);


    if (isLoading) return <p>Yükleniyor...</p>;

    const handleSubmit = (payload) => {
        updateMutation.mutate(payload, {
            onSuccess: () => {
                navigate("/admin/products");
            },
        });
    };

    return (
        <div className="product-edit-page">
            {/* HEADER */}
            <div className="edit-page-header">
                <h2>Ürün Düzenle</h2>

                <button
                    className="back-button"
                    onClick={() => navigate("/admin/products")}
                >
                    ← Geri Dön
                </button>
            </div>

            {/* GRID */}
            <div className="edit-page-grid">
                {/* SOL KOLON */}
                <div className="edit-column">
                    <section className="edit-section">
                        <h3>Ürün Bilgileri</h3>
                        <ProductForm
                            initialData={data}
                            onSubmit={handleSubmit}
                            loading={updateMutation.isLoading}
                        />
                    </section>

                    <section className="edit-section">
                        <h3>Ürün Özellikleri</h3>
                        <ProductFeatureForm
                            initialData={feature}
                            loading={featureMutation.isLoading}
                            onSubmit={(payload) => {
                                if (!feature?.id) {
                                    alert("Bu ürün için özellik kaydı bulunamadı.");
                                    return;
                                }
                                featureMutation.mutate(payload);
                            }}
                        />
                    </section>
                </div>

                {/* SAĞ KOLON */}
                <div className="edit-column">
                    <section className="edit-section">
                        <h3>Ürün Görselleri</h3>

                        <ProductImageUploader
                            loading={uploadMutation.isLoading}
                            onUpload={(files) =>
                                uploadMutation.mutate(files)
                            }
                        />

                        {imagesLoading ? (
                            <p>Görseller yükleniyor...</p>
                        ) : (
                            <ProductImageGallery
                                images={images}
                                onDelete={(imageId) =>
                                    deleteImageMutation.mutate(imageId)
                                }
                                onSetCover={(imageId) =>
                                    setCoverMutation.mutate(imageId)
                                }
                            />

                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
