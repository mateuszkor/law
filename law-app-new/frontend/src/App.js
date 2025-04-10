import React, { useState } from 'react';
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';
import PDFViewer from './components/PDFViewer';
import Sidebar from './components/Sidebar';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  const [pdfData, setPdfData] = useState(null);
  
  const handleFileUploaded = (fileData) => {
    console.log('File uploaded:', fileData);
    setPdfData(fileData);
  };
  
  const handleDocumentLoad = (documentData) => {
    if (pdfData) {
      setPdfData({
        ...pdfData,
        numPages: documentData.numPages
      });
    }
  };

  return (
    <>
      <GlobalStyles />
      <Layout
        sidebar={<Sidebar pdfInfo={pdfData} />}
      >
        {pdfData ? (
          <PDFViewer 
            pdfUrl={pdfData.url} 
            onDocumentLoad={handleDocumentLoad}
          />
        ) : (
          <FileUpload onFileUploaded={handleFileUploaded} />
        )}
      </Layout>
    </>
  );
}

export default App;
