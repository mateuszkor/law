import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from 'styled-components';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

// Styled container for the viewer
const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  background-color: #f8f9fa;
`;

const PDFDocument = styled(Document)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;

  canvas {
    display: block;
    max-width: calc(100% - 40px);
    height: auto !important;
    margin: auto;
    border-radius: inherit;
    background-color: #ffffff;
  }
`;

const PDFPage = styled(Page)`
  position: relative;

  .react-pdf__Page__textContent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none; /* Ensure text layer doesn't block interactions */
    transform-origin: top left; /* Align transformations properly */
    transform: scale(1.01) translate(-0.5%, -0.5%); /* Fine-tune alignment */
    
    span {
      position: absolute;
      white-space: pre;
      pointer-events: all; /* Allow text selection */
      cursor: text; /* Show text selection cursor */
      color: transparent; /* Make text invisible but selectable */
      line-height: normal; /* Prevent spacing issues */
    }
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  color: red;
`;

const PDFViewer = ({ pdfUrl, onDocumentLoad, scale }) => {
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    if (onDocumentLoad) onDocumentLoad({ numPages });
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Error loading PDF document. Please try again.');
  };

  return (
    <ViewerContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <PDFDocument
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<LoadingMessage>Loading PDF...</LoadingMessage>}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <PageWrapper key={`wrapper_${index + 1}`}>
            <PDFPage
              pageNumber={index + 1}
              scale={scale}
              renderTextLayer={true} // Enable text layer
              renderAnnotationLayer={false}
            />
          </PageWrapper>
        ))}
      </PDFDocument>
    </ViewerContainer>
  );
};

export default PDFViewer;
