import { useEffect, useRef, useState } from "react"

const useImageLoaded = () => {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef()

  const onLoad = () => {
    setLoaded(true)
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (ref.current&& (ref.current as any).complete) {
      onLoad()
    }
  },[])

  return [ref, loaded, onLoad]
}

export default useImageLoaded;