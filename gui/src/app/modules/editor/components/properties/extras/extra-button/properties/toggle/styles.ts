import { lighten } from 'polished';
import styled, { css } from 'styled-components';

export const Container = styled.label<{ $active?: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textBackground};
  transition: 0.2s;
  cursor: pointer;

  &::before {
    content: '';
    height: 15px;
    aspect-ratio: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-color: ${({ theme }) => lighten(0.05, theme.colors.background)};

    ${({ $active }) => $active && css`
      background-color: ${({ theme }) => theme.colors.primary};
    `}
  }

  &::after {
    content: '';
    height: calc(100% - 4px);
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 2px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.textPrimary};
    transition: 0.2s;

    ${({ $active }) => $active && css`
      transform: translateX(calc(100% + 2px));
    `}
  }
`