import { DefaultTheme } from "styled-components";
import { Range } from "./range";
import { Colors } from "./colors";
import { Button } from "./button";
import { Toggle } from "./toggle";
import { Container } from "./styles";

export interface Property {
  name?: string;
  label: string;
  type: 'range' | 'toggle' | 'colors' | 'button';

  rangeOptions?: {
    min: number;
    max: number;
    step: number;
    disabled?: boolean;
    defaultValue: number;
    onChange: (values: number[]) => void;
  }

  toggleOptions?: {
    defaultValue: boolean;
    onChange: (value: boolean) => void;
  }

  colorOptions?: {
    defaultValue: string;
    onChange: (value: string) => void;
  }

  buttonOptions?: {
    color: keyof DefaultTheme['colors'];
    backgroundColor: keyof DefaultTheme['colors'];
    onClick: () => void;
  }
}

export interface Props {
  properties: Property[];
}

export const Properties = (props: Props) => {
  
  const renderProperty = (property: Property, index: number) => {
    if(property.type === 'range' && property.rangeOptions) {
      return (
        <Range
          key={index}
          label={property.label}
          properties={{
            min: property.rangeOptions.min,
            max: property.rangeOptions.max,
            step: property.rangeOptions.step,
            disabled: property.rangeOptions.disabled,
            defaultValue: [property.rangeOptions.defaultValue],
            onChange: property.rangeOptions.onChange || (() => {}),
          }}
        />
      );
    }

    if(property.type === 'toggle' && property.toggleOptions) {
      return (
        <Toggle
          key={index}
          label={property.label}
          properties={{
            defaultValue: property.toggleOptions.defaultValue,
            onChange: property.toggleOptions.onChange,
          }}
        />
      );
    }

    if(property.type === 'colors' && property.colorOptions) {
      return (
        <Colors
          key={index}
          label={property.label}
          properties={{
            defaultValue: property.colorOptions.defaultValue,
            onChange: property.colorOptions.onChange,
          }}
        />
      );
    }

    if(property.type === 'button' && property.buttonOptions) {
      return (
        <Button
          key={index}
          label={property.label}
          properties={{
            color: property.buttonOptions.color,
            backgroundColor: property.buttonOptions.backgroundColor,
            onClick: property.buttonOptions.onClick,
          }}
        />
      );
    }
  }

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
  }

  return (
    <Container onClick={handleClick}>
      {props.properties.map(renderProperty)}
    </Container>
  )
}