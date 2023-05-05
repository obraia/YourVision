import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
}

const Button: React.FC<ButtonProps> = (props) => {
  return <Container {...props}>{props.children}</Container>;
};

export { Button };
