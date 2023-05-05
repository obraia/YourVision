import styled from 'styled-components';
import { darken, desaturate } from 'polished';

export const Container = styled.button<{ color: string }>`
  min-height: 45px;
  max-height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto 10px 10px 10px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.metrics.radius};
  font-size: 14px;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: 0.2s;

  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.colors.primary)};
  }

  &:disabled {
    pointer-events: none;
    background-color: ${({ theme }) => desaturate(1, theme.colors.primary)};
    cursor: not-allowed;
  }
`;
