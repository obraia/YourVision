import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu } from '../../shared/components/menu'
import { Pages } from '../../shared/components/layout/pages/styles'
import { ContextMenu } from '../../shared/components/layout/contextmenu'
import { RootState } from '../../../../infrastructure/redux/store'
import { Container } from '../../shared/components/layout/container/styles'
import { InpaintingPage } from '../pages/inpainting'

const StableRoutes: React.FC = () => {
  const menuProps = useSelector((state: RootState) => state.contextMenu)

  return (
    <Container>
      <Menu />

      <Pages>
        <Routes>
          <Route path="/" element={<InpaintingPage />} />
        </Routes>
      </Pages>

      <ContextMenu {...menuProps}></ContextMenu>
    </Container>
  )
}

export { StableRoutes }
