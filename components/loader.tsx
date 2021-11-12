import * as React from "react"

const STEPS = [10, 30, 60, 80, 100]
const MAX = STEPS.length - 1

export function Loader() {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      if (index !== MAX) {
        setIndex(index + 1)
      }
    }, STEPS[index] * 100)
    return () => {
      clearTimeout(timerId)
    }
  }, [index])

  return (
    <div className="w-full h-full flex items-start justify-center pt-10 lg:pt-20">
      <div className="p-6 space-y-2 artboard phone">
        <progress className="progress ease-in-out" value={String(STEPS[index])} max="100" />
        <span>{index === MAX ? "Еще чуть чуть..." : "Загружаем..."} 😏</span>
      </div>
    </div>
  )
}
