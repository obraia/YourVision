import { useState } from 'react';
import { Range as ReactRange } from 'react-range'
import { Container, Label, Thumb, Track } from './styles'
import { IRenderThumbParams, IRenderTrackParams } from 'react-range/lib/types';

interface Props {
  label: string;
  properties: {
    min: number;
    max: number;
    step: number;
    disabled?: boolean;
    defaultValue: number[];
    onChange: (values: number[]) => void;
  }
}

const Range= (props: Props) => {
  const [values, setValues] = useState(props.properties.defaultValue);

  const handleChange = (values: number[]) => {
    setValues(values);
    props.properties.onChange(values);
  }

  const renderTrack = ({ props, children }: IRenderTrackParams) => (
    <Track {...props} style={{ ...props.style }} children={children} />
  )

  const renderThumb = ({ props }: IRenderThumbParams) => (
    <Thumb {...props} style={{ ...props.style }} />
  )

  return (
    <Container>
      <Label>{props.label}</Label>
      <ReactRange
        {...props.properties} 
        values={values} 
        renderTrack={renderTrack} 
        renderThumb={renderThumb} 
        onChange={handleChange} />
    </Container>
  )
}

export { Range }
