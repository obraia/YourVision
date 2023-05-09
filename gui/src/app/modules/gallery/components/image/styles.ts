import styled from 'styled-components'
import { lighten, transparentize } from 'polished'

export const Container = styled.div<{ isDragging?: Boolean }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  padding: ${({ theme }) => theme.metrics.padding};
  gap: ${({ theme }) => theme.metrics.gap};
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  border-radius: ${({ theme }) => theme.metrics.radius};
  background-color: ${({ theme }) => lighten(0.05, theme.colors.background)};
  color: ${({ theme }) => theme.colors.textBackground};
  text-align: center;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #00000010;
  }
`

export const Name = styled.div`
  font-size: 14px;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.textBackground};
`

export const Img = styled.img`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.metrics.inner_radius};
`;