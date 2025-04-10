import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

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

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

const FileUpload = ({ onFileUploaded }) => {
  const [error, setError] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    setError('');
    const file = acceptedFiles[0];
    
    if (file && file.type === 'application/pdf') {
      // Process the file immediately when it's dropped
      onFileUploaded({
        file: file,
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(file)
      });
    } else {
      setError('Please upload a PDF file');
    }
  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <UploadContainer>
      <DropzoneArea {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <UploadText>
          {isDragActive
            ? 'Drop the PDF file here...'
            : 'Drag and drop a PDF file here, or click to select a file'}
        </UploadText>
      </DropzoneArea>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </UploadContainer>
  );
};

export default FileUpload;
