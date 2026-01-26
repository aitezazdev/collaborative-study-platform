import Modal from "react-modal";

const EditClassModal = ({ isOpen, onClose, formData, onChange, onSave, loading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-800">Edit Class</h2>
          <p className="text-sm text-gray-500 mt-1">Update class information</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              className="outline-none px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={4}
              className="outline-none px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onSave}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-white font-medium rounded-lg transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditClassModal;