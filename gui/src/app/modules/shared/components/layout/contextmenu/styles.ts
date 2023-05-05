import styled, { css } from 'styled-components'
import { lighten } from 'polished'
import { Button } from '../../button/styles'

export const Container = styled.div<{ xPos: number; yPos: number }>`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  padding: 3px;
  gap: ${({ theme }) => theme.metrics.gap};
  border: 1px solid ${({ theme }) => lighten(0.4, theme.colors.textBackground)};
  border-radius: ${({ theme }) => theme.metrics.radius};
  background-color: ${({ theme }) => lighten(0.05, theme.colors.background)};
  box-shadow: 0px 0px 10px #00000020;

  transform: ${({ xPos, yPos }) =>
    css`
      translateX(min(${xPos}px, calc(100vw - 100%))) 
      translateY(min(${yPos}px, calc(100vh - 100%)))
    `};
`

export const MenuItems = styled.nav`
  width: 100%;
  height: min-content;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.metrics.gap};
`

export const MenuItem = styled(Button)`
  width: 100%;
  height: 30px;
  justify-content: start;
  padding: ${({ theme }) => theme.metrics.padding};
  gap: ${({ theme }) => theme.metrics.gap};
  border-radius: ${({ theme }) => theme.metrics.inner_radius};
  color: ${({ theme }) => theme.colors.textBackground};
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
`
