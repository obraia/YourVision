import styled from 'styled-components';
import { lighten, transparentize } from 'polished';
import { Scroll } from '../../../shared/components/layout/scroll';

export const Container = styled.div`
  min-width: 5px;
  max-width: 1000px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.metrics.gap};
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};

  @media (max-width: ${({ theme }) => theme.metrics.desktop_small}) {
    min-width: 100%;
    max-width: 100%;
    height: auto;
  }

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    width: 100%;
  }
`;

export const ToolsWrapper = styled(Scroll)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};

  @media (max-width: ${({ theme }) => theme.metrics.desktop_small}) {
    flex-direction: row;
  }
`;

export const Gutter = styled.div`
  width: 5px;
  height: 100%;
  position: absolute;
  right: -2.5px;
  cursor: col-resize;
  z-index: 1;

  &:hover {
    background-color: ${({ theme }) => transparentize(0.8, theme.colors.primary)};
  }
`;