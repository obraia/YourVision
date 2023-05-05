import styled from 'styled-components'

export const Pages = styled.main<{ scroll?: boolean; column?: boolean }>`
  grid-area: pages;
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    flex-direction: column;
  }
`
