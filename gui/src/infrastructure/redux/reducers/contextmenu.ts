import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContextMenuItem } from '../../../app/modules/shared/components/layout/contextmenu';

const stock = createSlice({
  name: 'contextmenu',
  initialState: {
    isOpen: false,
    xPos: 0,
    yPos: 0,
    items: Array<ContextMenuItem>(),
  },
  reducers: {
    showMenu(
      state,
      action: PayloadAction<{
        xPos: number;
        yPos: number;
        items: ContextMenuItem[];
      }>
    ) {
      state.isOpen = true;
      state.xPos = action.payload.xPos;
      state.yPos = action.payload.yPos;
      state.items = action.payload.items;
    },
    hideMenu(state) {
      if (state.isOpen) {
        state.isOpen = false;
        state.xPos = 0;
        state.yPos = 0;
        state.items = [];
      }
    },
  },
});

export const { showMenu, hideMenu } = stock.actions;
export default stock.reducer;
