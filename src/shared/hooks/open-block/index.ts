import { useEffect, useRef, useState } from 'react'

import type { RefObject } from 'react'

interface IOpenBlockReturn<T extends HTMLElement = HTMLDivElement> {
  ref: RefObject<T>
  isOpen: boolean

  handleOpen(): void

  handleToggle(): void

  handleClose(): void
}

const useOpenBlock = <T extends HTMLElement = HTMLDivElement>(): IOpenBlockReturn<T> => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useRef<T>(null)

  const handleOpen = (): void => {
    setIsOpen(true)
  }
  const handleClose = (): void => {
    setIsOpen(false)
  }
  const handleToggle = (): void => {
    setIsOpen((prev) => !prev)
  }

  const handleEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      handleClose()
    }
  }

  const handleClickOutside = (event: MouseEvent): void => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      handleClose()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleEscape)
    window.addEventListener('mousedown', handleClickOutside)

    return (): void => {
      window.removeEventListener('keydown', handleEscape)
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return { isOpen, handleOpen, handleClose, handleToggle, ref }
}

export {
  useOpenBlock,
  type IOpenBlockReturn
}
