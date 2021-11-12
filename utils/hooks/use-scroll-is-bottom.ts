import { debounce } from "debounce"
import * as React from "react"

export function useScrollIsBottom(callback: () => void) {
  const ref = React.useRef<HTMLDivElement>(null)
  const scrollHandler = () => {
    console.log('mic')
    const refElRect = ref.current?.getBoundingClientRect()
    if (!refElRect) return

    if (refElRect.bottom <= window.innerHeight) {
      callback()
    }
  }

  React.useEffect(() => {
    if(typeof window !== 'undefined') {
      document.body.addEventListener("scroll", scrollHandler)
    }

    return () => {
      document.body.removeEventListener("scroll", scrollHandler)
    }
  }, [scrollHandler])

  return [ref]
}
