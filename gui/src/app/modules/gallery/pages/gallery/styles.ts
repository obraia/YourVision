import { styled } from "styled-components";
import { Scroll } from "../../../shared/components/layout/scroll";

export const Container = styled(Scroll)`
  flex: 1;
  width: 100%;
  display: flex;
  background-color: ${({ theme }) => theme.colors.background};
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.metrics.tablet_small}) {
    flex-direction: column;
  }
`

export const ImagesSection = styled.section`
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  padding: 10px;
`;