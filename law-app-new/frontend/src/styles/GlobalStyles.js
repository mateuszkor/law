import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #409fff;
    --secondary-color: #f2f2f2;
    --text-color: #333333;
    --light-gray: #e6e6e6;
    --white: #ffffff;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: var(--text-color);
    background-color: var(--white);
    line-height: 1.6;
  }

  button {
    cursor: pointer;
    border: none;
    background-color: var(--primary-color);
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: #3088e0;
    }
  }
`;

export default GlobalStyles;
