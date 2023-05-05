import styled from 'styled-components';
import { lighten, transparentize } from 'polished';

export const Container = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  height: min-content;
  display: flex;
  flex-direction: column;
  position: relative;
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

export const ArrowsContainer = styled.div`
  width: 20px;
  height: 35px;
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 5px;
  bottom: 0;
`;

export const ArrowButtonTop = styled.button`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  border-top-right-radius: ${({ theme }) => theme.metrics.radius};
  background-color: ${({ theme }) => lighten(0.12, theme.colors.background)};
  color: ${({ theme }) => theme.colors.textBackground};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => lighten(0.15, theme.colors.background)};
  }
`;

export const ArrowButtonBottom = styled.button`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  border-bottom-right-radius: ${({ theme }) => theme.metrics.radius};
  border-top: none;
  background-color: ${({ theme }) => lighten(0.12, theme.colors.background)};
  color: ${({ theme }) => theme.colors.textBackground};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => lighten(0.15, theme.colors.background)};
  }
`;

export const Legend = styled.span`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
`;

export const InputStyle = styled.input<{ error?: boolean }>`
  width: 100%;
  height: 35px;
  border: 0;
  padding: 0 10px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  border-radius: ${({ theme }) => theme.metrics.radius};
  background-color: ${({ theme }) => lighten(0.12, theme.colors.background)};
  color: ${({ theme }) => theme.colors.textBackground};

  &:focus {
    outline: none;
    background-color: ${({ theme }) => lighten(0.15, theme.colors.background)};
  }

  &:disabled {
    background-color: ${({ theme }) => transparentize(0.3, theme.colors.background)};
    cursor: context-menu;
  }

  &::placeholder {
    color: ${({ theme }) => transparentize(0.5, theme.colors.textBackground)};
  }

  ${({ theme, error }) => error && `border: 2px solid ${theme.colors.error};`}
`;
