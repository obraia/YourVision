import { useEffect, useRef, useState } from "react";
import { Properties, Property } from "./properties";
import { Container, PropertiesIndicator } from "./styles"

export interface Tool {
  name: string;
  icon: React.ReactNode;
  active?: boolean;
  properties?: Property[];
  onClick?: () => void;
}

interface Props {
  tool: Tool;
}

export const ToolButton = (props: Props) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [showProperties, setShowProperties] = useState(false);

  const toggleProperties = () => {
    setShowProperties(!showProperties);
  }

  const handleClick = () => {
    if(props.tool.onClick) {
      props.tool.onClick();
    }

    if(props.tool.properties) {
      toggleProperties();
    }
  }

  /**
   * Close properties when click outside
   */
  useEffect(() => {
    const { current: button } = ref;

    const handleClickOutside = (e: MouseEvent) => {
      if(button && !button.contains(e.target as Node)) {
        setShowProperties(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  return (
    <Container onClick={handleClick} ref={ref} $active={props.tool.active}>
      {props.tool.icon}
      {(showProperties && props.tool.properties) && <Properties properties={props.tool.properties}/>}
      {props.tool.properties && <PropertiesIndicator />}
    </Container>
  )
}