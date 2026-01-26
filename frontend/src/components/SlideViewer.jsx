import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Download, MessageSquare, X, Send } from "lucide-react";
import { fetchSlideById } from "../api/slideApi";

const SlideViewer = () => {
  const { slideId } = useParams();
  
  const [slide, setSlide] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(2.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [rendering, setRendering] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const containerRef = useRef(null);

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
      
      // Add text layer CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf_viewer.min.css';
      document.head.appendChild(link);
    };
    
    loadPdfJs();
  }, []);

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
        const canvas = canvasRef.current;
        const textLayerDiv = textLayerRef.current;
        
        if (!canvas || !textLayerDiv) {
          console.error('Canvas or text layer element not found');
          setRendering(false);
          return;
        }
        
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale });
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        textLayerDiv.style.width = `${viewport.width}px`;
        textLayerDiv.style.height = `${viewport.height}px`;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;
        
        textLayerDiv.innerHTML = ''; 
        
        const textContent = await page.getTextContent();
        
        await window.pdfjsLib.renderTextLayer({
          textContentSource: textContent,
          container: textLayerDiv,
          viewport: viewport,
          textDivs: []
        });
        
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
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  };

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.25, 4.0));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    setScale(2.5);
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

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment,
      author: "Current User",
      timestamp: new Date().toISOString(),
      page: pageNumber
    };
    
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const pageComments = comments.filter(c => c.page === pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading slide...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
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
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-600">No slide found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 truncate">{slide.title || 'Untitled Slide'}</h1>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {slide.fileName || 'slide.pdf'}
              {slide.convertedToPdf && ' (Converted to PDF)'}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors relative text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Comments</span>
              {comments.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {comments.length}
                </span>
              )}
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 p-4 max-w-full mx-auto h-[calc(100vh-80px)]">
        <div className={`flex-1 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col transition-all duration-300 ${showComments ? 'max-w-[calc(100%-26rem)]' : 'max-w-full'}`}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={pageNumber <= 1}
                className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm font-medium px-3 py-1 bg-slate-100 rounded">
                {pageNumber} / {numPages || '...'}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={!numPages || pageNumber >= numPages}
                className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.75}
                className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <span className="text-sm font-medium px-3 py-1 bg-slate-100 rounded min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              
              <button
                onClick={handleZoomIn}
                disabled={scale >= 4.0}
                className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              <button
                onClick={handleResetZoom}
                className="px-3 py-1 text-sm rounded hover:bg-slate-100 transition-colors"
                title="Reset zoom to 250%"
              >
                Reset
              </button>

              <div className="w-px h-6 bg-slate-300 mx-1"></div>

              <button
                onClick={handleFullscreen}
                className="p-1.5 rounded hover:bg-slate-100 transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div 
            id="pdf-viewer-container" 
            ref={containerRef}
            className="flex-1 overflow-auto bg-slate-100"
          >
            <div className="flex justify-center items-start min-h-full p-4">
              <div className="bg-white shadow-lg relative">
                {rendering && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                )}
                <div style={{ position: 'relative' }}>
                  <canvas ref={canvasRef} className="max-w-full h-auto block"></canvas>
                  <div 
                    ref={textLayerRef}
                    className="textLayer"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      overflow: 'hidden',
                      lineHeight: 1.0,
                      opacity: 0.2
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showComments && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 z-30 lg:hidden"
              onClick={() => setShowComments(false)}
            />
            <div className="fixed lg:relative right-0 top-0 lg:top-auto w-96 bg-white rounded-lg shadow-xl lg:shadow-sm border border-slate-200 flex flex-col z-40 h-full lg:h-auto lg:max-h-full">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>Comments</span>
                  <span className="text-xs text-slate-500">(Page {pageNumber})</span>
                </h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="lg:hidden p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {pageComments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium mb-1">No comments yet</p>
                    <p className="text-xs text-slate-500">Be the first to comment on this page</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pageComments.map((comment) => (
                      <div key={comment.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                            {comment.author.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-slate-900">{comment.author}</span>
                              <span className="text-xs text-slate-500">
                                {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
                <div className="flex gap-2">
                  <textarea
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handlePostComment();
                      }
                    }}
                  ></textarea>
                </div>
                <button 
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Comment</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SlideViewer;