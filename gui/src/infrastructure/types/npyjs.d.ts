interface Results {
  dtype: string;
  shape: number[];
  data: number[];
  fortranOrder: boolean;
}

declare class NpyJs {
  constructor() {}
  
  parse(data: ArrayBuffer): Results;
  load(path: string): Promise<Results>;
}

declare module 'npyjs' {
  export = NpyJs;
}
