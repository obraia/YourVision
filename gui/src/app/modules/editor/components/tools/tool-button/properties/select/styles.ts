import styled from 'styled-components';
import { lighten, transparentize } from 'polished';
import { Scroll } from '../../../../../../shared/components/layout/scroll';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.label`
  width: 100%;
  height: 20px;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  color: ${({ theme }) => theme.colors.textBackground};
`;


export const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

export const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  height: 30px;
  border: 0;
  padding-left: 10px;
  padding-right: 35px;
  font-size: 12px;
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  border-radius: 5px;
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

export const OptionsList = styled(Scroll)`
  max-height: 260px;
  display: none;
  position: absolute;
  flex-direction: column;
  margin: 0;
  gap: 5px;
  padding: 5px;
  list-style: none;
  border-radius: 5px;
  background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
  box-shadow: 0px 0px 10px #00000030;
  overflow-y: auto;
  transition: opacity 0.2s ease-in-out;

  &.active {
    display: flex;
    z-index: 999;
  }
`;

export const Option = styled.li`
  width: 100%;
  max-height: 35px;
  min-height: 35px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 12px;
  border-radius: ${({ theme }) => theme.metrics.inner_radius};
  color: ${({ theme }) => theme.colors.textBackground};

  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export const OptionLabel = styled.span`
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;