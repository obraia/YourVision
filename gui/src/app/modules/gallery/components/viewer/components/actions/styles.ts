import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  padding: 20px;
  gap: 20px;
`

export const Button = styled.button`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  font-size: 22px;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.textBackground};

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
`
