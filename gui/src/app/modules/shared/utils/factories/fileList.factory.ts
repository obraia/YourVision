function FileListFactory(...args: File[]): FileList {
  const dataTransfer = new DataTransfer();

  for (const file of args) {
    dataTransfer.items.add(file);
  }

  return dataTransfer.files;
}

export { FileListFactory }