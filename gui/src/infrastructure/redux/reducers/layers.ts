import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { DeepPartial, deepMerge } from '../../utils/object.util';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface Shape {
  id: string;
  x: number;
  y: number;
  type: 'text' | 'image';
  classList?: string[];
  textOptions?: {
    text: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    verticalAlign: 'top' | 'middle' | 'bottom';
    lineHeight: number;
  };
  imageOptions?: {
    src: string;
    width: number;
    height: number;
  };
}

export interface Layer {
  id: string;
  name: string;
  shapes: Shape[];
  image?: string;
  preview?: string;
  visible: boolean;
  mask: boolean;
  locked: boolean;
}

export interface LayersState {
  layers: Layer[];
  currentLayerIndex: number;
}

const stock = createSlice({
  name: 'layers',
  initialState: {
    layers: [],
    currentLayerIndex: 0,
  } as LayersState,
  reducers: {
    createLayer(state, action: PayloadAction<Optional<Layer, 'id' | 'name'>>) {
      const lastLayer = state.layers
        .filter((layer) => layer.name && layer.name.match(/Layer \d+/))
        .map((layer) => parseInt(layer.name.replace('Layer ', '') || '0'))
        .sort((a, b) => a - b).pop() || 0;

      const id = uuidv4();
      const name = `Layer ${lastLayer + 1}`;
      const layer = { id, name, ...action.payload };

      state.layers.push(layer);
      state.currentLayerIndex = state.layers.length - 1;
    },
    renameLayerByIndex(state, action: PayloadAction<{ index: number, name: string }>) {
      state.layers[action.payload.index].name = action.payload.name;
    },
    deleteCurrentLayer(state) {
      if(!state.layers) return;

      state.layers.splice(state.currentLayerIndex, 1);

      if(!state.layers[state.currentLayerIndex]) {
        state.currentLayerIndex = state.layers.length - 1;
      }
    },
    deleteLayerByIndex(state, action: PayloadAction<number>) {
      if(!state.layers) return;

      state.layers.splice(action.payload, 1);

      if(!state.layers[state.currentLayerIndex]) {
        state.currentLayerIndex = state.layers.length - 1;
      }
    },
    setCurrentLayerIndex(state, action: PayloadAction<number>) {
      state.currentLayerIndex = action.payload;
    },
    setCurrentLayerImage(state, action: PayloadAction<string>) {
      state.layers[state.currentLayerIndex].image = action.payload;
    },
    setCurrentLayerPreview(state, action: PayloadAction<string>) {
      state.layers[state.currentLayerIndex].preview = action.payload;
    },
    removeAllLayers(state) {
      state.currentLayerIndex = -1;
      state.layers = [];
    },
    toggleLayerVisibility(state, action: PayloadAction<number>) {
      const layer = state.layers[action.payload];
      layer.visible = !layer.visible;
    },
    toggleLayerLock(state, action: PayloadAction<number>) {
      const layer = state.layers[action.payload];
      layer.locked = !layer.locked;
    },
    toggleLayerMask(state, action: PayloadAction<number>) {
      const layer = state.layers[action.payload];
      layer.mask = !layer.mask;
    },
    pushShape(state, action: PayloadAction<Shape>) {
      state.layers[state.currentLayerIndex].shapes.push(action.payload);
    },
    updateShape(state, action: PayloadAction<DeepPartial<Shape>>) {
      const index = state.layers[state.currentLayerIndex].shapes.findIndex((shape) => shape.id === action.payload.id);

      if(index !== -1) {
        deepMerge(state.layers[state.currentLayerIndex].shapes[index], action.payload);
      }
    },
    removeShape(state, action: PayloadAction<string>) {
      const index = state.layers[state.currentLayerIndex].shapes.findIndex((shape) => shape.id === action.payload);
      state.layers[state.currentLayerIndex].shapes.splice(index, 1);
    },
  }
});

export const { ...layersActions } = stock.actions;
export default stock.reducer;
