import { Editor, EditorRef } from './editor';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../infrastructure/redux/store';
import { Uploader } from './uploader';
import { Carousel } from './carousel';
import { Progressbar } from './progressbar';
import { Container } from './styles';

interface Props {
  editorRef: React.RefObject<EditorRef>;
  onUpload: (image: File) => void;
}

const Workspace = (props: Props) => {
  const { image } = useSelector((state: RootState) => state.properties);

  return (
    <Container>
      <Progressbar />
      { image ? <Editor ref={props.editorRef} /> : <Uploader onUpload={props.onUpload} /> }
      <Carousel />
    </Container>
  )
}

export { Workspace }
