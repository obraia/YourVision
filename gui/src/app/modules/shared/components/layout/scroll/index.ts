import { lighten } from 'polished'
import styled from 'styled-components'

export const Scroll = styled.div`
  ::-webkit-scrollbar {
    width: 14px;
  }

  ::-webkit-scrollbar-track {
    background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
    border-top-right-radius: ${({ theme }) => theme.metrics.radius};
    border-bottom-right-radius: ${({ theme }) => theme.metrics.radius};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.metrics.radius};
    border: 3px solid ${({ theme }) => lighten(0.08, theme.colors.background)};
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => lighten(0.05, theme.colors.primary)};
  }

  ::-webkit-scrollbar-button {
    height: 0;

    &:hover {
      background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
    }
  }

  // border radius vertical top
  ::-webkit-scrollbar-button:vertical:start {
    border-radius: ${({ theme }) =>
      `${theme.metrics.inner_radius} ${theme.metrics.inner_radius} 0 0`};
    /* border-bottom: 3px solid ${({ theme }) => theme.colors.background}; */
  }

  // border radius vertical bottom
  ::-webkit-scrollbar-button:vertical:end {
    border-radius: ${({ theme }) =>
      `0 0 ${theme.metrics.inner_radius} ${theme.metrics.inner_radius}`};
    /* border-top: 3px solid ${({ theme }) => theme.colors.background}; */
  }

  // border radius horizontal left
  ::-webkit-scrollbar-button:horizontal:start {
    border-radius: ${({ theme }) =>
      `${theme.metrics.inner_radius} 0 0 ${theme.metrics.inner_radius}`};
    border-right: 3px solid ${({ theme }) => theme.colors.background};
  }

  // border radius horizontal right
  ::-webkit-scrollbar-button:horizontal:end {
    border-radius: ${({ theme }) =>
      `0 ${theme.metrics.inner_radius} ${theme.metrics.inner_radius} 0`};
    border-left: 3px solid ${({ theme }) => theme.colors.background};
  }

  // fix double button
  ::-webkit-scrollbar-button:vertical:start:increment,
  ::-webkit-scrollbar-button:vertical:end:decrement,
  ::-webkit-scrollbar-button:horizontal:start:increment,
  ::-webkit-scrollbar-button:horizontal:end:decrement {
    display: none;
  }

  // fix resizer white
  ::-webkit-scrollbar-corner {
    background: transparent;
  }
`
