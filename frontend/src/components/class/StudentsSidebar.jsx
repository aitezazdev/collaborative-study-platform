import { FiUsers, FiX } from 'react-icons/fi';

const StudentsSidebar = ({ isOpen, students, loading, onClose, onStudentClick }) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                onClick={onClose}
            />
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <FiUsers className="text-blue-600" size={24} />
                            <h3 className="text-xl font-semibold text-slate-900">
                                Students
                            </h3>
                            <span className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full">
                                {students.length}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-700">
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : students.length === 0 ? (
                            <div className="text-center py-8">
                                <FiUsers className="mx-auto text-slate-300 mb-3" size={48} />
                                <p className="text-slate-500">No students enrolled yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {students.map((student) => (
                                    <div
                                        key={student._id || student.id}
                                        onClick={() => onStudentClick(student)}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition border border-slate-200">
                                        {student.avatar ? (
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                {student.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">
                                                {student.name}
                                            </p>
                                            <p className="text-sm text-slate-500 truncate">
                                                {student.email}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentsSidebar;