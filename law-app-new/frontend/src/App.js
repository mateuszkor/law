import React, { useState } from 'react';
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';
import PDFViewer from './components/PDFViewer';
import Sidebar from './components/Sidebar';
import GlobalStyles from './styles/GlobalStyles';

function App() {
    const [pdfData, setPdfData] = useState(null);
    const [scale, setScale] = useState(1.0); // Zoom level state

    const handleFileUploaded = (fileData) => {
        setPdfData(fileData);
    };

    const handleDocumentLoad = (documentData) => {
        if (pdfData) {
            setPdfData({
                ...pdfData,
                numPages: documentData.numPages,
            });
        }
    };

    // Zoom controls
    const zoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.2, 3.0)); // Max zoom level is capped at x3
    };

    const zoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.2, 0.5)); // Min zoom level is capped at x0.5
    };

    return (
        <>
            <GlobalStyles />
            <Layout
                sidebar={
                    <Sidebar
                        pdfInfo={pdfData}
                        onZoomIn={zoomIn} // Pass zoom in function
                        onZoomOut={zoomOut} // Pass zoom out function
                    />
                }
            >
                {pdfData ? (
                    <PDFViewer
                        pdfUrl={pdfData.url}
                        onDocumentLoad={handleDocumentLoad}
                        scale={scale} // Pass current zoom level to PDFViewer
                    />
                ) : (
                    <FileUpload onFileUploaded={handleFileUploaded} />
                )}
            </Layout>
        </>
    );
}

export default App;

