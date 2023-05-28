import { InputHTMLAttributes, useCallback } from 'react';
import { ChangeEvent } from '../../controller';
import { Container, Input, Label} from './styles';

interface Props {
  label?: string;
  error?: string;
  width: string;
  properties: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange?: (e: ChangeEvent<number>) => void;
  }
}

const Range = (props: Props) => {

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = props.properties;
    const { currentTarget: input } = e;

    const min = Number(input.min || Number.MIN_SAFE_INTEGER);
    const max = Number(input.max || Number.MAX_SAFE_INTEGER);

    if(input.value === '') input.value = '';
    else if(Number(input.value) < min) input.value = min.toString();
    else if(Number(input.value) > max) input.value = max.toString();

    if (onChange) {
      onChange({ name: input.name, value: Number(input.value) });
    }
  }, [props]);

  return (
    <Container width={props.width}>
      { props.label && <Label>{props.label}</Label>} 
      <Input {...props.properties}  onChange={handleChange} />
    </Container>
  )
}

export { Range }
