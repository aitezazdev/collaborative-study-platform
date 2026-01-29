const PdfStyles = () => {
  return (
    <style>{`
      .textLayer {
        position: absolute;
        text-align: initial;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        opacity: 1;
        line-height: 1;
        -webkit-text-size-adjust: none;
        -moz-text-size-adjust: none;
        text-size-adjust: none;
        forced-color-adjust: none;
        user-select: text;
        -webkit-user-select: text;
      }
      
      .textLayer span,
      .textLayer br {
        color: transparent;
        position: absolute;
        white-space: pre;
        cursor: text;
        transform-origin: 0% 0%;
        user-select: text;
        -webkit-user-select: text;
        pointer-events: auto;
        display: inline-block;
        vertical-align: top;
      }

      .textLayer span.markedContent {
        top: 0;
        height: 0;
        pointer-events: none;
      }

      .textLayer ::selection {
        background: rgba(0, 100, 255, 0.3);
      }

      .textLayer ::-moz-selection {
        background: rgba(0, 100, 255, 0.3);
      }

      .textLayer br::selection {
        background: transparent;
      }

      .textLayer br::-moz-selection {
        background: transparent;
      }

      .textLayer .highlight {
        margin: -1px;
        padding: 1px;
        background-color: rgba(180, 0, 170, 0.2);
        border-radius: 4px;
      }

      .textLayer .highlight.appended {
        position: initial;
      }

      .textLayer .highlight.begin {
        border-radius: 4px 0 0 4px;
      }

      .textLayer .highlight.end {
        border-radius: 0 4px 4px 0;
      }

      .textLayer .highlight.middle {
        border-radius: 0;
      }

      .textLayer .highlight.selected {
        background-color: rgba(0, 100, 255, 0.3);
      }
    `}</style>
  );
};

export default PdfStyles;