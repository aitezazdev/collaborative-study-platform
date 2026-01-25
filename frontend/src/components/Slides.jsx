import { useEffect, useState } from "react";
import { fetchSlidesForClass, deleteSlide } from "../api/slideApi";
import { Link } from "react-router-dom";

const Slides = ({ classId, isTeacher }) => {
    const [slides, setSlides] = useState([]);
    const [deletingId, setDeletingId] = useState(null);

    const fetchSlides = async () => {
        try {
            const data = await fetchSlidesForClass(classId);
            setSlides(data.slides);
        } catch (error) {
            console.error("Error fetching slides:", error);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, [classId]);

    const handleDeleteSlide = async (slideId) => {
        if (!window.confirm("Delete this slide?")) return;

        console.log(slideId)

        const prev = slides;
        setSlides((s) => s.filter((slide) => slide._id !== slideId));
        setDeletingId(slideId);

        try {
            await deleteSlide(slideId);
        } catch (error) {
            console.error(error);
            setSlides(prev);
        } finally {
            setDeletingId(null);
        }
    };

    const getFileType = (url = "") => {
        if (url.includes(".pdf")) return "PDF";
        if (url.includes(".ppt") || url.includes(".pptx")) return "PPT";
        if (url.includes(".doc") || url.includes(".docx")) return "DOC";
        return "FILE";
    };

    return (
        <div className="px-8 pb-8 space-y-3">
            {slides.length === 0 ? (
                <p className="text-sm text-slate-500">No slides uploaded yet.</p>
            ) : (
                slides.map((slide) => (
                    <div
                        key={slide._id}
                        className={`flex items-center justify-between gap-4 p-4 bg-white border rounded-lg shadow-sm ${deletingId === slide._id ? "opacity-50" : "hover:shadow-md"
                            }`}
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                                {getFileType(slide.url)}
                            </div>

                            <div className="min-w-0">
                                <h3 className="font-medium text-slate-800 truncate">
                                    {slide.title || "Untitled Slide"}
                                </h3>
                                <p className="text-xs text-slate-500 truncate">
                                    {slide.fileName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                to={`/class/${classId}/slide/${slide._id}`}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                View
                            </Link>


                            {isTeacher && (
                                <button
                                    onClick={() => handleDeleteSlide(slide._id)}
                                    disabled={deletingId === slide._id}
                                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                                >
                                    {deletingId === slide._id ? "Deleting..." : "Delete"}
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Slides;
