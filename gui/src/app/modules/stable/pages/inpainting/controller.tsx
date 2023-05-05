import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { useSamService } from '../../../../../infrastructure/services/sam/sam.service'
import { useSdService } from '../../../../../infrastructure/services/sd/sd.service';
import { propertiesActions } from '../../../../../infrastructure/redux/reducers/properties';
import { FormDataFactory } from '../../../shared/utils/factories/formdata.factory';
import { EditorRef } from '../../components/workspace/editor';
import { useSocket } from '../../../shared/hooks/useSocket';

export interface ImageProps {
  src?: string;
  width: number;
  height: number;
  info?: string;
}

export interface Properties {
  model: string;
  images: number;
  steps: number;
  cfg: number;
  width: number;
  height: number;
  sampler: string;
  seed: number;
  positive: string;
  negative: string;
}

function useInpaintingPageController() {
  const dispatch = useDispatch();
  const samService = useSamService();
  const sdService = useSdService();
  const socket = useSocket();
  const editorRef = useRef<EditorRef>(null);

  const onUpload = (file: File) => {
    if(!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      return alert('Only png, webp and jpeg images are supported.');
    }

    const formData = new FormData();
    formData.append('image', file);
    
    samService.generateEmbedding(formData).then(({ embedding }) => {
      dispatch(propertiesActions.setSamEmbedding(embedding));
    });

    const reader = new FileReader();

    reader.onload = (e) => {
      if(e.target) {
        const image = e.target.result as string;
        dispatch(propertiesActions.setImage(image));
        dispatch(propertiesActions.setResults([image]));
      }
    }
    
    reader.readAsDataURL(file);
  }

  const onSubmit = async (properties: Properties) => {
    const { current: editor } = editorRef;

    if(!editor) return;
    
    const image = await editor.getImage();
    const mask = await editor.getMask();

    if(!image || !mask) return;

    dispatch(propertiesActions.setLoading(true));

    const formData = FormDataFactory({ ...properties, image, mask });

    sdService.inpaint(formData).then(({ outputs }) => {
      dispatch(propertiesActions.appendResults(outputs));
    }).finally(() => {
      dispatch(propertiesActions.setLoading(false));
      dispatch(propertiesActions.setProgress(0));
    });
  }

  useEffect(() => {
    socket.on('progress', ({ step, image }: any) => {
      dispatch(propertiesActions.setProgress(step));
      if(image) dispatch(propertiesActions.setImage(image));
    });
  }, []);

  return {
    editorRef,
    onUpload,
    onSubmit
  }
}

export { useInpaintingPageController }
