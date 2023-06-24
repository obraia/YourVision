import { lighten, transparentize } from 'polished';
import styled, { css } from 'styled-components';

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

export const ColorsWrapper = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  row-gap: 10px;
`;

export const Button = styled.button<{ $selected: string }>`
  min-width: calc((100% / 6) - 5px);
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 16px;
  background-color: ${({ theme }) => lighten(0.12, theme.colors.background)};
  color: ${({ theme }) => theme.colors.textBackground};

  &:hover {
    transform: scale(1.1);
  }

  ${({ $selected }) => $selected && css`
    border: 2px solid ${({ theme }) => theme.colors.textBackground};  
  `}
`;