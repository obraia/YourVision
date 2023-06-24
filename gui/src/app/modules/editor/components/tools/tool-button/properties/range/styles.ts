import { lighten, transparentize } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.label`
  width: 100%;
  height: 20px;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  color: ${({ theme }) => theme.colors.textBackground};
`;

export const Input = styled.input.attrs({
  type: 'range',
})`
  width: 100%;
  height: 5px;
  position: relative;
  margin-block: 10px;
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