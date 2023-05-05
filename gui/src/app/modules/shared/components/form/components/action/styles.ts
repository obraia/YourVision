import styled from 'styled-components';
import { lighten, transparentize } from 'polished';

export const Container = styled.button.attrs({
  type: 'button',
})<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: ${({ $width }) => $width};
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  border-radius: ${({ theme }) => theme.metrics.radius};
  background-color: ${({ theme }) => lighten(0.12, theme.colors.background)};
  color: ${({ theme }) => theme.colors.textBackground};

  &:hover {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
  }
`;
