import { useEffect } from 'react'
import { HiX, HiSearch } from 'react-icons/hi'
import { useSelector, useDispatch } from 'react-redux'

import { selectDistrict } from '../features/apiData/apiDataSlice'

const SearchPopper = ({
  showPopper,
  setPopperEl,
  styles,
  attributes,
  closePopper,
  searchResults,
}) => {
  const dispatch = useDispatch()

  const handleSelect = (e) => {
    // dispatch()
    console.log(e)
  }

  const { districtNames } = useSelector((state) => state.apiData)
  return (
    <div
      onKeyDown={() => {
        console.log('key down')
      }}
      ref={setPopperEl}
      style={styles.popper}
      {...attributes.popper}
      className="w-40 z-[60]"
    >
      <div
        className={`absolute w-full px-2 py-1 flex items-center justify-end border-2 border-[#114b81] border-b-0 bg-black/10  z-[70] rounded-t-md bg-clip-padding backdrop-blur-sm ${
          showPopper ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-100`}
      >
        {/* <div className="text-slate-400 font-bold tracking-tighter">
          Select a district
        </div> */}
        <button
          className=""
          onClick={closePopper}
        >
          <HiX className="text-lg text-slate-400 hover:text-slate-200 transition-colors duration-200 " />
        </button>
      </div>
      <div
        onKeyDown={() => {
          console.log('key down')
        }}
        className={`bg-[#1978c822] border-2 border-[#114b81] rounded-md  backdrop-blur-md w-full absolute z-[60] overflow-y-scroll search-popper   ${
          showPopper
            ? 'max-h-[250px] pb-1 opacity-100'
            : 'max-h-[20px] opacity-0'
        } transition-all duration-1000`}
      >
        <ul
          onKeyDown={() => {
            console.log('key down')
          }}
          className="h-full relative pt-[25px]"
        >
          {searchResults &&
            searchResults.map((result, index) => (
              <div
                onClick={() => {
                  dispatch(selectDistrict(result))
                  closePopper()
                }}
                className="text-xs text-slate-300 font-medium italic px-3 py-1 hover:bg-slate-700/60 hover:cursor-pointer transition-colors duration-300"
                key={index}
              >
                {result}
              </div>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default SearchPopper
