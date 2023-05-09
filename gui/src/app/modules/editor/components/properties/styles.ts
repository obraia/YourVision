import styled from 'styled-components';
import { darken, desaturate, lighten, transparentize } from 'polished';
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

export const Button = styled.button<{ $progress: number }>`
  min-height: 45px;
  max-height: 45px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto 10px 10px 10px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.metrics.radius};
  font-size: 14px;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  transition: 0.2s;

  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.colors.primary)};
  }

  &:disabled {
    pointer-events: none;
    background-color: ${({ theme }) => desaturate(1, theme.colors.primary)};
    cursor: not-allowed;
  }

  &::before {
    content: '';
    width: ${({ $progress }) => ($progress || 0)}%;
    height: 100%;
    position: absolute;
    left: 0;
    background-color: ${({ theme }) => theme.colors.primary};
    z-index: 0;
  }
`;

export const ButtonText = styled.span`
  z-index: 1;
`;