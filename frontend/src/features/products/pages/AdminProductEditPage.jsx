import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ProductForm from "../components/ProductForm";
import { useProduct } from "../hooks/useProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import ProductFeatureForm from "../components/ProductFeatureForm";
import { useUpdateProductFeature } from "../hooks/useUpdateProductFeature";
import { useCreateProductFeature } from "../hooks/useCreateProductFeature";
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
    const [showFeatureForm, setShowFeatureForm] = useState(false);
    const queryClient = useQueryClient();

    const updateMutation = useUpdateProduct(id);
    const featureMutation = useUpdateProductFeature(feature?.id);
    const createFeatureMutation = useCreateProductFeature();

    const { data: images, isLoading: imagesLoading } =
        useProductImages(id);

    const uploadMutation = useUploadProductImages(id);
    const deleteImageMutation = useDeleteProductImage(id);
    const setCoverMutation = useSetCoverImage(id);


    useEffect(() => {
        if (feature?.id) {
            setShowFeatureForm(true);
        }
    }, [feature?.id]);

    if (isLoading) return <p>Yükleniyor...</p>;

    const handleSubmit = (payload) => {
        updateMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Ürün güncellendi.");
                navigate("/admin/products");
            },
        });
    };

    const handleFeatureSubmit = (payload) => {
        if (!feature?.id) {
            createFeatureMutation.mutate(
                { ...payload, productId: Number(id) },
                {
                    onSuccess: () => {
                        setShowFeatureForm(true);
                        queryClient.invalidateQueries(["product", id]);
                        toast.success("Ürün özellikleri eklendi.");
                    },
                }
            );
            return;
        }

        featureMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Ürün özellikleri güncellendi.");
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
                        {!feature?.id && !showFeatureForm && (
                            <div className="feature-empty">
                                <p className="step-info">
                                    Bu ürün için özellik yok.
                                </p>
                                <button
                                    className="add-feature-button"
                                    type="button"
                                    onClick={() => setShowFeatureForm(true)}
                                >
                                    Ekle
                                </button>
                            </div>
                        )}
                        {(feature?.id || showFeatureForm) && (
                            <ProductFeatureForm
                                initialData={feature}
                                loading={
                                    featureMutation.isLoading ||
                                    createFeatureMutation.isLoading
                                }
                                onSubmit={handleFeatureSubmit}
                            />
                        )}
                    </section>
                </div>

                {/* SAĞ KOLON */}
                <div className="edit-column">
                    <section className="edit-section">
                        <h3>Ürün Görselleri</h3>

                        <ProductImageUploader
                            loading={uploadMutation.isLoading}
                            onUpload={(files) =>
                                uploadMutation.mutate(files, {
                                    onSuccess: () => {
                                        toast.success("Görseller yüklendi.");
                                    },
                                })
                            }
                        />

                        {imagesLoading ? (
                            <p>Görseller yükleniyor...</p>
                        ) : (
                            <ProductImageGallery
                                images={images}
                                onDelete={(imageId) =>
                                    deleteImageMutation.mutate(imageId, {
                                        onSuccess: () => {
                                            toast.success("Görsel silindi.");
                                        },
                                    })
                                }
                                onSetCover={(imageId) =>
                                    setCoverMutation.mutate(imageId, {
                                        onSuccess: () => {
                                            toast.success("Kapak görseli güncellendi.");
                                        },
                                    })
                                }
                            />

                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
