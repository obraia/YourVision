import styled from 'styled-components';
import { lighten, transparentize } from 'polished';
import { css } from 'styled-components';
import { Scroll } from '../../../layout/scroll';

export const OuterContainer = styled.div`
  width: 1000%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
`;

export const Container = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  height: min-content;
  display: flex;
  position: relative;
  flex-direction: column;
  padding-inline: 5px;
  gap: 5px;
`;

export const Label = styled.label`
  width: fit-content;
  display: flex;
  gap: 5px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textBackground};
`;

export const Legend = styled.span`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
`;

export const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

export const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  height: 35px;
  border: 0;
  padding: 0 10px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  border-radius: ${({ theme }) => theme.metrics.radius};
  background-color: ${({ theme }) => lighten(0.12, theme.colors.background)};
  color: ${({ theme }) => theme.colors.textBackground};
  cursor: pointer;

  &:focus {
    outline: none;
    background-color: ${({ theme }) => lighten(0.15, theme.colors.background)};
  }

  &:disabled {
    background-color: ${({ theme }) => transparentize(0.3, theme.colors.background)};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => transparentize(0.5, theme.colors.textBackground)};
  }

  ${({ theme, error }) => error && `border: 2px solid ${theme.colors.error};`}
`;

export const Arrow = styled.div`
  height: 100%;
  display: flex;
  position: absolute;
  right: 10px;
  align-items: center;
  color: ${({ theme }) => theme.colors.textBackground};
  pointer-events: none;
  transition: transform 0.2s ease-in-out;

  &.active {
    transform: rotate(180deg);
  }
`;

export const OptionsList = styled(Scroll)<{ $bottom: boolean }>`
  width: 100%;
  max-height: 260px;
  display: flex;
  position: absolute;
  flex-direction: column;
  top: calc(100% + 5px);
  left: 0;
  margin: 0;
  padding: 5px;
  list-style: none;
  background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
  border-radius: ${({ theme }) => theme.metrics.radius};
  box-shadow: 0px 0px 10px #00000030;
  overflow-y: auto;
  transition: opacity 0.2s ease-in-out;
  z-index: 1;

  ${({ $bottom }) => $bottom && css`top: unset; bottom: calc(100% + 5px);`}
`;

export const Option = styled.li`
  max-height: 35px;
  min-height: 35px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.metrics.inner_radius};
  color: ${({ theme }) => theme.colors.textBackground};

  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;
