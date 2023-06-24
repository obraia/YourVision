import styled, { css } from 'styled-components';
import { lighten, transparentize } from 'polished';

export const Container = styled.div`
  min-height: 100px;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    min-height: 60px;
  }
`;

export const Layer = styled.div<{ selected?: boolean }>`
  max-width: 100px;
  max-height: 100px;
  min-width: 100px;
  min-height: 100px;
  display: flex;
  position: relative;
  border-radius: ${({ theme }) => theme.metrics.radius};
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    object-fit: contain;
    border-radius: ${({ theme }) => theme.metrics.radius};
  }

  ${({ selected, theme }) => selected && css`
      &::after {
        content: '';
        position: absolute;
        width: 96px;
        height: 96px;
        border: 2px solid ${theme.colors.primary};
        border-radius: ${({ theme }) => theme.metrics.radius};
        pointer-events: none;
      }
  `}

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    min-width: 60px;
    min-height: 60px;
    max-width: 60px;
    max-height: 60px;

    ${({ selected, theme }) => selected && css`
      &::after {
        content: '';
        position: absolute;
        width: 56px;
        height: 56px;
        border: 2px solid ${theme.colors.primary};
        border-radius: ${({ theme }) => theme.metrics.radius};
        pointer-events: none;
      }
    `}
  }
`;

export const LockIndicator = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 5px;
  left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${({ theme }) => transparentize(0.45, lighten(0.08, theme.colors.background))};
  color: ${({ theme }) => theme.colors.textBackground};
  font-size: 14px;
`;

export const VisibilityButton = styled.button`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  outline: none;
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  color: ${({ theme }) => theme.colors.textBackground};
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;
