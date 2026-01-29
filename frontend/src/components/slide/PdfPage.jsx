import { forwardRef } from "react";

const PdfPage = forwardRef(({ pageNum }, ref) => {
  return (
    <div
      ref={ref}
      data-page-number={pageNum}
      className="bg-white shadow-lg relative min-h-150">
      <div style={{ position: "relative" }}>
        <canvas
          id={`pdf-canvas-${pageNum}`}
          className="max-w-full h-auto block"></canvas>
        <div
          id={`text-layer-${pageNum}`}
          className="textLayer"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
          }}></div>
      </div>
      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Page {pageNum}
      </div>
    </div>
  );
});

PdfPage.displayName = "PdfPage";

export default PdfPage;