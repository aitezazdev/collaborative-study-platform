import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { fetchSlideById } from "../api/slideApi";
import usePdfJs from "./slide/usePdfJs";
import useContainerWidth from "./slide/useContainerWidth";
import { renderPdfPage, loadPdfDocument } from "./slide/pdfUtils";
import SlideHeader from "./slide/SlideHeader";
import PdfControls from "./slide/PdfControls";
import CommentsSidebar from "./slide/CommentsSidebar";
import PdfPage from "./slide/PdfPage";
import LoadingState from "./slide/LoadingState";
import ErrorState from "./slide/ErrorState";
import PdfStyles from "./slide/PdfStyles";

const SlideViewer = () => {
  const { slideId } = useParams();
  const [slide, setSlide] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [rendering, setRendering] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const containerRef = useRef(null);
  const pageRefs = useRef({});
  const observerRef = useRef(null);
  const renderingPagesRef = useRef(new Set());

  const { pdfJsReady, error: pdfJsError } = usePdfJs();
  const { containerWidth, wrapperRef } = useContainerWidth([pdfDoc]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const width = rect.width > 0 ? rect.width - 64 : 0;
        if (width > 0 && width !== containerWidth) {
          window.dispatchEvent(new Event('resize'));
        }
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [showComments]);

  useEffect(() => {
    if (pdfJsError) {
      setError(pdfJsError);
    }
  }, [pdfJsError]);

  useEffect(() => {
    const loadSlide = async () => {
      try {
        setLoading(true);
        const data = await fetchSlideById(slideId);
        setSlide(data.slide);
        setError(null);
      } catch (err) {
        setError("Failed to load slide. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (slideId) {
      loadSlide();
    }
  }, [slideId]);

  useEffect(() => {
    if (!slide?.url || !pdfJsReady) return;

    let isMounted = true;

    const loadPdf = async () => {
      try {
        setRendering(true);
        const pdf = await loadPdfDocument(slide.url);

        if (!isMounted) return;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setRendering(false);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        let errorMessage = "Failed to load PDF document.";

        if (err.message?.includes("CORS")) {
          errorMessage =
            "CORS error: Unable to access the PDF. The file may not be publicly accessible.";
        } else if (err.name === "InvalidPDFException") {
          errorMessage =
            "The PDF file is corrupted or invalid. Please re-upload the file.";
        } else if (err.name === "MissingPDFException") {
          errorMessage = "PDF file not found. The file may have been deleted.";
        } else if (err.name === "UnexpectedResponseException") {
          errorMessage =
            "Failed to fetch PDF. The file might not be accessible.";
        } else if (err.message) {
          errorMessage = `Error: ${err.message}`;
        }

        setError(errorMessage);
        setRendering(false);
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [slide?.url, pdfJsReady]);

  useEffect(() => {
    if (!pdfDoc || !numPages) return;

    const options = {
      root: containerRef.current,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNum = parseInt(entry.target.dataset.pageNumber);
          setCurrentPage(pageNum);
        }
      });
    }, options);

    Object.values(pageRefs.current).forEach((ref) => {
      if (ref) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pdfDoc, numPages]);

  useEffect(() => {
    if (!pdfDoc || !numPages || containerWidth <= 0) {
      return;
    }

    const renderAllPages = async () => {
      setRendering(true);
      renderingPagesRef.current.clear();

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        if (renderingPagesRef.current.has(pageNum)) continue;
        renderingPagesRef.current.add(pageNum);
        await renderPdfPage(pdfDoc, pageNum, containerWidth, scale);
      }

      setRendering(false);
    };

    renderAllPages();

    return () => {
      renderingPagesRef.current.clear();
    };
  }, [pdfDoc, numPages, containerWidth, scale, showComments]);

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  const handleFullscreen = () => {
    const viewer = document.getElementById("pdf-viewer-container");
    if (viewer.requestFullscreen) {
      viewer.requestFullscreen();
    } else if (viewer.webkitRequestFullscreen) {
      viewer.webkitRequestFullscreen();
    } else if (viewer.msRequestFullscreen) {
      viewer.msRequestFullscreen();
    }
  };

  const handleDownload = () => {
    if (slide?.url) {
      const link = document.createElement("a");
      link.href = slide.url;
      link.download = slide.fileName || "slide.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return <LoadingState pdfJsReady={pdfJsReady} />;
  }

  if (error) {
    return <ErrorState error={error} slideUrl={slide?.url} />;
  }

  if (!slide) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-600">No slide found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PdfStyles />
      <SlideHeader
        slide={slide}
        showComments={showComments}
        onToggleComments={() => setShowComments(!showComments)}
        onDownload={handleDownload}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4">
          <div
            className={`flex-1 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col transition-all duration-300 ${
              showComments ? "max-w-[calc(100%-26rem)]" : "max-w-full"
            }`}>
            <PdfControls
              currentPage={currentPage}
              numPages={numPages}
              scale={scale}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetZoom={handleResetZoom}
              onFullscreen={handleFullscreen}
            />

            <div
              id="pdf-viewer-container"
              ref={containerRef}
              className="flex-1 overflow-auto bg-slate-100 h-[calc(100vh-240px)]">
              <div
                ref={wrapperRef}
                className="flex flex-col items-center min-h-full p-8 gap-6">
                {!pdfDoc || containerWidth <= 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
                    <ClipLoader color="#3B82F6" size={50} />
                    <p className="text-gray-600">
                      {!pdfDoc ? "Loading PDF..." : "Preparing viewer..."}
                    </p>
                    <p className="text-gray-500 text-sm">
                      This may take a moment
                    </p>
                  </div>
                ) : (
                  <>
                    {rendering && (
                      <div className="fixed top-20 right-8 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
                        <ClipLoader color="#ffffff" size={16} />
                        <span className="text-sm">Rendering pages...</span>
                      </div>
                    )}
                    {Array.from({ length: numPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <PdfPage
                          key={pageNum}
                          pageNum={pageNum}
                          ref={(el) => (pageRefs.current[pageNum] = el)}
                        />
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <CommentsSidebar
            currentPage={currentPage}
            showComments={showComments}
            onClose={() => setShowComments(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default SlideViewer;