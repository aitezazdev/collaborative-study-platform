import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchClassBySlug, fetchClassStudents } from "../api/classApi";
import { uploadSlide } from "../api/slideApi";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Slides from "../components/Slides";
import ClassHeader from "../components/class/ClassHeader";
import StudentsSidebar from "../components/class/StudentsSidebar";
import UploadSlideModal from "../components/class/UploadSlideModal";
import StudentDetailsModal from "../components/class/StudentDetailsModal";

const ClassPage = () => {
    const { slug } = useParams();

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
    const [loadingClass, setLoadingClass] = useState(true);
    const [slidesRefreshTrigger, setSlidesRefreshTrigger] = useState(0);

    const reduxUser = useSelector((state) => state.auth.user);
    const localUser = (() => {
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr || userStr === "undefined" || userStr === "null") {
                return null;
            }
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            return null;
        }
    })();
    const user = reduxUser || localUser;

    const currentUserId = user?.uid || user?._id;

    useEffect(() => {
        const loadClass = async () => {
            try {
                setLoadingClass(true);
                const res = await fetchClassBySlug(slug);
                if (res.success && res.class) {
                    setCls(res.class);
                    setIsTeacher(res.isTeacher);
                } else {
                    toast.error("Class not found");
                }
            } catch (error) {
                console.error("Error loading class:", error);
                toast.error("Failed to load class");
            } finally {
                setLoadingClass(false);
            }
        };
        loadClass();
    }, [slug]);

    useEffect(() => {
        if (isTeacher && slug) {
            loadStudents();
        }
    }, [isTeacher, slug]);

    const loadStudents = async () => {
        try {
            setLoadingStudents(true);
            const res = await fetchClassStudents(slug);
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
        if (!selectedFile) {
            toast.error("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("slide", selectedFile);
        formData.append("title", title);

        try {
            setUploading(true);
            const response = await uploadSlide(cls._id, formData);
            if (response.success) {
                toast.success("Slide uploaded successfully");
                setShowUploadModal(false);
                setSelectedFile(null);
                setTitle("");
                setSlidesRefreshTrigger(prev => prev + 1);
            } else {
                toast.error(response.message || "Failed to upload slide");
            }
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

    if (loadingClass) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <ClipLoader color="#3B82F6" size={50} />
                    <p className="text-slate-600">Loading class...</p>
                </div>
            </div>
        );
    }

    if (!cls) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-600 text-lg">Class not found</p>
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

                <Slides 
                    classId={cls._id} 
                    isTeacher={isTeacher}
                    refreshTrigger={slidesRefreshTrigger}
                />
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