import styled from 'styled-components';
import { darken, lighten, transparentize } from 'polished';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  grid-area: menu;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  gap: 5px;
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  border-bottom: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  transition: .2s;

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    width: 100%;
    flex-direction: row;
    border-bottom: none;
    border-top: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  }
`;

export const MenuItems = styled.nav`
  width: 100%;
  height: 100%;
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.textBackground};

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    flex-direction: row;
  }
`;

export const MenuItem = styled(Link)`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 5px;
  font-size: 16px;
  white-space: nowrap;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textBackground};
  overflow: hidden;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => darken(0.005, theme.colors.background)};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => transparentize(0.8, theme.colors.primary)};
    pointer-events: none;
  }

  svg {
    min-width: 20px;
  }

  @media (max-width: ${({ theme }) => theme.metrics.desktop_small}) {
    width: 30px;
    height: 30px;
    font-size: 22px;

    span {
      display: none;
    }
  }
`;

export const Spacer = styled.div`
  flex: 1;
`;