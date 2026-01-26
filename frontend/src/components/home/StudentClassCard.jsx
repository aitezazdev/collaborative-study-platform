import { useNavigate } from "react-router-dom";

const StudentClassCard = ({ cls }) => {
  const navigate = useNavigate();

  const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const getStudentText = (count) => {
    if (count === 0) return "No students";
    if (count === 1) return "1 student";
    return `${count} students`;
  };

  return (
    <div
      onClick={() => navigate(`/class/${cls._id}/${slugify(cls.title)}`)}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
          {cls.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {cls.description || "No description"}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
          Student
        </span>
        <span className="text-xs text-gray-500">
          {new Date(cls.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Teacher</span>
          <span className="font-medium text-gray-900">{cls.teacher?.name}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Students</span>
          <span className="font-medium text-gray-900">{getStudentText(cls.students?.length || 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentClassCard;