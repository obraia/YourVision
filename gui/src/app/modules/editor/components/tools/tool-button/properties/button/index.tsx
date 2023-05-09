import { DefaultTheme } from 'styled-components';
import { Container, ContainerButton } from './styles'

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
    <Container>
      <ContainerButton 
        $color={props.properties.color} 
        $backgroundColor={props.properties.backgroundColor} 
        onClick={props.properties.onClick}>
        {props.label}
      </ContainerButton>
    </Container>
  )
}

export { Button }
