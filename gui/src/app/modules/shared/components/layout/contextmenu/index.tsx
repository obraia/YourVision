import React, { useEffect } from 'react'
import { IconType } from 'react-icons'
import { useDispatch } from 'react-redux'
import { contextMenuActions } from '../../../../../../infrastructure/redux/reducers/contextmenu'

import { Container, MenuItem, MenuItems } from './styles'

export interface ContextMenuItem {
  id: string
  name: string
  icon: IconType
  single?: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export interface Props {
  isOpen: boolean
  xPos: number
  yPos: number
  items: ContextMenuItem[]
}

const ContextMenu: React.FC<Props> = (props) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    if (props.isOpen) {
      dispatch(contextMenuActions.hideMenu())
    }
  }

  const renderItems = () => {
    return props.items.map((i) => (
      <MenuItem
        key={i.id}
        onClick={i.onClick}
        onMouseDown={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => e.stopPropagation()}>
        <i.icon size={20} />
        {i.name}
      </MenuItem>
    ))
  }

  useEffect(() => {
    document.addEventListener('contextmenu', (e) => e.preventDefault())
    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  })

  return props.isOpen ? (
    <Container $xPos={props.xPos} $yPos={props.yPos}>
      <MenuItems>{renderItems()}</MenuItems>
    </Container>
  ) : null
}

export { ContextMenu }
