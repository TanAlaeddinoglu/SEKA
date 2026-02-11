import { useState } from "react";

import {useUsers} from "../hooks/useUsers.js";
import { useCreateUser } from "../hooks/useCreateUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useDeleteUser } from "../hooks/useDeleteUser";
import toast from "react-hot-toast";

import UserTable from "../components/UserTable";
import UserForm from "../components/UserFormModal.jsx";
import ConfirmModal from "../../../shared/components/ConfirmModal";

import "../styles/UserPage.css";

export default function AdminUsersPage() {
    const { data, isLoading, isError } = useUsers();

    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();
    const deleteMutation = useDeleteUser();

    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("create"); // create | edit
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);


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

    const openDeleteModal = (username) => {
        setDeleteTarget(username);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        if (deleteMutation.isLoading) return;
        setDeleteModalOpen(false);
        setDeleteTarget(null);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;

        deleteMutation.mutate(deleteTarget, {
            onSuccess: (message) => {
                toast.success(
                    message || "Kullanıcı silindi."
                );
            },
            onSettled: () => {
                setDeleteModalOpen(false);
                setDeleteTarget(null);
            },
        });
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
                onDelete={(username) => openDeleteModal(username)}
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

            <ConfirmModal
                open={deleteModalOpen}
                title="Kullanici Sil"
                message="Kullaniciyi Silmek IStiyormusunuz?"
                confirmText="Sil"
                cancelText="İptal"
                loadingText="Siliniyor..."
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal}
                loading={deleteMutation.isLoading}
                danger
            />
        </div>
    );
}
