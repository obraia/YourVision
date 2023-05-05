import React, { Fragment } from 'react'

import { useInpaintingPageController } from './controller'
import { Workspace } from '../../components/workspace'
import { Tools } from '../../components/tools';
import { Properties } from '../../components/properties';

const InpaintingPage: React.FC = () => {
  const {
    editorRef,
    onUpload,
    onSubmit
  } = useInpaintingPageController();

  return (
    <Fragment>
      <Tools editorRef={editorRef} />
      <Workspace onUpload={onUpload} editorRef={editorRef} />
      <Properties onSubmit={onSubmit} />
    </Fragment>
  )
}

export { InpaintingPage }
