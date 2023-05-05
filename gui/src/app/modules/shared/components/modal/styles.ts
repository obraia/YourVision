import { darken, lighten } from 'polished'
import styled, { css } from 'styled-components'
import { Button } from '../button/styles'

export const Center = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  z-index: 10;
  padding: ${({ theme }) => theme.metrics.padding};
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
`

export const Container = styled.div<{ width?: string }>`
  width: ${(props) => props.width || '75%'};
  max-width: 680px;
  display: flex;
  flex-direction: column;
  z-index: 10;

  @media (max-width: ${({ theme }) => theme.metrics.tablet_small}) {
    min-width: 90%;
  }
`

export const Header = styled.div`
  width: 100%;
  height: 58px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.metrics.padding};
  border-top-left-radius: ${({ theme }) => theme.metrics.radius};
  border-top-right-radius: ${({ theme }) => theme.metrics.radius};
  background-color: ${({ theme }) => lighten(0.05, theme.colors.background)};
  pointer-events: painted;
`

export const Title = styled.h1`
  margin-left: 10px;
  font-size: 20px;
  font-weight: lighter;
  color: ${({ theme }) => theme.colors.textBackground};
`

export const HeaderButton = styled(Button)`
  height: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.metrics.inner_radius};
  color: ${({ theme }) => theme.colors.textBackground};
`

export const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.metrics.padding};
  gap: 20px;
  border-bottom-left-radius: ${({ theme }) => theme.metrics.radius};
  border-bottom-right-radius: ${({ theme }) => theme.metrics.radius};
  background-color: ${({ theme }) => lighten(0.05, theme.colors.background)};
`

export const ModalFooter = styled.div`
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.metrics.gap};
`

export const ModalFooterButton = styled(Button)`
  min-width: 70px;
  height: 100%;
  padding: ${({ theme }) => theme.metrics.padding};
  border-radius: ${({ theme }) => theme.metrics.inner_radius};
  color: ${({ theme }) => theme.colors.textBackground};
  font-size: 14px;

  &.confirm {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textPrimary};

    &:hover {
      background-color: ${({ theme }) => darken(0.05, theme.colors.primary)};
    }

    &:active {
      background-color: ${({ theme }) => darken(0.1, theme.colors.primary)};
    }
  }

  &.cancel {
    background-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.textError};

    &:hover {
      background-color: ${({ theme }) => darken(0.05, theme.colors.error)};
    }

    &:active {
      background-color: ${({ theme }) => darken(0.1, theme.colors.error)};
    }
  }
`

export const ModalFooterCheckbox = styled.div<{ checked?: boolean }>`
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: auto;
  gap: 7px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textBackground};
  cursor: pointer;

  &::before {
    content: '';
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-left: 2px;
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    box-sizing: border-box;
  }

  ${({ checked }) =>
    checked &&
    css`
      &::before {
        border: 3px solid ${({ theme }) => lighten(0.05, theme.colors.background)};
        background-color: ${({ theme }) => theme.colors.primary};
      }
    `}
`
