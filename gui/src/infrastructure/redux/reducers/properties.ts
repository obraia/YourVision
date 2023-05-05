import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Properties } from '../../../app/modules/stable/pages/inpainting/controller';

export interface PropertiesState {
  image: string;
  embedding: string;
  results: { 
    image: string,
    mask: string,
    embedding: string,
    properties: Properties,
  }[];
  loading: boolean;
  progress: { current: number, total: number };
  models: string[];
  samplers: { label: string, value: string }[];
  properties: Properties;
}

const stock = createSlice({
  name: 'properties',
  initialState: {
    image: '',
    embedding: '',
    results: new Array<string>(),
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
  },
  reducers: {
    setImage(state, action: PayloadAction<string>) {
      state.image = action.payload;
    },
    setSamEmbedding(state, action: PayloadAction<string>) {
      state.embedding = action.payload;
    },
    setResults(state, action: PayloadAction<string[]>) {
      state.results = action.payload;
    },
    appendResults(state, action: PayloadAction<string[]>) {
      state.results.push(...action.payload);
    },
    deleteResult(state, action: PayloadAction<number>) {
      state.results.splice(action.payload, 1);
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
      state.properties.width = action.payload.width;
      state.properties.height = action.payload.height;
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
      state.properties.width = action.payload;
    },
    setHeight(state, action: PayloadAction<number>) {
      state.properties.height = action.payload;
    },
    generateRandomSeed(state) {
      state.properties.seed = Math.floor(Math.random() * 100000000);
    }
  },
});

export const { ...propertiesActions } = stock.actions;
export default stock.reducer;
