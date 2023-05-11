import styled from 'styled-components';
import { transparentize } from 'polished';

export const Container = styled.div.attrs({
  onClick: (e) => e.stopPropagation(),
  })`
    width: 420px;
    position: absolute;
    bottom: 30px;
    right: 30px;
    display: flex;
    flex-direction: column;
    padding: 30px;
    gap: 15px;
    border-radius: ${({ theme }) => theme.metrics.radius};
    background-color: ${({ theme }) => transparentize(0.2, theme.colors.background)};
`;

export const Field = styled.div`
    display: flex;
    gap: 10px;
    color: ${({ theme }) => theme.colors.textBackground};
`;