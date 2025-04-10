import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import axios from 'axios';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const DropzoneArea = styled.div`
  border: 2px dashed var(--primary-color);
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  width: 100%;
  max-width: 500px;
  background-color: ${props => props.isDragActive ? 'rgba(64, 159, 255, 0.1)' : 'transparent'};
  transition: background-color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(64, 159, 255, 0.05);
  }
`;

const UploadText = styled.p`
  margin-bottom: 20px;
  font-size: 18px;
  color: var(--text-color);
`;

const StatusText = styled.p`
  margin-top: 20px;
  font-size: 16px;
  color: ${props => props.isError ? 'red' : 'green'};
`;

const FileUpload = ({ onFileUploaded }) => {
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    
    if (!file || file.type !== 'application/pdf') {
      setStatus('Please upload a PDF file');
      setIsError(true);
      return;
    }

    setIsUploading(true);
    setStatus('Uploading...');
    setIsError(false);

    // Create form data
    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      // Upload to server
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setStatus('Upload successful!');
      setIsUploading(false);

      // Pass the file data to parent component
      onFileUploaded({
        file: file,
        name: response.data.fileName,
        size: response.data.fileSize,
        uploadDate: response.data.uploadDate,
        url: `http://localhost:5000${response.data.fileUrl}`
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('Error uploading file. Please try again.');
      setIsError(true);
      setIsUploading(false);
    }
  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading
  });

  return (
    <UploadContainer>
      <DropzoneArea {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <UploadText>
          {isDragActive
            ? 'Drop the PDF file here...'
            : isUploading 
              ? 'Uploading...'
              : 'Drag and drop a PDF file here, or click to select a file'}
        </UploadText>
      </DropzoneArea>
      
      {status && <StatusText isError={isError}>{status}</StatusText>}
    </UploadContainer>
  );
};

export default FileUpload;
