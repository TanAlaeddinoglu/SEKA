import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import CategoryForm from "../components/CategoryForm";
import CategoryTable from "../components/CategoryTable";

export default function AdminCategoriesPage() {
    const { data = [], isLoading } = useCategories();
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const [editing, setEditing] = useState(null);

    if (isLoading) return <div>Loading...</div>;

    const handleSubmit = (payload) => {
        if (editing) {
            updateMutation.mutate({
                id: editing.id,
                data: payload,
            });
            setEditing(null);
        } else {
            createMutation.mutate(payload);
        }
    };



    return (
        <div style={{ display: "grid", gap: 24 }}>
            <h2>Kategoriler</h2>

            <CategoryForm
                initialData={editing}
                onSubmit={handleSubmit}
                loading={createMutation.isLoading || updateMutation.isLoading}
            />

            <CategoryTable
                data={data}
                onEdit={setEditing}
                onDelete={(id) => deleteMutation.mutate(id)}
            />
        </div>
    );
}
