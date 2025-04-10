import React from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const SidebarContainer = styled.aside`
  width: 300px;
  background-color: var(--secondary-color);
  padding: 20px;
  border-left: 1px solid var(--light-gray);
  overflow-y: auto;
`;

const Layout = ({ children, sidebar }) => {
  return (
    <LayoutContainer>
      <MainContent>{children}</MainContent>
      <SidebarContainer>{sidebar}</SidebarContainer>
    </LayoutContainer>
  );
};

export default Layout;
