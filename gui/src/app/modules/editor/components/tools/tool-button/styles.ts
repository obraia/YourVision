import { lighten } from "polished";
import { css, styled } from "styled-components";

export const Container = styled.div<{ $active?: boolean, $expanded?: boolean }>`
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

  ${({ $expanded }) => $expanded && css`
    width: 100%;
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    padding: 5px;
    font-size: 12px;
  `}
`;

export const LabelContainer = styled.div<{ $expanded?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $expanded }) => $expanded && css`
    gap: 5px;
    padding: 5px;
  `}
`;

export const Label = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

export const PropertiesIndicator = styled.div<{ $expanded?: boolean }>`
  width: 0; 
  height: 0;
  position: absolute;
  right: 5px;
  bottom: 5px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid ${({ theme }) => theme.colors.textBackground};
  rotate: -45deg;

  ${({ $expanded }) => $expanded && css`
    top: 25px;
    bottom: unset;
  `}
`;
