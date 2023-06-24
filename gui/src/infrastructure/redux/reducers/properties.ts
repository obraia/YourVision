import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Properties } from '../../../app/modules/editor/pages/editor/controller';
import { Field } from '../../../app/modules/shared/components/form';

export interface ImageResult {
  id: number;
  image: string;
  embedding: string;
  properties_id: number;
  layerType?: 'raster' | 'object';
  visible?: boolean;
}
export interface PluginProperties {
  name: string;
  type: string;
  properties: object;
  fields: Field<any>[];
}

export interface PropertiesState {
  image: string;
  embedding: string;
  results: ImageResult[];
  loading: boolean;
  progress: { current: number, total: number };
  models: { label: string, value: string }[];
  samplers: { label: string, value: string }[];
  properties: Properties;
  pluginProperties: PluginProperties[];
}

const stock = createSlice({
  name: 'properties',
  initialState: {
    image: '',
    embedding: '',
    results: [],
    loading: false,
    progress: { current: 0, total: 0 },
    models:[],
    samplers: [],
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
    },
    pluginProperties: [],
  } as PropertiesState,
  reducers: {
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
    setModels(state, action: PayloadAction<{ label: string, value: string }[]>) {
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
    },
    addPlugin(state, action: PayloadAction<{ name: string, type: string, properties: object, fields: Field<any>[] }>) {
      const index = state.pluginProperties.findIndex((plugin) => plugin.name === action.payload.name);

      if(index === -1) {
        state.pluginProperties.push(action.payload);
      } else {
        state.pluginProperties[index] = action.payload;
      } 
    },
    removePlugin(state, action: PayloadAction<string>) {
      const index = state.pluginProperties.findIndex((plugin) => plugin.name === action.payload);

      if(index !== -1) {
        state.pluginProperties.splice(index, 1);
      }
    },
    setPluginProperties(state, action: PayloadAction<{ name: string, properties: object }>) {
      const index = state.pluginProperties.findIndex((plugin) => plugin.name === action.payload.name);

      if(index !== -1) {
        state.pluginProperties[index].properties = action.payload.properties;
      }
    },
    setPluginField(state, action: PayloadAction<{ name: string, field: Field<any> }>) {
      const index = state.pluginProperties.findIndex((plugin) => plugin.name === action.payload.name);

      if(index !== -1) {
        const fieldIndex = state.pluginProperties[index].fields.findIndex((field) => field.name === action.payload.field.name);
        state.pluginProperties[index].fields[fieldIndex] = action.payload.field;
      }
    }
  },
});

export const { ...propertiesActions } = stock.actions;
export default stock.reducer;
