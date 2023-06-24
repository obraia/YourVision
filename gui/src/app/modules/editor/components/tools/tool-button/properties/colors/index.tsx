import React, { useCallback } from 'react'
import { Container, Label, ColorsWrapper, Color } from './styles'

interface Props {
  label: string;
  properties: {
    disabled?: boolean;
    defaultValue: string;
    onChange: (value: string) => void;
  }
}

const Colors = (props: Props) => {
  const [value, setValue] = React.useState(props.properties.defaultValue);

  const colors = [
    '#f5877c',
    '#ed3228',
    '#764243',
    '#8e413d',
    '#301303',
    '#a4fafd',
    '#74fffd',
    '#368afd',
    '#0720f5',
    '#000796',
    '#124380',
    '#041079',
    '#fefd92',
    '#fffb52',
    '#f3965a',
    '#fb8451',
    '#784416',
    '#848026',
    '#7d85fb',
    '#6b2df3',
    '#3283c5',
    '#01043c',
    '#560e59',
    '#3a083f',
    '#a5fd92',
    '#9dff4d',
    '#76f753',
    '#73fc62',
    '#77fd8e',
    '#7f8447',
    '#f589bb',
    '#ee8bf5',
    '#ef3bfc',
    '#e7387d',
    '#7e86b8',
    '#71163c',
    '#417d20',
    '#397e4e',
    '#407978',
    '#4e7e7e',
    '#1a400c',
    '#243d3c',
    '#67186b',
    '#311184',
    '#000000',
    '#818181',
    '#bfbfbf',
    '#ffffff',
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
        $selected={color?.toLowerCase() === value?.toLowerCase()}
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
