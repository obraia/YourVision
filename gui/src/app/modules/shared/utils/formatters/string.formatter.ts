const truncateString = (text: string, length: number): string => {
  return text && text.length >= length + 3
    ? text.substring(0, length).replace(/\s+/g, ' ').concat('...')
    : text
}

const middleTruncateString = (text: string, length: number): string => {
  if (text && text.length >= length + 3) {
    const half = Math.floor(length / 2)
    const first = text.substring(0, half)
    const second = text.substring(text.length - half, text.length)
    return first.concat('...').concat(second)
  }

  return text
}

export { truncateString, middleTruncateString }
