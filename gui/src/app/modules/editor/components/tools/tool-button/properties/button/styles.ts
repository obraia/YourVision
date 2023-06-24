import styled, { DefaultTheme } from 'styled-components';
import { darken, lighten } from 'polished';

export const Container = styled.button<{ 
    $backgroundColor: keyof DefaultTheme['colors'],
    $color: keyof DefaultTheme['colors'],
  }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ theme, $backgroundColor }) => theme.colors[$backgroundColor]};
  color: ${({ theme, $color }) => theme.colors[$color]};

  &:hover {
    background-color: ${({ theme, $backgroundColor }) => lighten(0.05, theme.colors[$backgroundColor])};
  }

  &:active {
    background-color: ${({ theme, $backgroundColor }) => darken(0.05, theme.colors[$backgroundColor])};
  }
`;
