import { lighten, transparentize } from "polished";
import { css, styled } from "styled-components";

export const Container = styled.div<{ $expanded?: boolean }>`
  width: 240px;
  position: absolute;
  top: 0;
  left: 45px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  gap: 10px;
  padding: 10px;
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  box-shadow: 0 0 10px ${({ theme }) => transparentize(0.9, theme.colors.textBackground)};
  overflow: hidden;
  cursor: unset;
  z-index: 5;

  @media (max-width: ${({ theme }) => theme.metrics.desktop_small}) {
    top: 45px;
    left: 0;
  }

  ${({ $expanded }) => $expanded && css`
    width: 100%;
    position: relative;
    left: 0;
    border: none;
    border-radius: 5px;
    padding: 5px;
    box-shadow: none;
  `}
`;
