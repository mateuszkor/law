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
  overflow-y: auto; /* Enable scrolling */
  padding: 20px;
  background-color: #f8f9fa; /* Light background for contrast */
`;

const PDFDocument = styled(Document)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PDFPage = styled(Page)`
  margin-bottom: 16px; /* Space between pages */
  padding: 0; /* Remove padding */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Add subtle shadow */
  border-radius: 8px; /* Rounded corners for a modern look */
  
  canvas {
    display: block; /* Fix inline spacing issue */
    max-width: calc(100% - 40px); /* Responsive width with padding */
    height: auto !important;
    margin: auto; /* Center canvas horizontally */
    background-color: #ffffff; /* White background for the page */
    border-radius: inherit; /* Match parent border radius */
  }
`;

// Loading message style
const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 18px;
`;

// Error message style
const ErrorMessage = styled.div`
  color: red;
  text-align: center;
`;

const PDFViewer = ({ pdfUrl, onDocumentLoad, scale }) => {
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
      if (onDocumentLoad) {
          onDocumentLoad({ numPages });
      }
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
              {/* Render all pages continuously */}
              {Array.from(new Array(numPages), (el, index) => (
                  <PDFPage
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      scale={scale} /* Apply current zoom level */
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                  />
              ))}
          </PDFDocument>
      </ViewerContainer>
  );
};

export default PDFViewer;
