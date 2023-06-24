import styled, { css } from 'styled-components';
import { lighten, transparentize } from 'polished';
import { Scroll } from '../../../../../../shared/components/layout/scroll';

export const Container = styled(Scroll)`
  max-height: 300px;
  display: flex;
  flex-direction: column-reverse;
  padding: 5px;
  gap: 5px;
  border-radius: 5px;
  background-color: ${({ theme }) => lighten(0.12, theme.colors.background)};
  overflow-y: auto;
`;

export const Layer = styled.div<{ $selected?: boolean, $mask?: boolean }>`
  width: 100%;
  max-height: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 5px;
  border-radius: 5px;
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => lighten(0.06, theme.colors.background)};
  }

  &::after {
    content: '';
    width: ${({ $selected }) => $selected ? 'calc(100% - 4px)' : 'calc(100% - 2px)'};
    height: ${({ $selected }) => $selected ? '36px' : '38px'};
    position: absolute;
    top: 0;
    left: 0;
    border: ${({ $selected, theme }) => $selected ? `2px solid ${theme.colors.primary}` : `1px solid ${transparentize(0.8, theme.colors.textBackground)}`};
    border-radius: 5px;
    pointer-events: none;
  }

  ${({ $mask, theme }) => $mask && css`
    background-size: 30px 30px;
    background-position: center;
    background: repeating-linear-gradient(
      45deg, 
      ${transparentize(0.75, theme.colors.primary)}, 
      ${transparentize(0.75, theme.colors.primary)} 
      5px, 
      #FFFFFF00 
      5px, 
      #FFFFFF00 
      10px 
    );
  `}
`;

export const Preview = styled.div<{ $src?: string }>`
    width: 30px;
    height: 30px;
    border-radius: 5px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: ${({ $src }) => $src ? `url(${$src})` : 'none'};
    background-color: ${({ theme }) => lighten(0.12, theme.colors.background)};
`;

export const Label = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textBackground};
`;

export const LockIndicator = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  color: ${({ theme }) => theme.colors.textBackground};
  font-size: 14px;
`;

export const VisibilityButton = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  outline: none;
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  color: ${({ theme }) => theme.colors.textBackground};
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    background-color: ${({ theme }) => lighten(0.05, theme.colors.background)};
  }

  &:active {
    transform: scale(0.95);
  }
`;
