import { Editor, EditorRef } from './editor';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../infrastructure/redux/store';
import { Uploader } from './uploader';
import { Container } from './styles';

interface Props {
  editorRef: React.RefObject<EditorRef>;
  onUpload: (image: File) => void;
}

const Workspace = (props: Props) => {
  const { layers } = useSelector((state: RootState) => state.layers);

  return (
    <Container>
      { layers.length ? <Editor ref={props.editorRef} /> : <Uploader onUpload={props.onUpload} /> }
    </Container>
  )
}

export { Workspace }
