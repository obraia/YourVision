import { lighten, transparentize } from 'polished';
import styled from 'styled-components';

export const Container = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  display: flex;
  flex-direction: column;
  padding-inline: 5px;
  gap: 5px;
`;

export const Label = styled.label`
  width: fit-content;
  display: flex;
  gap: 5px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textBackground};
`;

export const Input = styled.input.attrs({
  type: 'range',
})`
  width: 100%;
  height: 5px;
  position: relative;
  margin-block: 15px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => lighten(0.12, theme.colors.background)};
  appearance: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }

  &::-ms-thumb {
    width: 15px;
    height: 15px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;