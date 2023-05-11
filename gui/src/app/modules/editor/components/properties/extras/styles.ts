import styled from 'styled-components';
import { lighten, transparentize } from 'polished';

export const Container = styled.div<{ $isExpanded: boolean }>`
  grid-area: extras;
  width: ${({ $isExpanded }) => $isExpanded ? '61px' : '0px'};
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: ${({ $isExpanded }) => $isExpanded ? '10px' : '0px'};
  border-right: ${({ theme, $isExpanded }) => ($isExpanded ? '1px' : '0px') + ' solid ' + transparentize(0.8, theme.colors.textBackground)};
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  transition-duration: .2s;
  transition-property: width, padding;
  transition-timing-function: ease-in-out;

  & > div {
    width: ${({ $isExpanded }) => $isExpanded ? '40px' : '0px'};
    height: ${({ $isExpanded }) => $isExpanded ? '40px' : '0px'};
  }

  @media (max-width: ${({ theme }) => theme.metrics.desktop_small}) {
    min-width: 100%;
    max-width: 100%;
    height: auto;
  }

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    width: 100%;
  }
`;

export const ToogleButton = styled.button`
  width: 15px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  left: -15px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.primary)};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 22px;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.metrics.desktop_small}) {
    width: 20px;
    height: 25px;
    left: initial;
    right: -20px;
    transform: rotate(180deg);
  }
`;