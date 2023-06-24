import React, { useCallback } from 'react'
import { BsAlignStart, BsAlignCenter, BsAlignEnd, BsAlignTop, BsAlignMiddle, BsAlignBottom } from 'react-icons/bs'
import { Container, Label, ColorsWrapper, Button } from './styles'
import { IconType } from 'react-icons/lib';

export type AlignType = 'horizontal-start' | 'horizontal-center' | 'horizontal-end' | 'vertical-start' | 'vertical-center' | 'vertical-end';

interface Align {
  type: AlignType;
  icon: IconType
}

interface Props {
  label: string;
  properties: {
    disabled?: boolean;
    onChange: (value: AlignType) => void;
  }
}

const Alignment = (props: Props) => {

  const alignments: Align[] = [
    { type: 'horizontal-start', icon: BsAlignStart },
    { type: 'horizontal-center', icon: BsAlignCenter },
    { type: 'horizontal-end', icon: BsAlignEnd },
    { type: 'vertical-start', icon: BsAlignTop },
    { type: 'vertical-center', icon: BsAlignMiddle },
    { type: 'vertical-end', icon: BsAlignBottom },
  ];

  const renderAlign = (align: Align, index: number) => {
    return (
      <Button key={index} onClick={() => props.properties.onChange(align.type)}>
        <align.icon />
      </Button>
    );
  }

  return (
    <Container>
      <Label>{props.label}</Label>
      <ColorsWrapper>
        {alignments.map(renderAlign)}
      </ColorsWrapper>
    </Container>
  )
}

export { Alignment }
