import styled from 'styled-components';
import { darken, transparentize } from 'polished';

export const Container = styled.div<{ isDragging?: Boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  padding: 10px;
  gap: 20px;
  background-color: ${({ theme }) => transparentize(0.2, theme.colors.background)};
  backdrop-filter: blur(10px);
`

export const Button = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 20px;
  font-size: 20px;
  background-color: ${({ theme }) => theme.colors.textBackground};
  color: ${({ theme }) => theme.colors.background};

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.textBackground)};
  }

  &:disabled {
    opacity: 0.25;
    pointer-events: none;
  }

  &:active {
    transform: scale(0.95);
  }
`;