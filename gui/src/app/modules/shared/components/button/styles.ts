import styled from "styled-components";

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #00000000;
  transition: background-color 0.2s;

  &:hover {
    background-color: #00000020;
  }

  &:active {
    background-color: #00000030;
  }
`;
