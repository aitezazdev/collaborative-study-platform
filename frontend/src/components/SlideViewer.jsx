import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Download, FileText } from "lucide-react";
import { fetchSlideById } from "../api/slideApi";

const SlideViewer = () => {
  const { slideId } = useParams();
  
  const [slide, setSlide] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    const loadPdfJs = async () => {
      if (window.pdfjsLib) return;
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      };
      
      document.head.appendChild(script);
    };
    
    loadPdfJs();
  }, []);

  // Fetch slide data
  useEffect(() => {
    const loadSlide = async () => {
      try {
        setLoading(true);
        const data = await fetchSlideById(slideId);
        setSlide(data.slide);
        setError(null);
      } catch (err) {
        console.error("Failed to load slide", err);
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
    if (!slide?.url || !window.pdfjsLib) return;

    const loadPdf = async () => {
      try {
        setRendering(true);
        
        console.log('Loading PDF from:', slide.url);
        
        // Load PDF directly using URL (PDF.js handles CORS automatically)
        const loadingTask = window.pdfjsLib.getDocument({
          url: slide.url,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
          withCredentials: false,
        });
        
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setRendering(false);
        setError(null);
        
        console.log('PDF loaded successfully. Pages:', pdf.numPages);
      } catch (err) {
        console.error("Error loading PDF:", err);
        
        let errorMessage = "Failed to load PDF document.";
        
        if (err.message?.includes('CORS')) {
          errorMessage = "CORS error: Unable to access the PDF. The file may not be publicly accessible.";
        } else if (err.name === 'InvalidPDFException') {
          errorMessage = "The PDF file is corrupted or invalid. Please re-upload the file.";
        } else if (err.name === 'MissingPDFException') {
          errorMessage = "PDF file not found. The file may have been deleted.";
        } else if (err.name === 'UnexpectedResponseException') {
          errorMessage = "Failed to fetch PDF. The file might not be accessible.";
        } else if (err.message) {
          errorMessage = `Error: ${err.message}`;
        }
        
        setError(errorMessage);
        setRendering(false);
      }
    };

    loadPdf();
  }, [slide?.url]);

  useEffect(() => {
    if (!pdfDoc) return;

    const renderPage = async () => {
      try {
        setRendering(true);
        
        const page = await pdfDoc.getPage(pageNumber);
        const canvas = document.getElementById('pdf-canvas');
        
        if (!canvas) {
          console.error('Canvas element not found');
          setRendering(false);
          return;
        }
        
        const context = canvas.getContext('2d');

        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;
        setRendering(false);
      } catch (err) {
        console.error("Error rendering page:", err);
        setRendering(false);
      }
    };

    renderPage();
  }, [pdfDoc, pageNumber, scale]);

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  const handleFullscreen = () => {
    const viewer = document.getElementById('pdf-viewer-container');
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
      const link = document.createElement('a');
      link.href = slide.url;
      link.download = slide.fileName || 'slide.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading slide...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          {slide?.url && (
            <a 
              href={slide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open in new tab
            </a>
          )}
        </div>
      </div>
    );
  }

  if (!slide) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No slide found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{slide.title || 'Untitled Slide'}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {slide.fileName || 'slide.pdf'}
              {slide.convertedToPdf && ' (Converted to PDF)'}
            </p>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="flex gap-6 p-6 max-w-screen-2xl mx-auto">
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={pageNumber <= 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded">
                {pageNumber} / {numPages || '...'}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={!numPages || pageNumber >= numPages}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              
              <button
                onClick={handleZoomIn}
                disabled={scale >= 3.0}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              <button
                onClick={handleResetZoom}
                className="px-3 py-1 text-sm rounded hover:bg-gray-100 transition-colors"
                title="Reset zoom"
              >
                Reset
              </button>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <button
                onClick={handleFullscreen}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div 
            id="pdf-viewer-container" 
            className="overflow-auto p-6 bg-gray-100"
            style={{ maxHeight: 'calc(100vh - 280px)' }}
          >
            <div className="flex justify-center">
              <div className="bg-white shadow-lg relative">
                {rendering && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                )}
                <canvas id="pdf-canvas" className="max-w-full"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div className="w-96 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Comments (Page {pageNumber})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-1">No comments yet</p>
              <p className="text-xs text-gray-400">Be the first to comment on this page</p>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <textarea
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            ></textarea>
            <button className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideViewer;