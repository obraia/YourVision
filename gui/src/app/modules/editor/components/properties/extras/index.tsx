import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { BiExtension } from 'react-icons/bi';
import { RiArrowDropLeftLine, RiArrowDropRightLine } from 'react-icons/ri';
import { MdContentPaste, MdPhotoFilter, MdTranslate } from 'react-icons/md';
import { propertiesActions } from '../../../../../../infrastructure/redux/reducers/properties';
import { tryParserJSON } from '../../../../shared/utils/formatters/json.formatter';
import { Properties } from '../../../pages/editor/controller';
import { Tool, ToolButton } from './extra-button';
import { Container, ToogleButton } from './styles'

const Extras = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dispatch = useDispatch();

  const toggle = () => {
    setIsExpanded(!isExpanded);
  }

  const tools: Tool[] = [
    {
      name: 'Paste properties',
      icon: MdContentPaste,
      onClick() { 
        navigator.clipboard.readText().then(text => {
          const properties = tryParserJSON<Properties>(text);

          if(properties) {
            dispatch(propertiesActions.setProperties(properties));
          }
        });
      },
    },
    {
      name: 'Filters',
      icon: MdPhotoFilter,
      onClick() { },
    },
    {
      name: 'Translate prompts',
      icon: MdTranslate,
      onClick() { },
    },
    {
      name: 'Plugins',
      icon: BiExtension,
      onClick() { },
    }
  ];

  const renderTool = (tool: Tool, index: number) => {
    return (
      <ToolButton key={index} tool={tool} />
    )
  }

  return (
    <Container $isExpanded={isExpanded}>
      <ToogleButton onClick={toggle}>
        {isExpanded ? <RiArrowDropRightLine /> : <RiArrowDropLeftLine />}
      </ToogleButton>
      {tools.map(renderTool)}
    </Container>
  )
}

export { Extras }
