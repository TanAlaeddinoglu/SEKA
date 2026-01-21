import { useState } from "react";

import {useUsers} from "../hooks/useUsers.js";
import { useCreateUser } from "../hooks/useCreateUser";
import { useUpdateUser } from "../hooks/useUpdateUser";

import UserTable from "../components/UserTable";
import UserForm from "../components/UserFormModal.jsx";

import "../styles/UserPage.css";

export default function AdminUsersPage() {
    const { data, isLoading, isError } = useUsers();

    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();

    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("create"); // create | edit
    const [selectedUser, setSelectedUser] = useState(null);


    const openCreateModal = () => {
        setMode("create");
        setSelectedUser(null);
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setMode("edit");
        setSelectedUser(user);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };

    const handleSubmit = (payload, username) => {
        if (mode === "create") {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    closeModal();
                },
            });
        }

        if (mode === "edit") {
            updateMutation.mutate(
                { username, payload },
                {
                    onSuccess: () => {
                        closeModal();
                    },
                }
            );
        }
    };

    if (isLoading) return <p>Yükleniyor...</p>;
    if (isError) return <p>Kullanıcılar yüklenemedi.</p>;

    return (
        <div className="admin-users-page">
            {/* HEADER */}
            <div className="page-header">
                <h2>Kullanıcılar</h2>

                <button
                    className="add-user-btn"
                    onClick={openCreateModal}
                >
                    + Kullanıcı Ekle
                </button>
            </div>

            {/* TABLE */}
            <UserTable
                users={data}
                onEdit={(user) => openEditModal(user)}
                onDelete={(username) => {
                    alert(
                        "Silme işlemini bir sonraki adımda ekleyeceğiz"
                    );
                }}
            />

            {/* MODAL */}
            <UserForm
                open={modalOpen}
                mode={mode}
                initialData={selectedUser}
                onClose={closeModal}
                onSubmit={handleSubmit}
                loading={
                    createMutation.isLoading ||
                    updateMutation.isLoading
                }
            />
        </div>
    );
}
