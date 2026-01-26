import Modal from 'react-modal';
import { FiX, FiUpload } from 'react-icons/fi';

const UploadSlideModal = ({ isOpen, title, selectedFile, uploading, onClose, onTitleChange, onFileChange, onUpload }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto outline-none"
            overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-slate-900">
                        Upload Slide
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700">
                        <FiX size={24} />
                    </button>
                </div>

                <p className="text-slate-600 mb-6">
                    Upload course materials to share with your students. Supported formats: PDF, PPT, PPTX, DOC, DOCX
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Slide Title (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Lecture 1: Introduction"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={title}
                            onChange={onTitleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Select File
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf,.ppt,.pptx,.doc,.docx"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={onFileChange}
                            />
                        </div>
                        {selectedFile && (
                            <p className="mt-2 text-sm text-slate-600">
                                Selected: {selectedFile.name}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={uploading}
                        className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                        Cancel
                    </button>
                    <button
                        onClick={onUpload}
                        disabled={!selectedFile || uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
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
                </div>
            </div>
        </Modal>
    );
};

export default UploadSlideModal;