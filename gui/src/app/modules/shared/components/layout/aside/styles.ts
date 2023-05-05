import styled from 'styled-components';

export const Aside = styled.div`
  grid-area: aside;
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.metrics.gap};

  @media (max-width: ${({ theme }) => theme.metrics.tablet_small}) {
    flex-direction: row;
  }
`;
