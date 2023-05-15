import { lighten } from "polished";
import { css, styled } from "styled-components";

export const Container = styled.div<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.metrics.radius};
  background-color: ${({ theme }) => lighten(0.12, theme.colors.background)};
  color: ${({ theme }) => theme.colors.textBackground};
  transition: .2s;
  z-index: 10;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
    color: ${({ theme }) => lighten(0.08, theme.colors.primary)};
  }

  ${({ $active }) => $active && css`
    color: ${({ theme }) => lighten(0.06, theme.colors.primary)};
  `}
`;

export const PropertiesIndicator = styled.div`
  width: 0; 
  height: 0;
  position: absolute;
  left: 5px;
  bottom: 5px;
  rotate: 45deg;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid ${({ theme }) => theme.colors.textBackground};

  @media (max-width: ${({ theme }) => theme.metrics.desktop_small}) {
    left: auto;
    right: 5px;
    rotate: -45deg;
  }
`;
