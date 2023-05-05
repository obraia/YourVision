import { createSlice } from '@reduxjs/toolkit';

import { light, dark } from '../../styles/themes';

const stock = createSlice({
  name: 'theme',
  initialState: {
    theme: light,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme.title === 'light' ? dark : light;
    },
  },
});

export const { toggleTheme } = stock.actions;
export default stock.reducer;
