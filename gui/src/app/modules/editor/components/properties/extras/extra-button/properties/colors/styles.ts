import { transparentize } from 'polished';
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
  gap: 5px;
`;

export const Color = styled.button<{ $color: string, $selected: string }>`
  min-width: calc((100% / 5) - 5px);
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  background-color: ${({ $color }) => $color};

  &:hover {
    transform: scale(1.1);
  }

  ${({ $selected }) => $selected && css`
    border: 2px solid ${({ theme }) => theme.colors.textBackground};  
  `}
`;