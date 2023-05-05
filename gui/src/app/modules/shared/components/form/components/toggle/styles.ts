import styled from 'styled-components';

export const Container = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const InputGroup = styled.div`
  width: 50px;
  height: 25px;
  position: relative;
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 3px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;
  transition: 0.2s;
  z-index: 1;
`;

export const Input = styled.input`
  width: 1px;
  height: 1px;
  position: absolute;
  padding: 0;
  border: 0;
  white-space: nowrap;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  overflow: hidden;
`;

export const ToggleStyle = styled.label`
  height: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: 0.2s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.background};
    z-index: -1;
  }

  ${Input}:checked + && {
    margin-left: 25px;
    background-color: ${({ theme }) => theme.colors.background};

    &::before {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const Label = styled.label`
  width: fit-content;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textBackground};
`;
