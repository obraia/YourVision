import { ForwardedRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import { InferenceSession, Tensor } from 'onnxruntime-web';
import { useDispatch, useSelector } from "react-redux";
import npyjs from 'npyjs';
import { modelData } from "../../../../../../infrastructure/utils/onnx.util";
import { onnxMaskToImage } from "../../../../../../infrastructure/utils/mask.util";
import { RootState } from "../../../../../../infrastructure/redux/store";
import { propertiesActions } from "../../../../../../infrastructure/redux/reducers/properties";
import { EditorRef } from ".";

interface ModelScale {
  samScale: number;
  height: number;
  width: number;
}

const SAM_MODEL_PATH = '/model/sam_vit_l_0b3195.onnx';

function useController(ref: ForwardedRef<EditorRef>) {
  const { results, properties, embedding } = useSelector((state: RootState) => state.properties);
  const { tool, mask, brush, eraser } = useSelector((state: RootState) => state.tools);

  const [model, setModel] = useState<InferenceSession | null>(null);
  const [tensor, setTensor] = useState<Tensor | null>(null);
  const [modelScale, setModelScale] = useState<ModelScale | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const isTouch = window.matchMedia('(hover: none)').matches;

  useImperativeHandle(ref, () => {
    return {
      getImage() {
        const { current: image } = imageRef;

        if(image && !image.src.endsWith('empty')) {
          return imageToBase64(image.src);
        }
      },
      getMask() {
        const { current: originalCanvas } = canvasRef;

        if (originalCanvas) {
          const isCanvasEmpty = checkCanvasEmpty(originalCanvas);

          if(isCanvasEmpty) return;

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if(context) {
            canvas.width = originalCanvas.width;
            canvas.height = originalCanvas.height;
            context.drawImage(originalCanvas, 0, 0);
    
            context.globalCompositeOperation = 'source-in';
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
    
            context.globalCompositeOperation = 'destination-over';
            context.fillStyle = '#000000';
            context.fillRect(0, 0, canvas.width, canvas.height);
          }
    
          const image = canvas.toDataURL('image/png');

          return imageToBase64(image);
        }
      },
      saveImage() {
        const image = this.getImage();

        if(image) {
          image.then((base64) => {
            const timestamp = new Date().getTime();
            const link = document.createElement('a');
            link.setAttribute('download', timestamp + '.png');
            link.setAttribute('href', base64);
            link.click();
          });
        }
      },
      saveMask() {
        const mask = this.getMask();

        if(mask) {
          mask.then((base64) => {
            const link = document.createElement('a');
            link.setAttribute('download', 'mask.png');
            link.setAttribute('href', base64);
            link.click();
          });
        }
      },
      clear() {
        const { current: canvas } = canvasRef;

        if (canvas) {
          const context = canvas.getContext('2d');
    
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      },
      delete() {
        dispatch(propertiesActions.deleteCurrent());
        dispatch(propertiesActions.setProgress(0));
      },
    };
  }, []);

  const checkCanvasEmpty = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');

    if(context) {
      const pixelBuffer = new Uint32Array(
        context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
      );

      return !pixelBuffer.some(color => color !== 0);
    }

    return true;
  }

  const imageToBase64 = (image: string): Promise<string> => {
    return (
      fetch(image)
        .then(res => res.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
      )
    );
  }

  const initializeSamModel = useCallback(async () => {
    try {
      if (SAM_MODEL_PATH === undefined) return
      const model = await InferenceSession.create(SAM_MODEL_PATH)
      setModel(model)
    } catch (error) {
      console.error(error)
    }
  }, [])

  const loadNpyTensor = async (embedding: string) => {
    const npLoader = new npyjs();
    const npArray = await npLoader.load(embedding);
    const tensor = new Tensor("float32", npArray.data, npArray.shape);
    setTensor(tensor);
  };

  const loadSamModelScale = () => {
    const { current: image } = imageRef;

    if (image) {
      const LONG_SIDE_LENGTH = 1024;
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const samScale = LONG_SIDE_LENGTH / Math.max(width, height);
      setModelScale({ height, width, samScale })
    }
  }

  const resetZoom = () => {
    const { current: zoom } = zoomRef;

    if (zoom) {
      zoom._zoomFactor = 1;
      zoom._onResize();
    }
  }

  const resizeCanvas = () => {
    const { current: canvas } = canvasRef;
    const { current: image } = imageRef;
    const { current: border } = borderRef;
    const { current: zoom } = zoomRef;
    
    if (canvas && image && border && zoom) {
      const context = canvas.getContext('2d');

      const imageScale = Math.min(
        properties.width / image.naturalWidth,
        properties.height / image.naturalHeight,
      );

      const imageWidth = image.naturalWidth * imageScale;
      const imageHeight = image.naturalHeight * imageScale;

      if (context) {
        const scaleX = imageWidth / (image.width);
        const scaleY = imageHeight / (image.height);
        const dx = (properties.width / 2 - (canvas.width * scaleX) / 2);
        const dy = (properties.height / 2 - (canvas.height * scaleY) / 2);

        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');

        if(tempContext) {
          // Copy canvas to temp canvas
          tempCanvas.width = properties.width;
          tempCanvas.height = properties.height;
          tempContext.scale(scaleX, scaleY);
          tempContext.drawImage(canvas, dx, dy);
          tempContext.globalCompositeOperation = context.globalCompositeOperation
          tempContext.strokeStyle = context.strokeStyle;
          tempContext.lineWidth = context.lineWidth;
          tempContext.lineJoin = context.lineJoin;
          tempContext.lineCap = context.lineCap;
          tempContext.filter = context.filter;
          
          // Paste temp canvas to canvas
          canvas.width = properties.width;
          canvas.height = properties.height;
          context.drawImage(tempCanvas, 0, 0, properties.width, properties.height);
          context.globalCompositeOperation = tempContext.globalCompositeOperation
          context.strokeStyle = tempContext.strokeStyle;
          context.lineWidth = tempContext.lineWidth;
          context.lineJoin = tempContext.lineJoin;
          context.lineCap = tempContext.lineCap;
          context.filter = tempContext.filter;
        }

        image.width = imageWidth;
        image.height = imageHeight;
      }
      
      const { parentElement } = canvas;

      if (parentElement) {
        const { width, height } = parentElement.getBoundingClientRect();
        const scaleW = Math.min((((width / zoomScale) - 40) / (canvas.width)), 1);
        const scaleH = Math.min((((height / zoomScale) - 40) / (canvas.height)), 1);
        const scale = Math.min(scaleW, scaleH);
        
        canvas.style.transform = `scale(${scale})`;
        image.style.transform = `scale(${scale})`;
        border.style.transform = `scale(${scale})`;
        border.style.borderWidth = `${2 / scale}px`;

        resetZoom();
      }
    }
  }

  const onSelect = useCallback(async (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if(tool !== 'select') return;

    const { current: canvas } = canvasRef;
    const { current: image } = imageRef;

    if (canvas && image && model && tensor && modelScale) {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      const imageScale = Math.max(image.width, image.height) / Math.max(image.naturalWidth, image.naturalHeight);
      const width = image.naturalWidth * imageScale;
      const height = image.naturalHeight * imageScale;

      /**
       * The image may have a height or width smaller than the canvas
       * so it is necessary to calculate the difference between the image and the canvas
       */
      const diffWidth = (canvas.width - width);
      const diffHeight = (canvas.height - height);

      /**
       * The click position is relative to the canvas, so it is necessary
       * subtract the difference between the image and the canvas
       */
      const xCanvas = (x - diffWidth / 2) / imageScale;
      const yCanvas = (y - diffHeight / 2) / imageScale;

      const feeds = modelData({
        clicks: [{ x: xCanvas, y: yCanvas, clickType: 1 }],
        tensor,
        modelScale,
      });
      
      if (feeds === undefined) return;

      // Run the SAM ONNX model with the feeds returned from modelData()
      const results = await model.run(feeds);
      const output = results[model.outputNames[0]];

      /**
       * The predicted mask returned from the ONNX model is an array which is
       * rendered as an HTML image using onnxMaskToImage() from maskUtils.tsx.
       */
      const maskImage = onnxMaskToImage(output.data, output.dims[2], output.dims[3], mask.color);

      /**
       * The mask is drawn on the canvas using the image dimensions and the
       * difference between the image and the canvas
       */
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.globalCompositeOperation = 'source-over';

        maskImage.onload = () => {
          const dx = (diffWidth / 2);
          const dy = (diffHeight / 2);
          ctx.drawImage(maskImage, dx, dy, width, height);
        }
      }
    }

  }, [model, tensor, modelScale, tool, mask.color])

  const onStartDrawing = useCallback(({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if(tool !== 'brush' && tool !== 'eraser') return;

    const { current: canvas } = canvasRef;

    if(nativeEvent.buttons !== 1) return;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        context.beginPath();
        context.moveTo(nativeEvent.offsetX, nativeEvent.offsetY);
        context.lineTo(nativeEvent.offsetX, nativeEvent.offsetY);
        context.stroke();
        setIsDrawing(true);

        nativeEvent.preventDefault();
      }
   }
  }, [tool])

  const onDrawing = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isTouch) return;

    const { current: cursor } = cursorRef;

    if (cursor) {
      const cursorSize = tool === 'brush' ? brush.size : eraser.size;

      cursor.style.visibility = 'visible';
      cursor.style.width = `${cursorSize * zoomScale}px`;
      cursor.style.height = `${cursorSize * zoomScale}px`;
      cursor.style.left = `${event.nativeEvent.clientX - ((cursorSize * zoomScale) / 2) + 1}px`;
      cursor.style.top = `${event.nativeEvent.clientY - ((cursorSize * zoomScale) / 2) + 1}px`;
    }

    if (isDrawing) {
      const { current: canvas } = canvasRef;

      if (canvas) {
        const context = canvas.getContext('2d');

        if (context) {
          context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
          context.stroke();
        }
      }
    }
  }, [isDrawing, brush.size, eraser.size, tool, zoomScale])

  const onStartDrawingTouch = useCallback(({ nativeEvent }: React.TouchEvent<HTMLCanvasElement>) => {
    if(tool !== 'brush' && tool !== 'eraser') return;
    
    const { current: canvas } = canvasRef

    if (canvas) {
      const context = canvas.getContext('2d')
      const rect = canvas.getBoundingClientRect()
      const x = (nativeEvent.touches[0].clientX - rect.left) * (canvas.width / rect.width)
      const y = (nativeEvent.touches[0].clientY - rect.top) * (canvas.height / rect.height)

      if (context) {
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(x, y)
        setIsDrawing(true)

        nativeEvent.preventDefault()
      }
    }
  }, [tool])

  const onDrawingTouch = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      const { current: canvas } = canvasRef
      const { current: cursor } = cursorRef

      if (canvas) {
        const context = canvas.getContext('2d')
        const rect = canvas.getBoundingClientRect()

        const x = (event.nativeEvent.touches[0].clientX - rect.left) * (canvas.width / rect.width)
        const y = (event.nativeEvent.touches[0].clientY - rect.top) * (canvas.height / rect.height)

        if (context) {
          context.lineTo(x, y)
          context.stroke()
        }
      }

      if(cursor) {
        const cursorSize = tool === 'brush' ? brush.size : eraser.size
        const x = event.touches[0].pageX
        const y = event.touches[0].pageY

        cursor.style.visibility = 'visible'
        cursor.style.width = `${cursorSize * zoomScale}px`
        cursor.style.height = `${cursorSize * zoomScale}px`
        cursor.style.left = `${x - ((cursorSize * zoomScale) / 2)}px`
        cursor.style.top = `${y - ((cursorSize * zoomScale) / 2)}px`
      }
    }
  }, [isDrawing, tool])
  
  const onFinishDrawing = useCallback(() => {
    setIsDrawing(false)

    const { current: cursor } = cursorRef

    if (cursor) {
      cursor.style.visibility = 'hidden';
    }
  }, [])

  const onLeaveCanvas = useCallback(() => {
    const { current: cursor } = cursorRef

    if (cursor) {
      cursor.style.visibility = 'hidden';
    }
  }, [])

  const onZoomChange = (scale: number) => {
    setZoomScale(scale);
  }

  /**
   * Initialize the ONNX model
   */
  useEffect(() => {
      initializeSamModel();
  }, [])

  /**
   * Resize canvas and load model scale
   */
  useEffect(() => {
    const { current: image } = imageRef;

    if (image) { 
      image.onload = () => {
        resizeCanvas();
        loadSamModelScale();
      }
    }

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    }
  }, [])

  /**
   * Resize canvas
   */
  useEffect(() => {    
    resizeCanvas();
  }, [properties.width, properties.height, results])

  /**
   * Load the Segment Anything pre-computed embedding
   */
  useEffect(() => {
    if (embedding && embedding !== 'empty') {
      loadNpyTensor(`${process.env.REACT_APP_API_URL}/static/embeddings/${embedding}`);
    }
  }, [embedding])

  /**
   * Change mask opacity
   */
  useEffect(() => {
    const { current: canvas } = canvasRef;

    if (canvas) {
      canvas.style.opacity = `${mask.opacity}`;
    }
  }, [mask.opacity])

  /**
   * Change mask blur
   */
  useEffect(() => {
    const { current: canvas } = canvasRef;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        context.filter = `drop-shadow(0 0 ${mask.blur}px ${mask.color})`;
      }
    }
  }, [mask.blur, mask.color])

  /**
   * Change cursor size and show it in the center of the canvas
   */
  useEffect(() => {
    if(!['brush', 'eraser'].includes(tool)) {
      return;
    }

    const { current: cursor } = cursorRef;
    const { current: container } = containerRef;
    const cursorSize = tool === 'brush' ? brush.size : eraser.size;

    if (cursor && container) {
      const { left, top, width , height } = container.getBoundingClientRect()
      cursor.style.left = `${left + (width / 2) - ((cursorSize * zoomScale) / 2)}px`;
      cursor.style.top = `${top + (height / 2) - ((cursorSize * zoomScale) / 2)}px`;
      cursor.style.width = `${cursorSize * zoomScale}px`;
      cursor.style.height = `${cursorSize * zoomScale}px`;
      cursor.style.visibility = 'visible';
    }

    const { current: canvas } = canvasRef;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        context.lineWidth = cursorSize;
      }
    }
  }, [brush.size, eraser.size, tool])

  /**
   * Change canvas draw mode
   */
  useEffect(() => {
    const { current: canvas } = canvasRef;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        switch (tool) {
          case 'brush':
            context.globalCompositeOperation = 'source-over';
            break;
          case 'eraser':
            context.globalCompositeOperation = 'destination-out';
            break;
          case 'select':
            context.globalCompositeOperation = 'source-over';
            break;
          default:
        }
      }
    }
  }, [tool])

  /**
   * Change canvas brush color
   */
  useEffect(() => {
    const { current: canvas } = canvasRef;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        context.strokeStyle = mask.color;
        context.lineJoin = 'round';
        context.lineCap = 'round';
      }
    }
  }, [mask.color])

  return {
    refs: {
      containerRef,
      zoomRef,
      canvasRef,
      imageRef,
      borderRef,
      cursorRef,
    },
    canvasHandles: {
      onSelect,
      onStartDrawing,
      onDrawing,
      onStartDrawingTouch,
      onDrawingTouch,
      onFinishDrawing,
      onLeaveCanvas,
    },
    zoomHandles: {
      onZoomChange
    },
  }
}

export { useController };