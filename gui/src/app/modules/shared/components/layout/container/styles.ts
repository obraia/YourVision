import styled from 'styled-components'

export const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-areas:
    'menu menu'
    'pages pages'
    'pages pages'
    'pages pages';
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content min-content 1fr;
  position: relative;
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.metrics.tablet_medium}) {
    grid-template-areas:
      'pages pages'
      'pages pages'
      'pages pages'
      'menu menu';
  }
`
