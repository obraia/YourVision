import styled from 'styled-components';
import { lighten } from 'polished';

export const Container = styled.label.attrs({
  type: 'button',
})<{ $active: boolean, width: string }>`
  width: ${({ width }) => width};
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-block: 7.5px;
  padding-inline: 5px;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textBackground};
  transition: 0.2s;
  cursor: pointer;

  &::before {
    content: '';
    width: 40px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background-color: ${({ theme }) => lighten(0.12, theme.colors.textBackground)};
  }

  &::after {
    content: '';
    height: calc(100% - 4px);
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 7px;
    border-radius: 100%;
    background-color: ${({ theme }) => theme.colors.textPrimary};
    transition: 0.2s;
  }

  &:has(input:checked) {
    &::before {
      background-color: ${({ theme }) => theme.colors.primary};
    }

    &::after {
      transform: translateX(calc(100% + 4px));
    }
  }
`;

export const Input = styled.input.attrs({ type: 'checkbox' })`
  display: none;
`;
