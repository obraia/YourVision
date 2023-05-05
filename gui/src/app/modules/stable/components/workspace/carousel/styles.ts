import styled, { css } from 'styled-components';
import { lighten } from 'polished';

export const Container = styled.div`
  min-height: 100px;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    min-height: 50px;
  }
`;

export const ImageContainer = styled.div<{ selected?: boolean }>`
  max-width: 100px;
  max-height: 100px;
  min-width: 100px;
  min-height: 100px;
  display: flex;
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
    img {
      border: 4px solid ${theme.colors.primary};
    }
  `}

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    min-width: 50px;
    min-height: 50px;
    max-width: 50px;
    max-height: 50px;

    ${({ selected, theme }) => selected && css`
      img {
        border: 2px solid ${theme.colors.primary};
      }
    `}
  }
`;