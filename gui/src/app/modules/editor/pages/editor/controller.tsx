import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useSdService } from '../../../../../infrastructure/services/sd.service';
import { propertiesActions } from '../../../../../infrastructure/redux/reducers/properties';
import { EditorRef } from '../../components/workspace/editor';
import { useSocket } from '../../../shared/hooks/useSocket';
import { Shape, layersActions } from '../../../../../infrastructure/redux/reducers/layers';

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

function useEditorPageController() {
  const dispatch = useDispatch();
  const sdService = useSdService();
  const socket = useSocket();
  const editorRef = useRef<EditorRef>(null);

  const onUpload = (file: File) => {
    if(!file.type.includes('image')) {
      return alert('Only images are supported.');
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if(e.target) {
        const image = new Image();

        image.src = e.target.result as string;

        image.onload = () => {
          const shape: Shape = {
            id: uuidv4(),
            type: 'image' as const,
            imageOptions: {
              src: image.src,
              width: image.width,
              height: image.height,
            },
            x: 0,
            y: 0,
          };

          dispatch(layersActions.createLayer({
            mask: false, 
            preview: image.src, 
            shapes: [shape], 
            visible: true,
            locked: true,
          }));

          dispatch(propertiesActions.setWidth(image.width));
          dispatch(propertiesActions.setHeight(image.height));
        }
      }
    }

    reader.readAsDataURL(file);
  }

  const onSubmit = async (properties: Properties, plugins: object[]) => {
    const { current: editor } = editorRef;

    if(!editor) return;
    
    const image = null // await editor.getImage();
    const mask = await editor.getMask();

    dispatch(propertiesActions.setLoading(true));

    if(image && mask) {
      sdService.inpaint({ image, mask, properties, plugins }).then((result) => {
        dispatch(propertiesActions.appendResults(result));
      }).finally(() => {
        dispatch(propertiesActions.setLoading(false));
        dispatch(propertiesActions.setProgress(0));
      });
    } else if(image) {
      sdService.img2img({ image, properties, plugins }).then((result) => {
        dispatch(propertiesActions.appendResults(result));
      }).finally(() => {
        dispatch(propertiesActions.setLoading(false));
        dispatch(propertiesActions.setProgress(0));
      });
    } else {
      sdService.txt2img({ properties, plugins }).then((result) => {
        const images = result.map(i => `${process.env.REACT_APP_API_URL}/static/images/${i.image}`);
        editor.addImages(images);
      }).finally(() => {
        dispatch(propertiesActions.setLoading(false));
        dispatch(propertiesActions.setProgress(0));
      });
    }
  }

  useEffect(() => {
    socket.on('progress', ({ step, image }: any) => {
      dispatch(propertiesActions.setProgress(step));
      if(image) dispatch(propertiesActions.setImage(image));
    });

    socket.on('complete', () => {
      dispatch(propertiesActions.setProgress(0));
      dispatch(propertiesActions.setLoading(false));
    });
  }, []);

  return {
    editorRef,
    onUpload,
    onSubmit
  }
}

export { useEditorPageController }
