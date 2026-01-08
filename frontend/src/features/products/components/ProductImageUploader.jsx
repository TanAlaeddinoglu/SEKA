import { useState } from "react";
import "../styles/ProductImageUploader.css";

export default function ProductImageUploader({
                                                 onUpload,
                                                 loading,
                                             }) {
    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        setFiles(Array.from(e.target.files));
    };
    const handleUpload = () => {
        console.log("UPLOAD CLICK");
        console.log("FILES:", files);

        if (!files.length) {
            console.log("DOSYA YOK");
            return;
        }

        onUpload(files);
        setFiles([]);
    };

    return (
        <div className="image-uploader">
            <label className="upload-label">
                Görsel Seç
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    hidden
                />
            </label>

            {files.length > 0 && (
                <p className="file-info">
                    {files.length} görsel seçildi
                </p>
            )}

            <button
                onClick={handleUpload}
                disabled={loading || !files.length}
            >
                {loading ? "Yükleniyor..." : "Yükle"}
            </button>
        </div>
    );
}
