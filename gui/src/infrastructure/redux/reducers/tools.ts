import { PayloadAction, SliceCaseReducers, createSlice } from '@reduxjs/toolkit';

interface Tools {
  tool: 'brush' | 'eraser' | 'select' | 'text' | 'move'; 
  brush: {
    size: number;
    color: string;
  };
  eraser: {
    size: number;
  };
  text: {
    fontFamily: string;
    fontWeight: string;
    size: number;
    color: string;
  };
  mask: {
    opacity: number;
    blur: number;
    color: string;
  };
}

const stock = createSlice({
  name: 'tools',
  initialState: {
    tool: 'brush',
    brush: {
      size: 10,
      color: '#000000',
    },
    eraser: {
      size: 10,
    },
    text: {
      fontFamily: 'Arial',
      fontWeight: 'normal',
      size: 10,
    },
    mask: {
      opacity: 1,
      blur: 0,
      color: '#000000',
    },
  } as Tools,
  reducers: {
    setTool(state, action: PayloadAction<Tools['tool']>) {
      state.tool = action.payload;
    },
    setBrushSize(state, action: PayloadAction<number>) {
      state.brush.size = action.payload;
    },
    setBrushColor(state, action: PayloadAction<string>) {
      state.brush.color = action.payload;
    },
    setEraserSize(state, action: PayloadAction<number>) {
      state.eraser.size = action.payload;
    },
    setTextFontFamily(state, action: PayloadAction<string>) {
      state.text.fontFamily = action.payload;
    },
    setTextFontWeight(state, action: PayloadAction<string>) {
      state.text.fontWeight = action.payload;
    },
    setTextSize(state, action: PayloadAction<number>) {
      state.text.size = action.payload;
    },
    setTextColor(state, action: PayloadAction<string>) {
      state.text.color = action.payload;
    },
    setMaskOpacity(state, action: PayloadAction<number>) {
      state.mask.opacity = action.payload;
    },
    setMaskBlur(state, action: PayloadAction<number>) {
      state.mask.blur = action.payload;
    },
    setMaskColor(state, action: PayloadAction<string>) {
      state.mask.color = action.payload;
    },
  },
});

export const { ...toolsActions } = stock.actions;
export default stock.reducer;
