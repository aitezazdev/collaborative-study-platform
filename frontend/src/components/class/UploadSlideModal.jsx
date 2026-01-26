import Modal from "react-modal";
import { FiUpload } from "react-icons/fi";

const UploadSlideModal = ({
  isOpen,
  title,
  selectedFile,
  uploading,
  onClose,
  onTitleChange,
  onFileChange,
  onUpload,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-800">Upload Slide</h2>
          <p className="text-sm text-gray-500 mt-1">
            Share course materials with your students
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="slideTitle"
              className="text-sm font-medium text-gray-700">
              Slide Title
            </label>
            <input
              type="text"
              id="slideTitle"
              autoComplete="off"
              placeholder="e.g., Lecture 1: Introduction"
              className="outline-none px-3 py-2.5 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              value={title}
              onChange={onTitleChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="slideFile"
              className="text-sm font-medium text-gray-700">
              Select File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="slideFile"
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              className="outline-none px-3 py-2.5 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer"
              onChange={onFileChange}
            />
            {selectedFile && (
              <p className="text-xs text-gray-600 mt-1">
                Selected:{" "}
                <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Supported: PDF, PPT, PPTX, DOC, DOCX
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onUpload}
            disabled={!selectedFile || uploading}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white font-medium rounded-lg transition-all ${
              !selectedFile || uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}>
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FiUpload size={18} />
                <span>Upload</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadSlideModal;
