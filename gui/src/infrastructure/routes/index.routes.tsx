import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { ContextMenu } from '../../app/modules/shared/components/layout/contextmenu';
import { Container } from '../../app/modules/shared/components/layout/container/styles';
import { Pages } from '../../app/modules/shared/components/layout/pages/styles';
import { Menu } from '../../app/modules/shared/components/menu';
import { EditorPage } from '../../app/modules/editor/pages/editor';
import { GalleryPage } from '../../app/modules/gallery/pages/gallery';

const AppRoutes: React.FC = () => {
  const menuProps = useSelector((state: RootState) => state.contextMenu);

  return (
    <BrowserRouter>
      <Container>
        <Menu />

        <Pages>
          <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </Pages>

        <ContextMenu {...menuProps}></ContextMenu>
      </Container>
    </BrowserRouter>
  )
}

export { AppRoutes }
