import React from 'react';
import { Container, Label } from './styles';

interface Props {
  label?: string;
}

export const Separator: React.FC<Props> = ({ label }) => {
  return (
    <Container>
      {label && <Label>{label}</Label>} 
    </Container>
  );
};
