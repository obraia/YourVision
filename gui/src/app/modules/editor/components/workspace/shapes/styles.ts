import styled from 'styled-components';

export const Container = styled.div<{ $width: number, $height: number }>`
  width: ${({ $width }) => $width + 'px'};
  height: ${({ $height }) => $height + 'px'};
  position: absolute;
  pointer-events: none;
  z-index: 2;

  & > {
    .selected {
      outline: 2px dashed gray;
    }
  }
`; 
