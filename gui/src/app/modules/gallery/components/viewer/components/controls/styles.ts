import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div.attrs({
  onClick: (e) => e.stopPropagation(),
})<{ isDragging?: Boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 30px;

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    width: 100%;
    justify-content: space-between;
    padding: 10px;
  }
`

export const Button = styled.button`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  font-size: 22px;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.textBackground};

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.textBackground)};
  }

  &:disabled {
    opacity: 0.25;
    pointer-events: none;
  }

  &:active {
    transform: scale(0.95);
  }
`
