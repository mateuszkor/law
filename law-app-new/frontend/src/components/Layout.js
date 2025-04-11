import React from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const LeftSidebar = styled.aside`
  width: 200px;
  background-color: var(--secondary-color);
  padding: 20px;
  border-right: 1px solid var(--light-gray);
  overflow-y: auto;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f8f9fa;
`;

const RightSidebar = styled.aside`
  width: 400px;
  background-color: var(--secondary-color);
  padding: 20px;
  border-left: 1px solid var(--light-gray);
  overflow-y: auto;
`;

const Layout = ({ children, leftSidebar, rightSidebar }) => {
  return (
    <LayoutContainer>
      <LeftSidebar>{leftSidebar}</LeftSidebar>
      <MainContent>{children}</MainContent>
      <RightSidebar>{rightSidebar}</RightSidebar>
    </LayoutContainer>
  );
};

export default Layout;
