import "../styles/AboutSection.css";

export default function AboutSection({
    title = "Hakkımızda",
    text =
        "Ambalaj alanında yenilikçi ve güvenilir çözümler sunuyoruz. Kalite, süreklilik ve müşteri memnuniyeti odaklı çalışıyoruz.",
    imageAlt = "Hakkımızda görseli",
    imageSrc,
    imageWidth = 480,
    imageHeight = 360,
}) {
    const normalizedText = text.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n");
    const paragraphs = normalizedText.split(/\r?\n/);

    return (
        <section className="about-section">
            <div className="about-content">
                <h2>{title}</h2>
                {paragraphs.map((paragraph, index) =>
                    paragraph.trim() ? (
                        <p key={index}>{paragraph.trim()}</p>
                    ) : (
                        <div key={index} className="paragraph-spacer" />
                    )
                )}
            </div>
            <div className="about-image">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        width={imageWidth}
                        height={imageHeight}
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="image-placeholder">Görsel eklenecek</div>
                )}
            </div>
        </section>
    );
}
