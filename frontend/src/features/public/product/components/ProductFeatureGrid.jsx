import { getUnitTypeLabel } from "../../../products/constants/unitTypeLabels";

const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "-";
    }
    return value;
};

export default function ProductFeatureGrid({ feature }) {
    return (
        <div className="product-feature-card">
            <h3>Ürün Özellikleri</h3>
            <div className="product-feature-grid">
                <div className="feature-row">
                    <span>Ünite Tipi</span>
                    <strong>
                        {feature?.unitType
                            ? getUnitTypeLabel(feature.unitType)
                            : "-"}
                    </strong>
                </div>
                <div className="feature-row">
                    <span>Paket Adedi</span>
                    <strong>{formatValue(feature?.unitPerPack)}</strong>
                </div>
                <div className="feature-row">
                    <span>Koli Adedi</span>
                    <strong>{formatValue(feature?.unitPerCarton)}</strong>
                </div>
                <div className="feature-row">
                    <span>Renk</span>
                    <strong>{formatValue(feature?.color)}</strong>
                </div>
                <div className="feature-row">
                    <span>Boyut</span>
                    <strong>{formatValue(feature?.size)}</strong>
                </div>
                <div className="feature-row">
                    <span>Ağırlık</span>
                    <strong>{formatValue(feature?.weight)}</strong>
                </div>
            </div>
        </div>
    );
}
