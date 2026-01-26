import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserClasses, deleteClass, updateClass } from "../api/classApi";
import { FiCopy, FiMoreVertical } from "react-icons/fi";
import Modal from "react-modal";

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

  const navigate = useNavigate();

  const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

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

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Join code copied!");
  };

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
    <>
      {teacherClasses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Teaching
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherClasses.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition relative">
                
                {/* Three Dot Menu */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setShowMenu(showMenu === cls._id ? null : cls._id)}
                    className="text-slate-600 hover:text-slate-900 p-1">
                    <FiMoreVertical size={20} />
                  </button>
                  
                  {showMenu === cls._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                      <button
                        onClick={() => handleEditClick(cls)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 rounded-t-lg">
                        Edit Class
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cls)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-red-600 rounded-b-lg">
                        Delete Class
                      </button>
                    </div>
                  )}
                </div>

                <h3
                  onClick={() =>
                    navigate(`/class/${cls._id}/${slugify(cls.title)}`)
                  }
                  className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer mb-2 pr-8">
                  {cls.title}
                </h3>

                <p className="text-sm text-slate-600 mb-4">{cls.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Teacher
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(cls.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded border">
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1">Join Code</p>
                    <span className="text-sm font-mono text-slate-900">
                      {cls.joinCode}
                    </span>
                  </div>

                  <button
                    onClick={() => copyCode(cls.joinCode)}
                    className="text-blue-600 hover:text-blue-700">
                    <FiCopy size={18} />
                  </button>
                </div>

                <p className="text-sm text-slate-700">
                  <span className="font-medium">Students:</span>{" "}
                  {cls.students?.length || 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {studentClasses.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Enrolled
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentClasses.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition">
                <h3
                  onClick={() =>
                    navigate(`/class/${cls._id}/${slugify(cls.title)}`)
                  }
                  className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer mb-2">
                  {cls.title}
                </h3>

                <p className="text-sm text-slate-600 mb-4">{cls.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Student
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(cls.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-slate-700 mb-1">
                  <span className="font-medium">Teacher:</span>{" "}
                  {cls.teacher?.name}
                </p>

                <p className="text-sm text-slate-700">
                  <span className="font-medium">Students:</span>{" "}
                  {cls.students?.length || 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {teacherClasses.length === 0 && studentClasses.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500">
            No classes yet. Create or join a class to get started.
          </p>
        </div>
      )}

      <Modal
        isOpen={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
        className="bg-white p-6 rounded-lg shadow-lg w-100 max-w-md mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <h2 className="text-xl font-semibold mb-4">Edit Class</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="outline-none px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="outline-none px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleUpdateClass}
            disabled={loading}
            className={`px-4 py-2 text-white rounded transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed opacity-70"
                : "bg-blue-500 hover:bg-blue-600"
            }`}>
            {loading ? "Updating..." : "Save"}
          </button>
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600">
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        className="bg-white p-6 rounded-lg shadow-lg w-100 max-w-md mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <h2 className="text-xl font-semibold mb-4">Delete Class</h2>
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete "<span className="font-semibold">{selectedClass?.title}</span>"? 
          This action cannot be undone and will delete all associated data.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleDeleteClass}
            disabled={loading}
            className={`px-4 py-2 text-white rounded transition ${
              loading
                ? "bg-red-400 cursor-not-allowed opacity-70"
                : "bg-red-500 hover:bg-red-600"
            }`}>
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600">
            Cancel
          </button>
        </div>
      </Modal>

      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(null)}
        />
      )}
    </>
  );
};

export default HomePage;