import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
    user-select: none;
    font-family: Poppins, sans-serif;
    -webkit-tap-highlight-color: transparent;
  }

  input {
    user-select: text;
  }

  html {
    scrollbar-color: #6969dd #e0e0e0;
    scrollbar-width: thin;
    overflow: hidden;
  }

  #root {
    height: ${window.innerHeight}px;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.background};
  }

  button {
    cursor: pointer;
    border: none;
  }

  img {
    -webkit-user-drag: none;
  }

  /* Remove Arrows/Spinners */
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

  /* Remover background do autocomplete */
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active{
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: ${({ theme }) =>
      theme.colors.textBackground} !important;
  }

  /* Inverter cor do ícone de calendário do input date no chrome */
  ::-webkit-calendar-picker-indicator {
    ${({ theme }) => theme.title === 'dark' && 'filter: invert(0.8);'}
  }

  input[type="search"] {
    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      display: none;
    }
  }

  /* Color of text selection */
  ::-moz-selection { /* Code for Firefox */
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.primary};
  }

  ::selection {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.primary};
  }
`

export { GlobalStyle }
