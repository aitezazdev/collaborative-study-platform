export const renderPdfPage = async (
  pdfDoc,
  pageNum,
  containerWidth,
  scale
) => {
  try {
    const page = await pdfDoc.getPage(pageNum);
    const canvas = document.getElementById(`pdf-canvas-${pageNum}`);
    const textLayerDiv = document.getElementById(`text-layer-${pageNum}`);

    if (!canvas || !textLayerDiv) {
      return;
    }

    const context = canvas.getContext("2d");
    const defaultViewport = page.getViewport({ scale: 1.0 });
    const desiredWidth = containerWidth || 800;
    const baseScale = desiredWidth / defaultViewport.width;
    const finalScale = baseScale * scale;
    const pixelRatio = window.devicePixelRatio || 1;
    const renderScale = finalScale * pixelRatio;
    const viewport = page.getViewport({ scale: renderScale });

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.style.width = `${viewport.width / pixelRatio}px`;
    canvas.style.height = `${viewport.height / pixelRatio}px`;

    const textViewport = page.getViewport({ scale: finalScale });
    textLayerDiv.style.width = `${textViewport.width}px`;
    textLayerDiv.style.height = `${textViewport.height}px`;
    textLayerDiv.style.setProperty("--scale-factor", finalScale.toString());

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    textLayerDiv.innerHTML = "";
    const textContent = await page.getTextContent();

    const textLayer = await window.pdfjsLib.renderTextLayer({
      textContentSource: textContent,
      container: textLayerDiv,
      viewport: textViewport,
      textDivs: [],
    });

    await textLayer.promise;

    const textSpans = textLayerDiv.querySelectorAll(
      "span:not(.markedContent)"
    );

    textSpans.forEach((span) => {
      if (span.textContent && span.style.transform) {
        const transform = span.style.transform;
        const match = transform.match(/matrix\(([^)]+)\)/);

        if (match) {
          const values = match[1].split(",").map(parseFloat);
          const scaleY = values[3];
          const fontSize = parseFloat(span.style.fontSize) || 12;
          const textWidth = span.textContent.length * fontSize * 0.6;

          if (!span.style.width || span.style.width === "auto") {
            span.style.width = `${textWidth}px`;
          }

          span.style.height = `${fontSize * Math.abs(scaleY)}px`;
          span.style.lineHeight = "1";
        }
      }
    });
  } catch (err) {
    console.error(`Error rendering page ${pageNum}:`, err);
  }
};

export const loadPdfDocument = async (url) => {
  const loadingTask = window.pdfjsLib.getDocument({
    url: url,
    cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
    cMapPacked: true,
    withCredentials: false,
  });

  return await loadingTask.promise;
};