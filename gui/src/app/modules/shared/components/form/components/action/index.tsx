import { ButtonHTMLAttributes } from 'react';
import { IconType } from 'react-icons';
import { Container } from './styles';

interface Props {
  width?: string;
  icon?: IconType;
  properties: ButtonHTMLAttributes<HTMLInputElement>;
}

const Action = (props: Props) => {
  const handleClick = (e: any) => {
    if (props.properties.onClick) {
      props.properties.onClick(e);
    }
  };

  return (
    <Container {...props.properties} onClick={handleClick} $width={props.width}>
      {props.icon && <props.icon size={20} />}
    </Container>
  );
};

export { Action };
