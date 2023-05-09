import { lighten, transparentize } from 'polished';
import styled from 'styled-components';

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

export const Track = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 4px;
  background-color: ${({ theme }) => lighten(0.12, theme.colors.background)};
`;

export const Thumb = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textBackground)};
  background-color: ${({ theme }) => lighten(0.2, theme.colors.background)};
`;