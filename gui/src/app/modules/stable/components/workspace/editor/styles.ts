import { lighten } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  border-radius: 10px;
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    max-height: 400px;
  }
`;

export const Canvas = styled.canvas<{ cursor?: string }>`
  z-index: 1;
  cursor: ${({ cursor }) => cursor || 'none'};
`;

export const Image = styled.img`
  position: fixed;
  object-fit: contain;
  border: 2px dashed ${({ theme }) => lighten(0.08, theme.colors.primary)};
  z-index: 0;
`;

export const CursorWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  pointer-events: none;
  mix-blend-mode: difference;
  z-index: 100;
  
  svg {
    fill: white;
    font-size: 24px;
  }
`;

export const BrushIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  visibility: hidden;
  border-radius: 50%;
  background-color: white;
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 100;
`;

export const ImageInfo = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: ${({ theme }) => theme.metrics.gap};
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  z-index: 2;
`;
