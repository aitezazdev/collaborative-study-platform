import { Download, MessageSquare } from "lucide-react";

const SlideHeader = ({ slide, showComments, onToggleComments, onDownload }) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900 truncate">
            {slide.title || "Untitled Slide"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {slide.fileName || "slide.pdf"}
            {slide.convertedToPdf && " (Converted to PDF)"}
          </p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <button
            onClick={onToggleComments}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors relative text-sm">
            <MessageSquare className="w-4 h-4" />
            <span>Comments</span>
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideHeader;