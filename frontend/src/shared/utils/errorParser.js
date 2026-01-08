export function parseApiError(error) {
    // Axios error değilse
    if (!error?.response) {
        return "Sunucuya ulaşılamıyor.";
    }

    const data = error.response.data;

    // 1️⃣ Backend message (SENİN FORMATIN)
    if (data?.message) {
        return data.message;
    }

    // 2️⃣ Validation benzeri object
    if (data?.errors && typeof data.errors === "object") {
        return Object.values(data.errors).join("\n");
    }

    // 3️⃣ Generic error alanı
    if (data?.error) {
        return data.error;
    }

    // 4️⃣ HTTP status bazlı fallback
    switch (error.response.status) {
        case 401:
            return "Oturum süresi doldu. Lütfen tekrar giriş yapın.";
        case 403:
            return "Bu işlem için yetkiniz yok.";
        case 404:
            return "Kayıt bulunamadı.";
        case 409:
            return "Bu kayıt başka verilerle ilişkili olduğu için silinemiyor.";
        case 500:
            return "Sunucu hatası oluştu.";
        default:
            return "Beklenmeyen bir hata oluştu.";
    }
}
