import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from 'styled-components';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const PDFDocument = styled(Document)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PDFPage = styled(Page)`
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  canvas {
    max-width: 100%;
    height: auto !important;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const ControlButton = styled.button`
  margin: 0 5px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  
  &:disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
  }
`;

const PageInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 0 15px;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 18px;
  color: var(--text-color);
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin: 20px;
`;

const PDFViewer = ({ pdfUrl, onDocumentLoad }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
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

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  return (
    <ViewerContainer>
      {loading && <LoadingMessage>Loading PDF...</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Controls>
        <ControlButton 
          onClick={previousPage}
          disabled={pageNumber <= 1}
        >
          Previous
        </ControlButton>
        
        <PageInfo>
          Page {pageNumber} of {numPages || '?'}
        </PageInfo>
        
        <ControlButton 
          onClick={nextPage}
          disabled={pageNumber >= numPages}
        >
          Next
        </ControlButton>
      </Controls>
      
      <PDFDocument
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<LoadingMessage>Loading PDF...</LoadingMessage>}
      >
        <PDFPage pageNumber={pageNumber} />
      </PDFDocument>
    </ViewerContainer>
  );
};

export default PDFViewer;
