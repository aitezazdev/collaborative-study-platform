import { Download, MessageSquare, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SlideHeader = ({ slide, currentPage, numPages, showComments, onToggleComments, onDownload }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-600 hover:text-slate-900 transition shrink-0">
              <ChevronLeft size={20} />
              <span className="ml-1">Back</span>
            </button>

            <div className="flex-1 min-w-0 flex items-baseline gap-3">
              <h1 className="text-xl font-bold text-slate-900 truncate">
                {slide.title || "Untitled Slide"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleComments}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Comments</span>
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideHeader;