import { useEffect } from 'react'
import { AiOutlineSync } from 'react-icons/ai'

const SubmitButton = ({ label, isLoading, handleClick }) => {
  useEffect(() => {
    // console.log(isLoading)
  }, [isLoading])

  return (
    <button
      className={`w-full font-medium flex items-center justify-center bg-blue-500/40 rounded h-11 mb-4 hover:bg-blue-500/50 duration-300`}
      onClick={!isLoading ? handleClick : null}
    >
      {!isLoading ? (
        label
      ) : (
        <div className="flex items-center justify-center">
          Processing
          <AiOutlineSync className="text-slate-300 ml-1 text-2xl processing " />
        </div>
      )}
    </button>
  )
}

export default SubmitButton
