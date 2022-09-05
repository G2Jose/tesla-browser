import { useRef } from 'react'

export default function useLongPress(
  onLongPress: () => void,
  timeout: number = 500
) {
  const startTime = useRef<number | null>(null)
  const onMouseDown = () => {
    const now = Date.now()
    startTime.current = now

    setTimeout(() => {
      if (startTime.current && Date.now() - startTime.current >= timeout) {
        onLongPress()
      } else {
        startTime.current = null
      }
    }, timeout)
  }

  const onMouseUp = () => {
    const now = Date.now()
    if (startTime.current && now - startTime.current >= timeout) {
      onLongPress()
    }

    startTime.current = null
  }

  return {
    handlers: {
      onMouseUp,
      onMouseDown,
    },
  }
}
