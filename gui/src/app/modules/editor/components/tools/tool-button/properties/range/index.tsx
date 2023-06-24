import { useCallback } from 'react';
import { Container, Label, Input } from './styles';

interface Props {
  label: string;
  properties: {
    min: number;
    max: number;
    step: number;
    disabled?: boolean;
    defaultValue: number;
    onChange: (values: number) => void;
  }
}

const Range = (props: Props) => {

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = props.properties;
    const { currentTarget: input } = e;

    if (onChange) {
      onChange(Number(input.value));
    }
  }, [props]);

  return (
    <Container>
      { props.label && <Label>{props.label}</Label>} 
      <Input {...props.properties}  onChange={handleChange} />
    </Container>
  )
}

export { Range }
