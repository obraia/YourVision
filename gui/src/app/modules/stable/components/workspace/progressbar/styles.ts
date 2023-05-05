import styled from 'styled-components';
import { lighten } from 'polished';


export const Container = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 10px;
  background-color: ${({ theme }) => lighten(0.08, theme.colors.background)};
  overflow: hidden;
`;

export const Progress = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => `${$progress}%`};
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const ProgressText = styled.span`
  font-size: 14px;
  font-weight: 600;
  mix-blend-mode: difference;
  color: ${({ theme }) => theme.colors.textPrimary};
  z-index: 1;
`;
