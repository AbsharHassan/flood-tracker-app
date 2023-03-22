import { useSelector } from 'react-redux'
import { AiOutlineSync } from 'react-icons/ai'

const SubmitButton = ({ label, isLoading, handleClick }) => {
  const { isDarkMode } = useSelector((state) => state.sidebar)

  return (
    <button
      className={`w-full font-medium flex items-center  justify-center rounded h-11 mb-4 duration-300 ${
        isDarkMode
          ? 'bg-blue-500/40 hover:bg-blue-500/50 '
          : 'bg-black hover:bg-black text-white'
      }`}
      onClick={!isLoading ? handleClick : null}
    >
      {!isLoading ? (
        label
      ) : (
        <div className="flex items-center justify-center">
          Processing
          <AiOutlineSync
            className={` ml-1 text-2xl processing ${
              isDarkMode ? 'text-slate-300' : 'text-slate-800'
            }`}
          />
        </div>
      )}
    </button>
  )
}

export default SubmitButton
