import { DefaultTheme } from 'styled-components';
import { Container } from './styles'

interface Props {
  label: string;
  properties: {
    color: keyof DefaultTheme['colors'];
    backgroundColor: keyof DefaultTheme['colors'];
    onClick: () => void;
  }
}

const Button = (props: Props) => {
  return (
    <Container
      $color={props.properties.color} 
      $backgroundColor={props.properties.backgroundColor} 
      onClick={props.properties.onClick}>
        {props.label}
    </Container>
  )
}

export { Button }
