import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CreateClass from "../components/ui/CreateClass";
import JoinClass from "../components/ui/JoinClass";
import { fetchUserClasses } from "../api/classApi";
import { FiCopy } from "react-icons/fi";

const HomePage = () => {
  const [classes, setClasses] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  const reduxUser = useSelector((state) => state.auth.user);
  const localUser = JSON.parse(localStorage.getItem("user"));
  const user = reduxUser || localUser;

  const navigate = useNavigate();

  const slugify = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  useEffect(() => {
    const getUserClasses = async () => {
      try {
        const data = await fetchUserClasses();
        setClasses(data.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    getUserClasses();
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Join code copied!");
  };

  const currentUserId = user?._id || user?.id;

  const teacherClasses = [];
  const studentClasses = [];

  if (Array.isArray(classes)) {
    classes.forEach((cls) => {
      const teacherId = cls.teacher?._id || cls.teacher?.id;
      const isTeacher = teacherId === currentUserId;

      const isStudent =
        cls.students?.some(
          (student) => (student._id || student.id) === currentUserId
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
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition"
              >
                <h3
                  onClick={() =>
                    navigate(`/class/${cls._id}/${slugify(cls.title)}`)
                  }
                  className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer mb-2"
                >
                  {cls.title}
                </h3>

                <p className="text-sm text-slate-600 mb-4">
                  {cls.description}
                </p>

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
                    className="text-blue-600 hover:text-blue-700"
                  >
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
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition"
              >
                <h3
                  onClick={() =>
                    navigate(`/class/${cls._id}/${slugify(cls.title)}`)
                  }
                  className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer mb-2"
                >
                  {cls.title}
                </h3>

                <p className="text-sm text-slate-600 mb-4">
                  {cls.description}
                </p>

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

      {activeModal === "create" && (
        <CreateClass handle={() => setActiveModal(null)} />
      )}
      {activeModal === "join" && (
        <JoinClass handle={() => setActiveModal(null)} />
      )}
    </>
  );
};

export default HomePage;
