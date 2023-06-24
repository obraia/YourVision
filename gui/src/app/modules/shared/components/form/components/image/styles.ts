import styled from 'styled-components';
import { lighten, transparentize } from 'polished';

export const Container = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  height: min-content;
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

export const Legend = styled.span`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
`;

export const Input = styled.input.attrs({
  type: 'file',
  title: 'Upload',
})`
display: none;
`;

export const Image = styled.div<{ src: string }>`
  width: 100%;
  aspect-ratio: 3/2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  border-radius: 5px;
  background-image: url(${(props) => props.src});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  font-size: 48px;
  color: ${({ theme }) => transparentize(0.5, theme.colors.textBackground)};
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => transparentize(0.5, theme.colors.textBackground)};
    color: ${({ theme }) => transparentize(0.25, theme.colors.textBackground)};
  }

  /* On fille drag */

  &.dragover {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
    color: ${({ theme }) => transparentize(0.3, theme.colors.textBackground)};
    border: 1px dashed ${({ theme }) => theme.colors.primary};
  }

  /* On fille drag over */

  &.dragging-over {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
    color: ${({ theme }) => transparentize(0.3, theme.colors.textBackground)};
  }

  svg {
    pointer-events: none;
  }
`;