import styled from 'styled-components';
import { lighten, transparentize } from 'polished';

export const Container = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  border-radius: ${({ theme }) => theme.metrics.radius};
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  font-size: 22px;
  font-weight: bolder;
  color: ${({ theme }) => transparentize(0.5, theme.colors.textBackground)};
  overflow: hidden;
  z-index: 1;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
    color: ${({ theme }) => transparentize(0.3, theme.colors.textBackground)};
  }

  /* On fille drag */

  &.dragover {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
    color: ${({ theme }) => transparentize(0.3, theme.colors.textBackground)};
    border: 2px dashed ${({ theme }) => theme.colors.primary};
  }

  /* On fille drag over */

  &.dragging-over {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
    color: ${({ theme }) => transparentize(0.3, theme.colors.textBackground)};
  }
`;

export const Input = styled.input.attrs({
    type: 'file',
    title: 'Upload',
  })`
  display: none;
`;