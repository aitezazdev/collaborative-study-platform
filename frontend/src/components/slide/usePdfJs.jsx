import { useEffect, useState } from "react";

const usePdfJs = () => {
  const [pdfJsReady, setPdfJsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPdfJs = async () => {
      if (window.pdfjsLib) {
        setPdfJsReady(true);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;

      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        setPdfJsReady(true);
      };

      script.onerror = () => {
        setError("Failed to load PDF viewer. Please refresh the page.");
      };

      document.head.appendChild(script);
    };

    loadPdfJs();
  }, []);

  return { pdfJsReady, error };
};

export default usePdfJs;