import { useEffect, useRef } from "react";
import { Container } from "./styles"
import { Range } from "./range";
import { Colors } from "./colors";
import { Button } from "./button";
import { DefaultTheme } from "styled-components";
import { AlignType, Alignment } from "./align";
import { Select, SelectItem } from "./select";
import { Layers } from "./layers";

export interface Property {
  label: string;
  type: 'select' | 'range' | 'colors' | 'button' | 'align' | 'layers';

  selectOptions?: {
    items: SelectItem[];
    disabled?: boolean;
    defaultValue: string;
    onChange: (value: string) => void;
  }

  rangeOptions?: {
    min: number;
    max: number;
    step: number;
    disabled?: boolean;
    defaultValue: number;
    onChange: (values: number) => void;
  }

  colorOptions?: {
    defaultValue: string;
    onChange: (value: string) => void;
  }

  alignOptions?: {
    onChange: (value: AlignType) => void;
  }

  buttonOptions?: {
    color: keyof DefaultTheme['colors'];
    backgroundColor: keyof DefaultTheme['colors'];
    onClick: () => void;
  }
}

export interface Props {
  properties: Property[];
  expanded: boolean;
}

export const Properties = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const renderProperty = (property: Property, index: number) => {
    if(property.type === 'select' && property.selectOptions) {
      return (
        <Select
          key={index}
          label={property.label}
          items={property.selectOptions.items}
          properties={{
            defaultValue: property.selectOptions.defaultValue,
            onChange: property.selectOptions.onChange,
          }}
        />
      );
    }

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
            defaultValue: property.rangeOptions.defaultValue,
            onChange: property.rangeOptions.onChange,
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

    if(property.type === 'align' && property.alignOptions) {
      return (
        <Alignment
          key={index}
          label={property.label}
          properties={{
            onChange: property.alignOptions.onChange,
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

    if(property.type === 'layers') {
      return (
        <Layers key={index} />
      );
    }
  }

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
  }

  useEffect(() => {
    const { current: container } = containerRef;

    if(container) {
      const { width, x } = container.getBoundingClientRect();

      if(x + width > window.innerWidth) {
        container.style.left = `calc(100% - ${width}px)`;
      }
    }
  }, []);

  return (
    <Container onClick={handleClick} $expanded={props.expanded} ref={containerRef}>
      {props.properties.map(renderProperty)}
    </Container>
  )
}