import { useEffect, useRef, useState } from "react";
import { Properties, Property } from "./properties";
import { Container, Label, LabelContainer, PropertiesIndicator } from "./styles"
import { IconType } from "react-icons";

export interface Tool {
  name: string;
  icon: IconType;
  active?: boolean;
  properties?: Property[];
  onClick?: () => void;
}

interface Props {
  tool: Tool;
  expanded: boolean;
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

    if(!props.expanded) {
      setShowProperties(false);
    }

    const handleClickOutside = (e: MouseEvent) => {
      if(button && !button.contains(e.target as Node) && !props.expanded) {
        setShowProperties(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [props.expanded]);

  return (
    <Container onClick={handleClick} ref={ref} $active={props.tool.active} $expanded={props.expanded}>
      <LabelContainer $expanded={props.expanded}>
        <props.tool.icon />
        {props.expanded && <Label>{props.tool.name}</Label>}
      </LabelContainer>

      {(showProperties && props.tool.properties) && <Properties properties={props.tool.properties} expanded={props.expanded} />}
      {props.tool.properties && <PropertiesIndicator $expanded={props.expanded} />}
    </Container>
  )
}