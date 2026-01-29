import { Download, MessageSquare, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SlideHeader = ({ slide, showComments, onToggleComments, onDownload }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-4 transition">
          <ChevronLeft size={20} />
          <span className="ml-1">Back to class</span>
        </button>

        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {slide.title || "Untitled Slide"}
            </h1>
            <p className="text-slate-600 text-sm">
              {slide.fileName || "slide.pdf"}
              {slide.convertedToPdf && " (Converted to PDF)"}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={onToggleComments}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition">
              <MessageSquare className="w-4 h-4" />
              <span>Comments</span>
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideHeader;