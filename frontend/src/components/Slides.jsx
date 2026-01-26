import { useEffect, useState } from "react";
import { fetchSlidesForClass, deleteSlide } from "../api/slideApi";
import { Link } from "react-router-dom";
import { FiFile, FiFileText, FiTrash2, FiEye } from "react-icons/fi";
import ConfirmationModal from "../components/ui/ConfirmationModal";

const Slides = ({ classId, isTeacher }) => {
  const [slides, setSlides] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);

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

  const handleDeleteClick = (slide) => {
    setSelectedSlide(slide);
    setShowDeleteModal(true);
  };

  const handleDeleteSlide = async () => {
    const slideId = selectedSlide._id;
    const prev = slides;
    setSlides((s) => s.filter((slide) => slide._id !== slideId));
    setDeletingId(slideId);
    setShowDeleteModal(false);

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

  const getFileIcon = (url = "") => {
    const type = getFileType(url);
    if (type === "PDF") return <FiFileText size={20} />;
    return <FiFile size={20} />;
  };

  return (
    <>
      <div className="space-y-3">
        {slides.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <FiFile className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-500">No slides uploaded yet.</p>
            {isTeacher && (
              <p className="text-sm text-slate-400 mt-2">
                Click "Upload Slide" to add course materials
              </p>
            )}
          </div>
        ) : (
          slides.map((slide) => (
            <div
              key={slide._id}
              className={`flex items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm transition ${
                deletingId === slide._id
                  ? "opacity-50"
                  : "hover:shadow-md hover:border-slate-300"
              }`}>
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  {getFileIcon(slide.url)}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 truncate">
                    {slide.title || "Untitled Slide"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 truncate">
                      {slide.fileName}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {getFileType(slide.url)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/class/${classId}/slide/${slide._id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <FiEye size={16} />
                  <span>View</span>
                </Link>

                {isTeacher && (
                  <button
                    onClick={() => handleDeleteClick(slide)}
                    disabled={deletingId === slide._id}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    <FiTrash2 size={16} />
                    <span>
                      {deletingId === slide._id ? "Deleting..." : "Delete"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteSlide}
        title="Delete Slide"
        message={`Are you sure you want to delete "${selectedSlide?.title || "this slide"}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={deletingId !== null}
      />
    </>
  );
};

export default Slides;
