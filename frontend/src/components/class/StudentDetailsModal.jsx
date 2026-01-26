import Modal from 'react-modal';
import { FiX, FiMail, FiUser } from 'react-icons/fi';

const StudentDetailsModal = ({ isOpen, student, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto outline-none"
            overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            {student && (
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-semibold text-slate-900">
                            Student Details
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-700">
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center mb-6">
                        {student.avatar ? (
                            <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-24 h-24 rounded-full object-cover mb-4"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-semibold mb-4">
                                {student.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h4 className="text-xl font-semibold text-slate-900 mb-1">
                            {student.name}
                        </h4>
                        {student.bio && (
                            <p className="text-slate-600 text-center text-sm">
                                {student.bio}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3 bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <FiMail className="text-slate-500" size={18} />
                            <div>
                                <p className="text-xs text-slate-500">Email</p>
                                <p className="text-sm text-slate-900">
                                    {student.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FiUser className="text-slate-500" size={18} />
                            <div>
                                <p className="text-xs text-slate-500">Role</p>
                                <p className="text-sm text-slate-900">Student</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default StudentDetailsModal;