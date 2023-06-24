import React, { useCallback } from 'react'
import { Container, Label, ColorsWrapper, Color } from './styles'

interface Props {
  label: string;
  properties: {
    disabled?: boolean;
    defaultValue: string;
    onChange: (values: string) => void;
  }
}

const Colors = (props: Props) => {
  const [value, setValue] = React.useState(props.properties.defaultValue);

  const colors = [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#00ffff',
    '#ff00ff',
    '#FFB700',
    '#9500FF',
  ];

  const handleChange = (value: string) => {
    setValue(value);
    props.properties.onChange(value);
  }

  const renderColor = useCallback((color: string, index: number) => {
    return (
      <Color
        key={index}
        $color={color}
        $selected={color.toLowerCase() === value.toLowerCase()}
        onClick={() => handleChange(color)}
      />
    );
  }, [value]);

  return (
    <Container>
      <Label>{props.label}</Label>
      <ColorsWrapper>
        {colors.map(renderColor)}
      </ColorsWrapper>
    </Container>
  )
}

export { Colors }
