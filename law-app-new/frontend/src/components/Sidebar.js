import React from 'react';
import styled from 'styled-components';

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SidebarHeader = styled.div`
  padding-bottom: 20px;
  border-bottom: 1px solid var(--light-gray);
  margin-bottom: 20px;
`;

const SidebarTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
  color: var(--text-color);
`;

const SidebarSection = styled.div`
  margin-bottom: 20px;
`;

const SidebarSectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
  color: var(--text-color);
`;

const InfoItem = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-size: 14px;
`;

const Value = styled.span`
  display: block;
  word-break: break-word;
`;

const ZoomControls = styled.div`
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
`;

const ZoomButton = styled.button`
  margin-bottom: 10px; /* Space between buttons */
  padding: 8px;
  border: none;
  background-color:#800020;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #800020;
  }

  &:last-child {
    margin-bottom: 0; /* Remove margin for last button */
  }
`;

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const Sidebar = ({ pdfInfo, onZoomIn, onZoomOut }) => {
  
    return (
      <SidebarWrapper>
        <SidebarHeader>
          <SidebarTitle>PDF Info</SidebarTitle>
        </SidebarHeader>
        
        {pdfInfo ? (
          <>
            <SidebarSection>
              <SidebarSectionTitle>File Details</SidebarSectionTitle>
              <InfoItem>
                <Label>Filename</Label>
                <Value>{pdfInfo.name}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Size</Label>
                <Value>{formatBytes(pdfInfo.size)}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Pages</Label>
                <Value>{pdfInfo.numPages || 'Unknown'}</Value>
              </InfoItem>
            </SidebarSection>

            {/* Zoom Controls Section */}
            <SidebarSection>
              <SidebarSectionTitle>Controls</SidebarSectionTitle>
              <ZoomControls>
                <ZoomButton onClick={onZoomIn}>Zoom In</ZoomButton>
                <ZoomButton onClick={onZoomOut}>Zoom Out</ZoomButton>
              </ZoomControls>
            </SidebarSection>

          </>
        ) : (
          <p>Upload a PDF to view its information</p>
        )}
      </SidebarWrapper>
    );
};

export default Sidebar;

