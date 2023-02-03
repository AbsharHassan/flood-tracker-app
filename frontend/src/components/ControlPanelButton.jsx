import { useEffect } from 'react'
import { AiOutlineSync } from 'react-icons/ai'

const ControlPanelButton = ({ label, isLoading, handleClick, disabled }) => {
  useEffect(() => {
    // console.log(isLoading)
  }, [isLoading])

  return (
    <button
      className={`w-full max-w-sm mx-auto font-medium flex items-center justify-center  rounded h-11 mb-4  duration-300 text-sm ${
        isLoading ? 'cursor-not-allowed' : ''
      } ${
        !disabled
          ? 'bg-blue-500/40 hover:bg-blue-500/50'
          : 'text-slate-500 cursor-not-allowed bg-slate-800'
      }`}
      onClick={!isLoading ? (!disabled ? handleClick : null) : null}
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

ControlPanelButton.defaultProps = {
  disabled: false,
}

export default ControlPanelButton
