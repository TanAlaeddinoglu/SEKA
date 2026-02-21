import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {parseApiError} from "../../../../shared/utils/errorParser";
import {useSendContactMail} from "../hooks/useSendContactMail";
import "../styles/ContactForm.css";

const RECAPTCHA_SCRIPT_ID = "recaptcha-v2-script";
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const MAX_FULL_NAME_LENGTH = 60;
const MIN_FULL_NAME_LENGTH = 2;
const MAX_EMAIL_LENGTH = 80;
const MAX_PHONE_LENGTH = 14;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 3000;
const PHONE_PATTERN = /^[0-9+()\-\s]*$/;
let recaptchaLoadPromise = null;

const waitForRecaptchaReady = (timeoutMs = 10000) =>
    new Promise((resolve, reject) => {
        if (window.grecaptcha?.render) {
            resolve();
            return;
        }

        const start = Date.now();
        const interval = setInterval(() => {
            if (window.grecaptcha?.render) {
                clearInterval(interval);
                resolve();
                return;
            }

            if (Date.now() - start >= timeoutMs) {
                clearInterval(interval);
                reject(new Error("reCAPTCHA yüklenemedi."));
            }
        }, 100);
    });

const loadRecaptchaScript = () => {
    if (typeof window === "undefined") {
        return Promise.resolve();
    }

    if (window.grecaptcha?.render) {
        return Promise.resolve();
    }

    if (recaptchaLoadPromise) {
        return recaptchaLoadPromise;
    }

    recaptchaLoadPromise = new Promise((resolve, reject) => {
        const existing = document.getElementById(RECAPTCHA_SCRIPT_ID);
        if (existing) {
            waitForRecaptchaReady().then(resolve).catch(reject);
            return;
        }

        const script = document.createElement("script");
        script.id = RECAPTCHA_SCRIPT_ID;
        script.src =
            "https://www.google.com/recaptcha/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () =>
            waitForRecaptchaReady().then(resolve).catch(reject);
        script.onerror = () =>
            reject(new Error("reCAPTCHA scripti yüklenemedi."));
        document.body.appendChild(script);
    }).finally(() => {
        if (!window.grecaptcha?.render) {
            recaptchaLoadPromise = null;
        }
    });

    return recaptchaLoadPromise;
};

export default function ContactForm() {
    const sendContactMail = useSendContactMail();
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitStatus({ type: "idle", message: "" });

        const fullName = formData.fullName.trim();
        const email = formData.email.trim();
        const phone = formData.phone.trim();
        const message = formData.message.trim();

        if (!captchaToken) {
            setSubmitStatus({
                type: "error",
                message: "Lütfen reCAPTCHA doğrulamasını tamamlayın.",
            });
            return;
        }

        if (!fullName || !email || !message) {
            setSubmitStatus({
                type: "error",
                message: "Lütfen gerekli alanları doldurun.",
            });
            return;
        }

        if (
            fullName.length < MIN_FULL_NAME_LENGTH ||
            fullName.length > MAX_FULL_NAME_LENGTH
        ) {
            setSubmitStatus({
                type: "error",
                message: "Ad soyad 2 ile 60 karakter arasında olmalı.",
            });
            return;
        }

        if (email.length > MAX_EMAIL_LENGTH) {
            setSubmitStatus({
                type: "error",
                message: "E-posta en fazla 80 karakter olabilir.",
            });
            return;
        }

        if (phone.length > MAX_PHONE_LENGTH) {
            setSubmitStatus({
                type: "error",
                message: "Telefon en fazla 14 karakter olabilir.",
            });
            return;
        }

        if (phone && !PHONE_PATTERN.test(phone)) {
            setSubmitStatus({
                type: "error",
                message: "Telefon formatı geçersiz.",
            });
            return;
        }

        if (
            message.length < MIN_MESSAGE_LENGTH ||
            message.length > MAX_MESSAGE_LENGTH
        ) {
            setSubmitStatus({
                type: "error",
                message: "Mesaj 10 ile 3000 karakter arasında olmalı.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await sendContactMail.mutateAsync({
                fullName,
                email,
                phone,
                message,
            });
            const successMessage =
                response?.message || "Mesajınız başarıyla gönderildi.";

            setSubmitStatus({
                type: "success",
                message: successMessage,
            });
            toast.success(successMessage);
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                message: "",
            });
            resetCaptcha();
        } catch (error) {
            const errorMessage = parseApiError(error);
            toast.error(errorMessage);
            setSubmitStatus({
                type: "error",
                message: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
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
                    minLength={MIN_FULL_NAME_LENGTH}
                    maxLength={MAX_FULL_NAME_LENGTH}
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
                    maxLength={MAX_EMAIL_LENGTH}
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
                    maxLength={MAX_PHONE_LENGTH}
                    pattern="[0-9+()\\-\\s]*"
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
                    minLength={MIN_MESSAGE_LENGTH}
                    maxLength={MAX_MESSAGE_LENGTH}
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
