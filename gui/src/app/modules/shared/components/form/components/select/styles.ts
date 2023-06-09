import styled from 'styled-components';
import { lighten, transparentize } from 'polished';
import { Scroll } from '../../../layout/scroll';

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
  padding-left: 10px;
  padding-right: 35px;
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

export const OptionsList = styled.ul`
  max-height: 260px;
  display: none;
  position: absolute;
  flex-direction: column;
  margin: 0;
  gap: 5px;
  padding: 5px;
  list-style: none;
  background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
  border-radius: 10px;
  box-shadow: 0px 0px 10px #00000050;
  transition: opacity 0.2s ease-in-out;

  &.active {
    display: flex;
    z-index: 999;
  }

  &.empty {
    gap: 0;
  }
`;

export const OptionsScroll = styled(Scroll)`
  overflow: auto;
  border-radius: 5px;
  background-color: ${({ theme }) => lighten(0.075, theme.colors.background)};
`;

export const Option = styled.li`
  width: 100%;
  max-height: 35px;
  min-height: 35px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: ${({ theme }) => theme.colors.textBackground};
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  &.hidden {
    display: none;
  }
`;

export const OptionLabel = styled.span`
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const OptionSearch = styled.li.attrs({
  onMouseDown: (e: any) => e.stopPropagation(),
})`
  width: 100%;
  max-height: 35px;
  min-height: 35px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => lighten(0.075, theme.colors.background)};
`;

export const OptionSearchInput = styled.input.attrs({
  placeholder: 'Search...',
  type: 'search',
  onMouseDown: (e: any) => e.stopPropagation(),
})`
  width: 100%;
  height: 100%;
  font-size: 16px;
  border: none;
  color: ${({ theme }) => theme.colors.textBackground};
  background-color: transparent;
`;