import React, { Fragment } from 'react'
import { Workspace } from '../../components/workspace'
import { Properties } from '../../components/properties';
import { Tools } from '../../components/tools';
import { useEditorPageController } from './controller'

const EditorPage: React.FC = () => {
  const {
    editorRef,
    onUpload,
    onSubmit
  } = useEditorPageController();

  return (
    <Fragment>
      <Tools editorRef={editorRef} />
      <Workspace onUpload={onUpload} editorRef={editorRef} />
      <Properties onSubmit={onSubmit} />
    </Fragment>
  )
}

export { EditorPage }
