import styled from 'styled-components';
import { lighten, transparentize } from 'polished';
import { Scroll } from '../../../shared/components/layout/scroll';

export const Container = styled.aside`
  width: 340px;
  min-width: 240px;
  max-width: 1000px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 5px;
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    width: 100%;
  }

  @media (max-width: ${({ theme }) => theme.metrics.desktop_small}) {
    min-width: 100%;
    max-width: 100%;
  }
`;

export const PropertiesWrapper = styled(Scroll)`
  height: 100%;
  display: flex;
  border-bottom: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  overflow-y: auto;
`;

export const Gutter = styled.div`
  width: 5px;
  height: 100%;
  position: absolute;
  left: -2.5px;
  cursor: col-resize;
  z-index: 1;

  &:hover {
    background-color: ${({ theme }) => transparentize(0.8, theme.colors.primary)};
  }
`;