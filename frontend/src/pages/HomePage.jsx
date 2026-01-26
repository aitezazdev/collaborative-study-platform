import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserClasses, deleteClass, updateClass } from "../api/classApi";
import { FiBook } from "react-icons/fi";
import ClassSection from "../components/home/ClassSection";
import EditClassModal from "../components/home/EditClassModal";
import DeleteClassModal from "../components/home/DeleteClassModal";
import EmptyState from "../components/home/EmptyState";

const HomePage = () => {
  const [classes, setClasses] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const { refreshTrigger } = useOutletContext();
  const reduxUser = useSelector((state) => state.auth.user);
  const localUser = JSON.parse(localStorage.getItem("user"));
  const user = reduxUser || localUser;

  const getUserClasses = async () => {
    try {
      const data = await fetchUserClasses();
      setClasses(data.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    getUserClasses();
  }, [refreshTrigger]);

  const handleEditClick = (cls) => {
    setSelectedClass(cls);
    setFormData({
      title: cls.title || "",
      description: cls.description || "",
    });
    setShowEditModal(true);
    setShowMenu(null);
  };

  const handleDeleteClick = (cls) => {
    setSelectedClass(cls);
    setShowDeleteModal(true);
    setShowMenu(null);
  };

  const handleUpdateClass = async () => {
    try {
      setLoading(true);
      const res = await updateClass(selectedClass._id, formData);
      if (res.success) {
        toast.success("Class updated successfully");
        getUserClasses();
        setShowEditModal(false);
      } else {
        toast.error(res.message || "Failed to update class");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async () => {
    try {
      setLoading(true);
      const res = await deleteClass(selectedClass._id);
      if (res.success) {
        toast.success("Class deleted successfully");
        getUserClasses();
        setShowDeleteModal(false);
      } else {
        toast.error(res.message || "Failed to delete class");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const currentUserId = user?._id || user?.id;

  const teacherClasses = [];
  const studentClasses = [];

  if (Array.isArray(classes)) {
    classes.forEach((cls) => {
      const teacherId = cls.teacher?._id || cls.teacher?.id;
      const isTeacher = teacherId === currentUserId;

      const isStudent = cls.students?.some(
        (student) => (student._id || student.id) === currentUserId,
      );

      if (isTeacher) teacherClasses.push(cls);
      else if (isStudent) studentClasses.push(cls);
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">My Classes</h1>
          <p className="text-gray-600">Manage and organize your classes</p>
        </div>

        {teacherClasses.length > 0 && (
          <ClassSection
            title="Teaching"
            icon={FiBook}
            classes={teacherClasses}
            type="teacher"
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}

        {studentClasses.length > 0 && (
          <ClassSection
            title="Enrolled"
            icon={FiBook}
            classes={studentClasses}
            type="student"
          />
        )}

        {teacherClasses.length === 0 && studentClasses.length === 0 && (
          <EmptyState />
        )}
      </div>

      <EditClassModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        formData={formData}
        onChange={handleChange}
        onSave={handleUpdateClass}
        loading={loading}
      />

      <DeleteClassModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteClass}
        className={selectedClass?.title}
        loading={loading}
      />

      {showMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowMenu(null)} />
      )}
    </div>
  );
};

export default HomePage;