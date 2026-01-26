import { FiChevronLeft, FiUser, FiUsers, FiCopy, FiUpload } from 'react-icons/fi';

const ClassHeader = ({ cls, isTeacher, students, onBack, onCopyJoinCode, onToggleStudents, onUploadSlide }) => {
    return (
        <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-600 hover:text-slate-900 mb-4 transition">
                    <FiChevronLeft size={20} />
                    <span className="ml-1">Back to classes</span>
                </button>

                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900">
                                {cls.title}
                            </h1>
                        </div>
                        <p className="text-slate-600 text-lg mb-4">
                            {cls.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <FiUser className="text-slate-500" />
                                <span className="text-slate-700">
                                    <strong>Teacher:</strong> {cls.teacher?.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiUsers className="text-slate-500" />
                                <span className="text-slate-700">
                                    <strong>Students:</strong> {cls.students?.length || 0}
                                </span>
                            </div>
                            {isTeacher && (
                                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                                    <span className="text-slate-700">
                                        <strong>Join Code:</strong>
                                    </span>
                                    <span className="font-mono text-blue-700">
                                        {cls.joinCode}
                                    </span>
                                    <button
                                        onClick={onCopyJoinCode}
                                        className="text-blue-600 hover:text-blue-700 ml-1">
                                        <FiCopy size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {isTeacher && (
                        <div className="flex gap-3">
                            <button
                                onClick={onToggleStudents}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition">
                                <FiUsers size={18} />
                                <span>Students</span>
                                <span className="bg-slate-700 text-white text-xs px-2 py-0.5 rounded-full">
                                    {students.length}
                                </span>
                            </button>
                            <button
                                onClick={onUploadSlide}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                <FiUpload size={18} />
                                <span>Upload Slide</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassHeader;