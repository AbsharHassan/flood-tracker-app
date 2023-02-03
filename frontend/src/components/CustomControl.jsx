import { useEffect } from 'react'

const CustomControl = ({ parentIsReady, onLoaded }) => {
  // useEffect(() => {
  //   setTimeout(() => {
  //     onLoaded()
  //   }, 100)
  // }, [])

  if (!parentIsReady) {
    return null
  }

  return (
    <div
      className="w-[100px] h-[50px] bg-red-600"
      onClick={() => {
        console.log('hello')
      }}
    >
      CustomControl
    </div>
  )
}

CustomControl.defaultProps = {
  parentIsReady: true,
}

export default CustomControl
