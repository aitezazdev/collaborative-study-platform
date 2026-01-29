import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const PdfControls = ({
  currentPage,
  numPages,
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFullscreen,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium px-3 py-1 bg-slate-100 rounded">
          Page {currentPage} of {numPages || "..."}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onZoomOut}
          disabled={scale <= 0.5}
          className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Zoom out">
          <ZoomOut className="w-5 h-5" />
        </button>

        <span className="text-sm font-medium px-3 py-1 bg-slate-100 rounded min-w-15 text-center">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={onZoomIn}
          disabled={scale >= 3.0}
          className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Zoom in">
          <ZoomIn className="w-5 h-5" />
        </button>

        <button
          onClick={onResetZoom}
          className="px-3 py-1 text-sm rounded hover:bg-slate-100 transition-colors"
          title="Reset zoom to 100%">
          Reset
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1"></div>

        <button
          onClick={onFullscreen}
          className="p-1.5 rounded hover:bg-slate-100 transition-colors"
          title="Fullscreen">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PdfControls;