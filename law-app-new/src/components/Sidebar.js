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

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const Sidebar = ({ pdfInfo }) => {
  if (!pdfInfo) {
    return (
      <SidebarWrapper>
        <SidebarHeader>
          <SidebarTitle>PDF Information</SidebarTitle>
        </SidebarHeader>
        <p>Upload a PDF to view its information</p>
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper>
      <SidebarHeader>
        <SidebarTitle>PDF Information</SidebarTitle>
      </SidebarHeader>
      
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
          <Label>Upload Date</Label>
          <Value>{formatDate(pdfInfo.uploadDate)}</Value>
        </InfoItem>
      </SidebarSection>
      
      <SidebarSection>
        <SidebarSectionTitle>Document Properties</SidebarSectionTitle>
        <InfoItem>
          <Label>Pages</Label>
          <Value>{pdfInfo.numPages || 'Unknown'}</Value>
        </InfoItem>
      </SidebarSection>
    </SidebarWrapper>
  );
};

export default Sidebar;
