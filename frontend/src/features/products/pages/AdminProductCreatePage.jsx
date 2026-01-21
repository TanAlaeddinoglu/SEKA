import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ProductForm from "../components/ProductForm";
import ProductFeatureForm from "../components/ProductFeatureForm";
import ProductImageUploader from "../components/ProductImageUploader";
import ProductImageGallery from "../components/ProductImageGallery";

import { useCreateProduct } from "../hooks/useCreateProduct";
import { useCreateProductFeature } from "../hooks/useCreateProductFeature";
import { useUpdateProductFeature } from "../hooks/useUpdateProductFeature";
import { useProductImages } from "../hooks/useProductImages";
import { useUploadProductImages } from "../hooks/useUploadProductImages";

import "../styles/ProductCreatePage.css";

export default function AdminProductCreatePage() {
    const navigate = useNavigate();

    const [productId, setProductId] = useState(null);
    const [featureId, setFeatureId] = useState(null);
    const [featureSkipped, setFeatureSkipped] = useState(false);
    const [imagesSkipped, setImagesSkipped] = useState(false);
    const [finalToastShown, setFinalToastShown] = useState(false);

    const createProductMutation = useCreateProduct();
    const createFeatureMutation = useCreateProductFeature();
    const updateFeatureMutation = useUpdateProductFeature(featureId);

    const { data: images } = useProductImages(productId);
    const uploadMutation = useUploadProductImages(productId);

    const featureCompleted = Boolean(featureId || featureSkipped);
    const imagesCompleted = Boolean(
        (images && images.length > 0) || imagesSkipped
    );

    /* ÜRÜN OLUŞTUR */
    const handleCreateProduct = (payload) => {
        createProductMutation.mutate(payload, {
            onSuccess: (createdProduct) => {
                setProductId(createdProduct.id);
                setFeatureId(null);
                setFeatureSkipped(false);
                setImagesSkipped(false);
                setFinalToastShown(false);
                toast.success("Ürün başarıyla oluşturuldu.");
            },
        });
    };

    /* FEATURE SUBMIT */
    const handleFeatureSubmit = (payload) => {
        if (!productId) return;

        if (!featureId) {
            createFeatureMutation.mutate(
                { ...payload, productId },
                {
                    onSuccess: (res) => {
                        setFeatureId(res.id);
                        setFeatureSkipped(false);
                        toast.success("Ürün özellikleri kaydedildi.");
                    },
                }
            );
        } else {
            updateFeatureMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Ürün özellikleri güncellendi.");
                },
            });
        }
    };

    /* TÜM SÜREÇ TAMAMLANDI */
    useEffect(() => {
        if (
            productId &&
            featureCompleted &&
            imagesCompleted &&
            !finalToastShown
        ) {
            toast("Tüm adımlar tamamlandı. Ürün kaydı hazır.");
            setFinalToastShown(true);
        }
    }, [
        productId,
        featureCompleted,
        imagesCompleted,
        finalToastShown,
    ]);

    return (
        <div className="product-create-page">
            {/* HEADER */}
            <div className="page-header">
                <h2>Yeni Ürün Oluştur</h2>

                <button
                    className="back-button"
                    onClick={() => navigate("/admin/products")}
                >
                    ← Ürünlere Dön
                </button>
            </div>

            {/* ADIM 1 */}
            <section className="create-section">
                <div className="section-header">
                    <h3>1. Ürün Bilgileri</h3>
                </div>
                <p className="step-info">
                    Öncelikle ürünün temel bilgilerini ve kategorisini oluşturun.
                </p>

                <ProductForm
                    onSubmit={handleCreateProduct}
                    loading={createProductMutation.isLoading}
                />
            </section>

            {/* ADIM 2 */}
            <section
                className={`create-section ${
                    !productId || featureSkipped ? "disabled" : ""
                }`}
            >
                <div className="section-header">
                    <h3>2. Ürün Özellikleri</h3>
                    <button
                        className="skip-button"
                        type="button"
                        disabled={!productId || featureCompleted}
                        onClick={() => {
                            setFeatureSkipped(true);
                            toast("Ürün özellikleri adımı atlandı.");
                        }}
                    >
                        Atla
                    </button>
                </div>

                {!productId && (
                    <p className="step-info">
                        Özellik eklemek için önce ürünü oluşturmalısınız.
                    </p>
                )}

                {productId && featureSkipped && (
                    <p className="step-info">
                        Bu adım atlandı. Sonraki adıma geçebilirsiniz.
                    </p>
                )}

                {productId && !featureSkipped && (
                    <ProductFeatureForm
                        onSubmit={handleFeatureSubmit}
                        loading={
                            createFeatureMutation.isLoading ||
                            updateFeatureMutation.isLoading
                        }
                    />
                )}
            </section>

            {/* ADIM 3 */}
            <section
                className={`create-section ${
                    !productId || !featureCompleted || imagesSkipped
                        ? "disabled"
                        : ""
                }`}
            >
                <div className="section-header">
                    <h3>3. Ürün Görselleri</h3>
                    <button
                        className="skip-button"
                        type="button"
                        disabled={!productId || !featureCompleted || imagesCompleted}
                        onClick={() => {
                            setImagesSkipped(true);
                            toast("Görsel yükleme adımı atlandı.");
                        }}
                    >
                        Atla
                    </button>
                </div>

                {!productId && (
                    <p className="step-info">
                        Görsel eklemek için önce ürünü oluşturmalısınız.
                    </p>
                )}

                {productId && !featureCompleted && (
                    <p className="step-info">
                        Görsel eklemek için önce özellik adımını tamamlamalısınız.
                    </p>
                )}

                {productId && featureCompleted && imagesSkipped && (
                    <p className="step-info">
                        Bu adım atlandı. Ürün oluşturma tamamlandı.
                    </p>
                )}

                {productId && featureCompleted && !imagesSkipped && (
                    <>
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

                        <ProductImageGallery images={images || []} />
                    </>
                )}
            </section>

            {productId && featureCompleted && imagesCompleted && (
                <div className="final-actions">
                    <button
                        className="back-button"
                        onClick={() => navigate("/admin/products")}
                    >
                        Geri Dön
                    </button>
                </div>
            )}
        </div>
    );
}
