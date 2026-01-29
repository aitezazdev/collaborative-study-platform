import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCopy, FiMoreVertical, FiUsers } from "react-icons/fi";

const TeacherClassCard = ({ cls, showMenu, setShowMenu, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Join code copied!");
  };

  const getStudentText = (count) => {
    if (count === 0) return "No students";
    if (count === 1) return "1 student";
    return `${count} students`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          onClick={() => navigate(`/class/${cls.slug}`)}
          className="flex-1 cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
            {cls.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {cls.description || "No description"}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(showMenu === cls._id ? null : cls._id)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <FiMoreVertical size={18} />
          </button>

          {showMenu === cls._id && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              <button
                onClick={() => onEdit(cls)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Edit Class
              </button>
              <button
                onClick={() => onDelete(cls)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                Delete Class
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
          Teacher
        </span>
        <span className="text-xs text-gray-500">
          {new Date(cls.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Join Code</p>
            <p className="text-base font-mono font-semibold text-gray-900">
              {cls.joinCode}
            </p>
          </div>
          <button
            onClick={() => copyCode(cls.joinCode)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded transition-colors">
            <FiCopy size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-600">
          <FiUsers size={16} />
          <span className="text-sm">{getStudentText(cls.students?.length || 0)}</span>
        </div>
        <button
          onClick={() => navigate(`/class/${cls.slug}`)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View Class →
        </button>
      </div>
    </div>
  );
};

export default TeacherClassCard;