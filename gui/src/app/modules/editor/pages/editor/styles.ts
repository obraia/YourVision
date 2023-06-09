import styled from 'styled-components'

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: ${({ theme }) => theme.metrics.tablet_small}) {
    flex-direction: column;
  }
`

export const Workspace = styled.div`
  flex: 1;
  width: 512px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: ${({ theme }) => theme.metrics.gap};
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: ${({ theme }) => theme.metrics.desktop_small}) {
    width: 100%;
    padding: 5px;
  }
`;
