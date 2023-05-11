const tryParserJSON = <T>(value: string): T | null => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}

export { tryParserJSON }