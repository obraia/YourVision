import { transparentize } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  width: calc(100% + 10px);
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  margin-top: 10px;
  margin-inline: -5px;
  border-top: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
`;

export const Label = styled.label`
  font-size: 11px;
  font-weight: bolder;
  text-transform: uppercase;
  color: ${({ theme }) => transparentize(0.5, theme.colors.textBackground)};
`;
