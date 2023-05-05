import React from 'react'
import { useDispatch } from 'react-redux'
import { MdDarkMode, MdSettings } from 'react-icons/md'
import { toggleTheme } from '../../../../../infrastructure/redux/reducers/theme'
import { Container, MenuItem, MenuItems, Spacer } from './styles'
import { IconType } from 'react-icons'

interface Item {
  name: string;
  icon: IconType;
  onClick: () => void;
}

const Menu: React.FC = () => {
  const dispatch = useDispatch();

  const extraItems = [
    {
      name: 'Dark Mode',
      icon: MdDarkMode,
      onClick() { dispatch(toggleTheme()) },
    },
    {
      name: 'Settings',
      icon: MdSettings,
      onClick() { },
    }
  ]

  function renderItem(item: Item, index: number) {
    return  (
      <MenuItem key={index} onClick={item.onClick}>
        {<item.icon />}
      </MenuItem>
    )
  }

  return (
    <Container>
      <MenuItems>
        YourVision - {process.env.REACT_APP_VERSION}
        <Spacer />
        {extraItems.map(renderItem)}
      </MenuItems>
    </Container>
  )
}

export { Menu }
