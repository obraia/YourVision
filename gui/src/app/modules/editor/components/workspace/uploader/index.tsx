import React, { useEffect, useRef } from 'react'
import { FaUpload } from 'react-icons/fa';
import { Container, Input } from './styles'

interface Props {
  onUpload?: (image: File) => void;
}

export const Uploader: React.FC<Props> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { current: container } = containerRef;
    const { current: input } = inputRef;

    if (container && input) {
      container.addEventListener('click', () => {
        input.click()
      })

      container.addEventListener('dragover', (e) => {
        e.preventDefault()
      })

      container.addEventListener('dragenter', (e) => {
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'copy'
          container.classList.add('dragover')
        }
      })

      container.addEventListener('dragleave', () => {
        container.classList.remove('dragover')
      })

      container.addEventListener('drop', (e) => {
        e.preventDefault()
        
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          container.classList.remove('dragover')
          props.onUpload?.(e.dataTransfer.files[0])
        }
      });

      input.addEventListener('change', () => {
        if (input.files && input.files[0]) {
          props.onUpload?.(input.files[0])
        }
      })
    }
  }, [])

  return (
    <Container ref={containerRef}>
      <FaUpload size={72} />
      Upload your image
      <Input ref={inputRef} />
    </Container>
  )
}
