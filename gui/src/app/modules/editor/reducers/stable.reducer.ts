import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ContextMenuItem } from '../../shared/components/layout/contextmenu'

export interface FilesState {
  contextMenuItems: ContextMenuItem[]
}

const initialState: FilesState = {
  contextMenuItems: [],
}

const stock = createSlice({
  name: 'Stable',
  initialState,
  reducers: {
    setContextMenuItems(state, action: PayloadAction<{ items: ContextMenuItem[] }>) {
      state.contextMenuItems = action.payload.items
    },
  },
})

export const {
  setContextMenuItems,
} = stock.actions

export default stock.reducer
