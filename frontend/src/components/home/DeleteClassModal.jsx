import ConfirmationModal from "../ui/ConfirmationModal";

const DeleteClassModal = ({ isOpen, onClose, onConfirm, className, loading }) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Class"
      message={`Are you sure you want to delete "${className}"? This action cannot be undone and will delete all associated data.`}
      confirmText="Delete"
      cancelText="Cancel"
      type="danger"
      loading={loading}
    />
  );
};

export default DeleteClassModal;