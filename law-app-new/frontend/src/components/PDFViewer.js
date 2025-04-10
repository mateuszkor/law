import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from 'styled-components';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto; /* Enable scrolling */
  padding: 20px;
`;

const PDFDocument = styled(Document)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PDFPage = styled(Page)`
  margin-bottom: 0; /* Remove margin between pages */
  padding: 0; /* Remove padding */
  
  canvas {
    display: block; /* Fix inline spacing issue */
    max-width: 100%;
    height: auto !important;
    margin-bottom: -4px; /* Fix blank space between pages */
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
  text-align: center;
`;

const PDFViewer = ({ pdfUrl, onDocumentLoad }) => {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);

    if (onDocumentLoad) {
      onDocumentLoad({ numPages });
    }
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Error loading PDF document. Please try again.');
    setLoading(false);
  };

  return (
    <ViewerContainer>
      {loading && <LoadingMessage>Loading PDF...</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <PDFDocument
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<LoadingMessage>Loading PDF...</LoadingMessage>}
      >
        {/* Render all pages continuously */}
        {Array.from(new Array(numPages), (el, index) => (
          <PDFPage
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false} // Disable text layer to avoid formatting issues
            renderAnnotationLayer={false} // Disable annotation layer if not needed
          />
        ))}
      </PDFDocument>
    </ViewerContainer>
  );
};

export default PDFViewer;
