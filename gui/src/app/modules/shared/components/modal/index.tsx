import React, { useLayoutEffect } from 'react';
import { MdClose } from 'react-icons/md';

import { Body, Center, Container, Header, HeaderButton, Title } from './styles';

export interface ItemProps<t> {
  id: number;
  label: string;
  data: t;
}

export interface ModalProps {
  title: string;
  width?: string;
  onConfirm?: () => void;
  onCloseModal: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = (props) => {
  const stopPropagation = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const preventDefault = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
  };

  const clearEvent = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    stopPropagation(e);
    preventDefault(e);
  };

  const handleClose = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    stopPropagation(e);
    props.onCloseModal();
  };

  const handleKeys = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      return props.onCloseModal();
    }

    if (e.key === 'Enter') {
      return props.onConfirm && props.onConfirm();
    }
  };

  useLayoutEffect(() => {
    document.addEventListener('keydown', handleKeys);

    return () => {
      document.removeEventListener('keydown', handleKeys);
    };
  }, []);

  return (
    <Center onMouseDown={handleClose} onMouseMoveCapture={stopPropagation} onContextMenuCapture={clearEvent}>
      <Container
        width={props.width}
        onClick={stopPropagation}
        onMouseDownCapture={stopPropagation}
        onMouseMoveCapture={stopPropagation}
        onContextMenuCapture={clearEvent}
      >
        <Header>
          <Title>{props.title}</Title>
          <HeaderButton onClick={handleClose}>
            <MdClose size={22} />
          </HeaderButton>
        </Header>
        <Body>{props.children}</Body>
      </Container>
    </Center>
  );
};

export { Modal };
