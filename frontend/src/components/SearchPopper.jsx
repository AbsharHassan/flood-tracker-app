import { useEffect, useRef } from 'react'
import { HiX, HiSearch } from 'react-icons/hi'
import { useSelector, useDispatch } from 'react-redux'

import { selectDistrict } from '../features/apiData/apiDataSlice'
import { toggleSidebar } from '../features/sidebar/sidebarSlice'

const SearchPopper = ({
  showPopper,
  setPopperEl,
  styles,
  attributes,
  closePopper,
  searchResults,
  selectedItemIndex,
  keyPressed,
  isScreenLg,
}) => {
  const dispatch = useDispatch()

  const { districtNames } = useSelector((state) => state.apiData)
  const { isDarkMode } = useSelector((state) => state.sidebar)

  let dropdownRef = useRef(null)
  let itemRef = useRef(null)

  const handleSelect = (e) => {
    // dispatch()
    console.log(e)
  }

  useEffect(() => {
    if (keyPressed === 'ArrowDown') {
      if (selectedItemIndex !== 0 && selectedItemIndex % 10 === 0) {
        dropdownRef.current.scrollTop += 240
      }
    } else if (keyPressed === 'ArrowUp') {
      if (selectedItemIndex !== 0 && (selectedItemIndex + 1) % 10 === 0) {
        dropdownRef.current.scrollTop -= 240
      }
    }
  }, [keyPressed, selectedItemIndex])

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
        className={`absolute w-full px-2 h-6 flex items-center justify-end border-2 border-[#114b81] border-b-0 bg-black/10  z-[70] rounded-t-md bg-clip-padding backdrop-blur-sm ${
          showPopper ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-100`}
      >
        <button onClick={closePopper}>
          <HiX className="text-lg text-slate-400 hover:text-slate-200 transition-colors duration-200 " />
        </button>
      </div>
      <div
        ref={dropdownRef}
        onKeyDown={() => {
          console.log('key down')
        }}
        className={` border-2 border-[#114b81] rounded-md  backdrop-blur-md w-full absolute z-[60] overflow-y-scroll search-popper   ${
          showPopper
            ? 'max-h-[292px] pb-1 opacity-100'
            : 'max-h-[20px] opacity-0'
        } ${
          isDarkMode ? 'bg-[#1978c822]' : 'bg-themeCardColorDark'
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
                  if (!isScreenLg) {
                    dispatch(toggleSidebar())
                  }
                }}
                className={`flex items-center text-xs text-slate-300 font-medium italic px-3  hover:bg-slate-700/60 hover:cursor-pointer transition-colors   h-6 ${
                  selectedItemIndex === index ? 'bg-cyan-700/50' : ''
                }`}
                key={index}
              >
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {result}
                </span>
              </div>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default SearchPopper
