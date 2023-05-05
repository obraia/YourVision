function FormDataFactory(data: Object) {
  const formData = new FormData();

  for (const property of Object.entries(data)) {
    formData.append(property[0], property[1]);
  }

  return formData;
}

export { FormDataFactory }