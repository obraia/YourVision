export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export function deepMerge<T>(target: T, source: DeepPartial<T>) {
  const isObject = (obj: unknown) => Boolean(obj && typeof obj === 'object');

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  (Object.keys(source) as Array<keyof T>).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue) as T[keyof T];
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = deepMerge(Object.assign({}, targetValue), sourceValue!) as T[keyof T];
    } else {
      target[key] = sourceValue as T[keyof T];
    }
  });

  return target;
}