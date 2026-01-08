import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null); // success | error

    const createProductMutation = useCreateProduct();
    const createFeatureMutation = useCreateProductFeature();
    const updateFeatureMutation = useUpdateProductFeature(featureId);

    const { data: images } = useProductImages(productId);
    const uploadMutation = useUploadProductImages(productId);

    /* ÜRÜN OLUŞTUR */
    const handleCreateProduct = (payload) => {
        setMessage(null);

        createProductMutation.mutate(payload, {
            onSuccess: (createdProduct) => {
                setProductId(createdProduct.id);
                setMessage("Ürün başarıyla oluşturuldu.");
                setMessageType("success");
            },
            onError: () => {
                setMessage("Ürün oluşturulurken hata oluştu.");
                setMessageType("error");
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
                        setMessage("Ürün özellikleri kaydedildi.");
                        setMessageType("success");
                    },
                    onError: () => {
                        setMessage("Özellikler kaydedilemedi.");
                        setMessageType("error");
                    },
                }
            );
        } else {
            updateFeatureMutation.mutate(payload, {
                onSuccess: () => {
                    setMessage("Ürün özellikleri güncellendi.");
                    setMessageType("success");
                },
            });
        }
    };

    /* TÜM SÜREÇ TAMAMLANDI */
    useEffect(() => {
        if (productId && featureId && images?.length > 0) {
            setMessage("Ürün tamamen kaydedildi. Yönlendiriliyorsunuz...");
            setMessageType("success");

            const t = setTimeout(() => {
                navigate("/admin/products");
            }, 2000);

            return () => clearTimeout(t);
        }
    }, [productId, featureId, images, navigate]);

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

            {/* GLOBAL MESSAGE */}
            {message && (
                <div className={`alert ${messageType}`}>
                    {message}
                </div>
            )}

            {/* ADIM 1 */}
            <section className="create-section">
                <h3>1. Ürün Bilgileri</h3>
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
                className={`create-section ${!productId ? "disabled" : ""}`}
            >
                <h3>2. Ürün Özellikleri</h3>

                {!productId && (
                    <p className="step-info">
                        Özellik eklemek için önce ürünü oluşturmalısınız.
                    </p>
                )}

                {productId && (
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
                className={`create-section ${!productId ? "disabled" : ""}`}
            >
                <h3>3. Ürün Görselleri</h3>

                {!productId && (
                    <p className="step-info">
                        Görsel eklemek için önce ürünü oluşturmalısınız.
                    </p>
                )}

                {productId && (
                    <>
                        <ProductImageUploader
                            loading={uploadMutation.isLoading}
                            onUpload={(files) =>
                                uploadMutation.mutate(files)
                            }
                        />

                        <ProductImageGallery images={images || []} />
                    </>
                )}
            </section>
        </div>
    );
}
