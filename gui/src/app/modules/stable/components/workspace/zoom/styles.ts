import styled, { css } from "styled-components";
import { transparentize } from "polished";

export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: grab;
  z-index: 2;

  ${({ theme }) => css`
    background-size: 30px 30px;
    background-position: center;
    background-image: 
      linear-gradient(${transparentize(0.9, theme.colors.textBackground)} .1em, transparent .1em), 
      linear-gradient(90deg, ${transparentize(0.9, theme.colors.textBackground)} .1em, transparent .1em);
  `}
`;