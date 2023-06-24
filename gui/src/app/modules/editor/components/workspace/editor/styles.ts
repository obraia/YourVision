import { lighten, transparentize } from 'polished';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  border-radius: 10px;
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  overflow: hidden;

  /* On fille drag */
  &.dragover {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
    color: ${({ theme }) => transparentize(0.3, theme.colors.textBackground)};
    border: 2px dashed ${({ theme }) => theme.colors.primary};

    &::before {
      content: 'Drop here';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 32px;
      font-weight: 600;
      color: ${({ theme }) => transparentize(0.5, theme.colors.textBackground)};
      z-index: 2;
    }

    #border {
      pointer-events: none;
      opacity: 0.75;
    }
  }

  /* On fille drag over */
  &.dragging-over {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
    color: ${({ theme }) => transparentize(0.3, theme.colors.textBackground)};
  }
`;

export const Border = styled.div<{ $width: number, $height: number }>`
  min-width: ${({ $width }) => $width + 'px'};
  min-height: ${({ $height }) => $height + 'px'};
  position: relative;
  outline: 2px dashed ${({ theme }) => lighten(0.08, theme.colors.primary)};
  overflow: hidden;
  z-index: 3;
`; 

export const Layer = styled.div<{ 
  $width: number, 
  $height: number, 
  $visible: boolean, 
  $selected: boolean, 
  $locked: boolean,
  $zIndex: number
}>`
  position: absolute;
  width: ${({ $width }) => $width + 'px'};
  height: ${({ $height }) => $height + 'px'};
  z-index: ${({ $zIndex }) => $zIndex};

  ${({ $visible }) => !$visible && css`
    visibility: hidden;
  `}

  ${({ $selected }) => !$selected && css`
    pointer-events: none;
  `}

  ${({ $locked }) => $locked && css`
    cursor: not-allowed;

    * { 
      pointer-events: none;
    }
  `}
`;

export const Canvas = styled.canvas<{ cursor?: string }>`
  position: absolute;
  z-index: 1;
  cursor: ${({ cursor }) => cursor || 'none'};
`;

export const MaskOverlay = styled.div<{ $width: number, $height: number }>`
  position: absolute;
  width: ${({ $width }) => $width + 'px'};
  height: ${({ $height }) => $height + 'px'};
  background-color: #FFFFFF00;
  opacity: 0.8;
  background: repeating-linear-gradient( 45deg, #FFFFFF, #FFFFFF 5px, #FFFFFF00 5px, #FFFFFF00 15px );
  mask-image: linear-gradient( 45deg, transparent 5px, black 5px, black 15px, transparent 15px );
  z-index: 2;
`;

export const Shapes = styled.div<{ $width: number, $height: number }>`
  width: ${({ $width }) => $width + 'px'};
  height: ${({ $height }) => $height + 'px'};
  position: absolute;
  pointer-events: none;
  z-index: 2;
`; 

export const Image = styled.img`
  position: fixed;
  object-fit: contain;
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
  color: white;
  
  svg {
    fill: white;
    font-size: 24px;
    z-index: 100;
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

export const TextIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  visibility: hidden;
  display: flex;
  justify-content: center;
  pointer-events: none;
  mix-blend-mode: difference;
  z-index: 100;

  &::before {
    content: '';
    width: 3px;
    height: 100%;
    background-color: white;
  }
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

export const LayerName = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => transparentize(0.5, theme.colors.primary)};
`;