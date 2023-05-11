import styled from 'styled-components';
import { transparentize } from 'polished';

export const Container = styled.div<{ isDragging?: Boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  padding: 30px;
  gap: 20px;
  background-color: ${({ theme }) => transparentize(0.2, theme.colors.background)};
  backdrop-filter: blur(10px);
`

export const Name = styled.div.attrs({
  onClick: (e) => e.stopPropagation(),
})`
  font-size: 16px;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.textBackground};
`

export const Img = styled.img.attrs({
  onClick: (e) => e.stopPropagation(),
})`
    max-width: 100%;
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.metrics.radius};
`;
