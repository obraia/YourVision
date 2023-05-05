import styled from 'styled-components';
import { darken, transparentize } from 'polished';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  gap: ${({ theme }) => theme.metrics.gap};
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

export const InputStyle = styled.input<{ error?: boolean }>`
  width: 100%;
  height: 40px;
  border: 0;
  padding: 0 10px;
  font-size: 14px;
  border-radius: ${({ theme }) => theme.metrics.inner_radius};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textBackground};

  &:focus {
    outline: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  }

  &:disabled {
    background-color: ${({ theme }) => transparentize(0.3, theme.colors.background)};
  }

  &::placeholder {
    color: ${({ theme }) => transparentize(0.5, theme.colors.textBackground)};
  }

  ${({ theme, error }) => error && `border: 2px solid ${theme.colors.error};`}
`;

export const RightButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.metrics.inner_radius};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textBackground};
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => darken(0.05, theme.colors.textBackground) };
  }
`;  