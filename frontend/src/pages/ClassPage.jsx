import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchUserClasses, fetchClassStudents } from "../api/classApi";
import { uploadSlide } from "../api/slideApi";
import { toast } from "react-toastify";
import Slides from "../components/Slides";
import ClassHeader from "../components/class/ClassHeader";
import StudentsSidebar from "../components/class/StudentsSidebar";
import UploadSlideModal from "../components/class/UploadSlideModal";
import StudentDetailsModal from "../components/class/StudentDetailsModal";

const ClassPage = () => {
    const { classId } = useParams();

    const [cls, setCls] = useState(null);
    const [students, setStudents] = useState([]);
    const [isTeacher, setIsTeacher] = useState(false);
    const [showStudentsSidebar, setShowStudentsSidebar] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [title, setTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const reduxUser = useSelector((state) => state.auth.user);
    const localUser = JSON.parse(localStorage.getItem("user"));
    const user = reduxUser || localUser;

    const currentUserId = user?._id || user?.id;

    useEffect(() => {
        const loadClass = async () => {
            const res = await fetchUserClasses();
            const found = res.data.find((c) => c._id === classId);
            setCls(found);
        };
        loadClass();
    }, [classId]);

    useEffect(() => {
        if (!cls || !user) return;

        const teacherId = cls.teacher?._id || cls.teacher?.id;
        const teacherStatus = teacherId === currentUserId;
        setIsTeacher(teacherStatus);

        if (teacherStatus) {
            loadStudents();
        }
    }, [cls, currentUserId]);

    const loadStudents = async () => {
        try {
            setLoadingStudents(true);
            const res = await fetchClassStudents(classId);
            if (res.success) {
                setStudents(res.students || []);
            }
        } catch (error) {
            console.error("Error loading students:", error);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleUploadSlide = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("slide", selectedFile);
        formData.append("title", title);

        try {
            setUploading(true);
            const response = await uploadSlide(classId, formData);
            toast.success("Slide uploaded successfully");
            setShowUploadModal(false);
            setSelectedFile(null);
            setTitle("");
        } catch (err) {
            console.error("Upload failed", err);
            toast.error("Failed to upload slide");
        } finally {
            setUploading(false);
        }
    };

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setShowStudentModal(true);
    };

    const copyJoinCode = () => {
        navigator.clipboard.writeText(cls.joinCode);
        toast.success("Join code copied!");
    };

    if (!cls) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading class...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <ClassHeader
                cls={cls}
                isTeacher={isTeacher}
                students={students}
                onBack={() => window.history.back()}
                onCopyJoinCode={copyJoinCode}
                onToggleStudents={() => setShowStudentsSidebar(!showStudentsSidebar)}
                onUploadSlide={() => setShowUploadModal(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                        Course Materials
                    </h2>
                    <p className="text-slate-600">
                        {isTeacher 
                            ? "Manage and share slides with your students"
                            : "Access course slides and materials"}
                    </p>
                </div>

                <Slides classId={classId} isTeacher={isTeacher} />
            </div>

            <StudentsSidebar
                isOpen={showStudentsSidebar}
                students={students}
                loading={loadingStudents}
                onClose={() => setShowStudentsSidebar(false)}
                onStudentClick={handleStudentClick}
            />

            <UploadSlideModal
                isOpen={showUploadModal}
                title={title}
                selectedFile={selectedFile}
                uploading={uploading}
                onClose={() => setShowUploadModal(false)}
                onTitleChange={(e) => setTitle(e.target.value)}
                onFileChange={(e) => setSelectedFile(e.target.files[0])}
                onUpload={handleUploadSlide}
            />

            <StudentDetailsModal
                isOpen={showStudentModal}
                student={selectedStudent}
                onClose={() => setShowStudentModal(false)}
            />
        </div>
    );
};

export default ClassPage;