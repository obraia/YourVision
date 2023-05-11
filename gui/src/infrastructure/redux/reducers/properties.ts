import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Properties } from '../../../app/modules/editor/pages/editor/controller';

export interface ImageResult {
  id: number;
  image: string;
  embedding: string;
  properties_id: number;
}

export interface PropertiesState {
  current: number;
  image: string;
  embedding: string;
  results: ImageResult[];
  loading: boolean;
  progress: { current: number, total: number };
  models: string[];
  samplers: { label: string, value: string }[];
  properties: Properties;
}

const stock = createSlice({
  name: 'properties',
  initialState: {
    current: 0,
    image: '',
    embedding: '',
    results: new Array<ImageResult>(),
    loading: false,
    progress: { current: 0, total: 0 },
    models: new Array<string>(),
    samplers: new Array<{ label: string, value: string }>(),
    properties: {
      model: 'select a model',
      images: 1,
      steps: 30,
      cfg: 7.5,
      width: 512,
      height: 512,
      sampler: 'select a sampler',
      seed: -1,
      positive: '',
      negative: '',
    }
  } as PropertiesState,
  reducers: {
    setCurrent(state, action: PayloadAction<number>) {
      state.current = action.payload;
    },
    deleteCurrent(state) {
      const index = state.results.findIndex((result) => result.id === state.current);

      if(index === -1) return;

      state.results.splice(index, 1);

      const result = state.results[index] || state.results[state.results.length - 1];

      if(result) {
        state.current = result.id;
        state.embedding = result.embedding;
        state.image = (result.image.startsWith('data') || result.image === 'empty') ? result.image : `${process.env.REACT_APP_API_URL}/static/images/${result.image}`;
      } else {
        state.current = 0;
        state.image = '';
        state.embedding = '';
        state.results = new Array<ImageResult>();
        state.loading = false;
        state.progress = { current: 0, total: 0 };
      }
    },
    deleteAll(state) {
      state.current = 0;
      state.image = '';
      state.embedding = '';
      state.results = new Array<ImageResult>();
      state.loading = false;
      state.progress = { current: 0, total: 0 };
    },
    setImage(state, action: PayloadAction<string>) {
      if(action.payload.startsWith('data')) {
        state.image = action.payload;
      } else if (action.payload === 'empty') {
        state.image = action.payload;
      } else if(action.payload) {
        state.image = `${process.env.REACT_APP_API_URL}/static/images/${action.payload}`;
      }  else {
        state.image = '';
      }
    },
    setSamEmbedding(state, action: PayloadAction<string>) {
      state.embedding = action.payload;
    },
    setResults(state, action: PayloadAction<ImageResult[]>) {
      state.results = action.payload;
    },
    appendResults(state, action: PayloadAction<ImageResult[]>) {
      state.results.push(...action.payload);
    },
    deleteResult(state, action: PayloadAction<number>) {
      state.results.splice(action.payload, 1);
    },
    deleteResultById(state, action: PayloadAction<number>) {
      const index = state.results.findIndex((result) => result.id === action.payload);
      
      if(index !== -1) {
        state.results.splice(index, 1);

        if(action.payload === state.current) {
          const result = state.results[index] || state.results[state.results.length - 1];

          if(result) {
            state.current = result.id;
            state.embedding = result.embedding;
            state.image = (result.image.startsWith('data') || result.image === 'empty') ? result.image : `${process.env.REACT_APP_API_URL}/static/images/${result.image}`;
          } else {
            state.current = 0;
            state.image = '';
            state.embedding = '';
            state.results = new Array<ImageResult>();
            state.loading = false;
            state.progress = { current: 0, total: 0 };
          }
        }
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress.current = action.payload;
      state.progress.total = action.payload ? state.properties.steps * state.properties.images : 0;
    },
    setProperties(state, action: PayloadAction<Properties>) {
      state.properties.model = action.payload.model;
      state.properties.images = action.payload.images;
      state.properties.steps = action.payload.steps;
      state.properties.cfg = action.payload.cfg;
      state.properties.width = action.payload.width || 1;
      state.properties.height = action.payload.height || 1;
      state.properties.sampler = action.payload.sampler;
      state.properties.seed = action.payload.seed;
      state.properties.positive = action.payload.positive;
      state.properties.negative = action.payload.negative;
    },
    setModels(state, action: PayloadAction<string[]>) {
      state.models = action.payload;
    },
    setSamplers(state, action: PayloadAction<{ label: string, value: string }[]>) {
      state.samplers = action.payload;
    },
    setWidth(state, action: PayloadAction<number>) {
      state.properties.width = action.payload || 1;
    },
    setHeight(state, action: PayloadAction<number>) {
      state.properties.height = action.payload || 1;
    },
    setSeed(state, action: PayloadAction<number>) {
      state.properties.seed = action.payload;
    },
    generateRandomSeed(state) {
      state.properties.seed = Math.floor(1000000000 + Math.random() * 9000000000);
    }
  },
});

export const { ...propertiesActions } = stock.actions;
export default stock.reducer;
