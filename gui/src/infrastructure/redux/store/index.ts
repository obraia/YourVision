import { combineReducers } from 'redux';
import { useDispatch } from 'react-redux';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import themeReducer from '../reducers/theme';
import contextMenuReducer from '../reducers/contextmenu';
import propertiesReducer from '../reducers/properties';
import toolsReducer from '../reducers/tools';

const reducers = combineReducers({
  theme: themeReducer,
  contextMenu: contextMenuReducer,
  properties: propertiesReducer,
  tools: toolsReducer,
});

const persistConfig = {
  key: 'ai.editor',
  storage: storage,
  blacklist: ['contextMenu'],
}

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export const useAppDispatch = () => useDispatch<AppDispatch>()

export { store, persistor }
