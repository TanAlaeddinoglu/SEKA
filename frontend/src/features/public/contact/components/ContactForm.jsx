import { useEffect, useRef, useState } from "react";
import "../styles/ContactForm.css";

const RECAPTCHA_SCRIPT_ID = "recaptcha-v2-script";
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const loadRecaptchaScript = () =>
    new Promise((resolve, reject) => {
        if (typeof window === "undefined") {
            resolve();
            return;
        }

        if (window.grecaptcha?.render) {
            resolve();
            return;
        }

        const existing = document.getElementById(RECAPTCHA_SCRIPT_ID);
        if (existing) {
            const interval = setInterval(() => {
                if (window.grecaptcha?.render) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error("reCAPTCHA yüklenemedi."));
            }, 8000);
            return;
        }

        const script = document.createElement("script");
        script.id = RECAPTCHA_SCRIPT_ID;
        script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () =>
            reject(new Error("reCAPTCHA scripti yüklenemedi."));
        document.body.appendChild(script);
    });

export default function ContactForm() {
    const recaptchaRef = useRef(null);
    const recaptchaWidgetId = useRef(null);
    const [captchaToken, setCaptchaToken] = useState("");
    const [captchaError, setCaptchaError] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        type: "idle",
        message: "",
    });

    useEffect(() => {
        if (!siteKey) {
            setCaptchaError(
                "reCAPTCHA anahtarı bulunamadı. Lütfen ortam değişkenini ekleyin."
            );
            return undefined;
        }

        let isMounted = true;
        let widgetId = null;

        loadRecaptchaScript()
            .then(() => {
                if (!isMounted || !recaptchaRef.current) {
                    return;
                }

                if (!window.grecaptcha?.render) {
                    setCaptchaError(
                        "reCAPTCHA hazır değil. Lütfen sayfayı yenileyin."
                    );
                    return;
                }

                widgetId = window.grecaptcha.render(recaptchaRef.current, {
                    sitekey: siteKey,
                    callback: (token) => {
                        if (!isMounted) {
                            return;
                        }
                        setCaptchaToken(token);
                        setCaptchaError("");
                    },
                    "expired-callback": () => {
                        if (!isMounted) {
                            return;
                        }
                        setCaptchaToken("");
                    },
                    "error-callback": () => {
                        if (!isMounted) {
                            return;
                        }
                        setCaptchaError(
                            "Doğrulama sırasında hata oluştu. Lütfen tekrar deneyin."
                        );
                    },
                });
                recaptchaWidgetId.current = widgetId;
            })
            .catch(() => {
                if (!isMounted) {
                    return;
                }
                setCaptchaError(
                    "reCAPTCHA yüklenemedi. Lütfen bağlantınızı kontrol edin."
                );
            });

        return () => {
            isMounted = false;
            if (widgetId !== null && window.grecaptcha?.reset) {
                window.grecaptcha.reset(widgetId);
            }
        };
    }, [siteKey]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetCaptcha = () => {
        setCaptchaToken("");
        if (window.grecaptcha?.reset) {
            if (recaptchaWidgetId.current !== null) {
                window.grecaptcha.reset(recaptchaWidgetId.current);
            } else {
                window.grecaptcha.reset();
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitStatus({ type: "idle", message: "" });

        if (!captchaToken) {
            setSubmitStatus({
                type: "error",
                message: "Lütfen reCAPTCHA doğrulamasını tamamlayın.",
            });
            return;
        }

        if (
            !formData.fullName.trim() ||
            !formData.email.trim() ||
            !formData.message.trim()
        ) {
            setSubmitStatus({
                type: "error",
                message: "Lütfen gerekli alanları doldurun.",
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus({
            type: "success",
            message: "Mesajınız başarıyla gönderildi.",
        });
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            message: "",
        });
        resetCaptcha();
        setIsSubmitting(false);
    };

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            <h3 className="contact-form-title">Bize Ulaşın</h3>
            <div className="form-field">
                <label htmlFor="fullName">Ad Soyad</label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Ad Soyad"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor="email">E-posta</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="örnek@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor="phone">Telefon</label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="0 5xx xxx xx xx"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>

            <div className="form-field">
                <label htmlFor="message">Mesaj</label>
                <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Mesajınızı yazın"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="recaptcha-wrap">
                <div ref={recaptchaRef} className="recaptcha-box" />
                {captchaError ? (
                    <p className="recaptcha-error" role="status">
                        {captchaError}
                    </p>
                ) : (
                    !captchaToken && (
                        <p className="recaptcha-hint" role="status">
                            Lütfen “Ben robot değilim” doğrulamasını tamamlayın.
                        </p>
                    )
                )}
            </div>

            <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting || !captchaToken}
            >
                {isSubmitting ? "Gönderiliyor..." : "Gönder"}
            </button>
            {submitStatus.message && (
                <p className={`form-message ${submitStatus.type}`}>
                    {submitStatus.message}
                </p>
            )}
        </form>
    );
}
