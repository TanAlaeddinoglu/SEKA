export const UNIT_TYPE_LABELS = {
    PIECE: "Adet",
    MILLILITER: "Mililitre",
    LITER: "Litre",
    BOX: "Kutu",
    CARTON: "Koli",
};

export function getUnitTypeLabel(unitType) {
    return UNIT_TYPE_LABELS[unitType] || "-";
}
