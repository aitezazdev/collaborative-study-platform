import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchUserClasses } from "../api/classApi";
import { uploadSlide } from "../api/slideApi";
import { toast } from "react-toastify";
import Slides from "../components/Slides";

const ClassPage = () => {
    const { classId } = useParams();

    const [cls, setCls] = useState(null);
    const [joinCode, setJoinCode] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const [uploading, setUploading] = useState(false);

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
        setJoinCode(teacherId === currentUserId);
    }, [cls, currentUserId]);

    const handleUploadSlide = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("slide", selectedFile);
        formData.append("title", title);

        try {
            setUploading(true);
            const response = await uploadSlide(classId, formData);
            console.log(response);
            toast.success("Slide uploaded successfully");
            setShowModal(false);
            setSelectedFile(null);
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    if (!cls) {
        return (
            <p className="text-center mt-10 text-slate-500">
                Loading class...
            </p>
        );
    }

    return (
        <div>
            {/* CLASS INFO */}
            <div className="p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {cls.title}
                </h1>

                <p className="text-slate-600 mb-4">{cls.description}</p>

                <div className="bg-white border rounded-lg p-6 mb-4">
                    <p>
                        <strong>Teacher:</strong> {cls.teacher?.name}
                    </p>
                    <p>
                        <strong>Students:</strong> {cls.students?.length}
                    </p>

                    {joinCode && (
                        <p>
                            <strong>Join Code:</strong> {cls.joinCode}
                        </p>
                    )}
                </div>

                <button
                    onClick={() => window.history.back()}
                    className="text-blue-600"
                >
                    ← Back to classes
                </button>
            </div>

            {/* SLIDES SECTION */}
            <div>

                <div className="px-8 flex  justify-between mb-4 items-center">
                    <h2 className="text-2xl font-semibold text-slate-900 px-8">
                        Slides
                    </h2>
                    {joinCode && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            + Add Slide
                        </button>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Upload Slide
                        </h3>

                        <p className="text-slate-600 mb-4">
                            Select a document (PDF, PPT, DOC) to share with students.
                        </p>

                        <input type="text" placeholder="Slide title (optional)"
                            className="border border-slate-300 rounded px-3 py-2 w-full mb-4"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <input
                            type="file"
                            accept=".pdf,.ppt,.pptx,.doc,.docx"
                            className="border border-slate-300 rounded px-3 py-2 w-full mb-4"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded border"
                                disabled={uploading}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUploadSlide}
                                disabled={!selectedFile || uploading}
                                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-8">
                <Slides classId={classId} />
            </div>
        </div>
    );
};

export default ClassPage;
