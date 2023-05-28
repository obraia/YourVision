import styled from 'styled-components';
import { lighten, transparentize } from 'polished';

export const Container = styled.div`
  width: 100%;
  height: min-content;
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  row-gap: 10px;
`;

export const Label = styled.label`
  width: fit-content;
  display: flex;
  gap: 5px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textBackground};
`;

export const Legend = styled.span`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
`;

export const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

export const Button = styled.button.attrs({
  type: 'button'
  })`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.textBackground};
  color: ${({ theme }) => theme.colors.background};
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.textBackground)};
  }

  &:disabled {
    background-color: ${({ theme }) => transparentize(0.3, theme.colors.textBackground)};
    pointer-events: none;
  }

  &:active {
    transform: scale(0.9);
  }
`;