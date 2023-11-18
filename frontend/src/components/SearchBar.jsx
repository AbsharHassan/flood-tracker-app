import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { usePopper } from 'react-popper'
import { CSSTransition } from 'react-transition-group'

import { selectDistrict } from '../features/apiData/apiDataSlice'
import { toggleSidebar } from '../features/sidebar/sidebarSlice'

import Portal from './Portal'
import SearchPopper from './SearchPopper'

import { HiSearch, HiX } from 'react-icons/hi'

const SearchBar = ({ isScreenLg, handleSearchPopperState, location }) => {
  const dispatch = useDispatch()

  const { sidebarIsOpen } = useSelector((state) => state.sidebar)
  const { districtNames } = useSelector((state) => state.apiData)

  const [searchIsFocused, setSearchIsFocused] = useState(false)
  const [showPopper, setShowPopper] = useState(false)
  const [referenceEl, setReferenceEl] = useState()
  const [popperEl, setPopperEl] = useState()
  const [searchableArray] = useState(districtNames ? districtNames : [])
  const [searchResults, setSearchResults] = useState([])
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)
  const [keyPressed, setKeyPressed] = useState(null)
  const [showClearBtn, setShowClearBtn] = useState(false)

  let searchInputRef = useRef()
  let searchDivRef = useRef()

  const { styles, attributes } = usePopper(referenceEl, popperEl, {
    modifiers: [
      { name: 'offset', options: { offset: [isScreenLg ? 100 : -30, 5] } },
    ],
  })

  const handleSearchChange = (value) => {
    setShowClearBtn(value ? true : false)

    const searchResultsArray = searchableArray.filter((entry) =>
      entry.toLowerCase().includes(value.toLowerCase())
    )

    setSearchResults(searchResultsArray)
    setShowPopper(searchResultsArray?.length ? true : false)
  }

  const handlePopperClose = () => {
    setShowPopper(false)
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (selectedItemIndex > 0) {
        setSelectedItemIndex((prev) => prev - 1)
        setKeyPressed('ArrowUp')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (selectedItemIndex < searchResults.length) {
        setSelectedItemIndex((prev) => prev + 1)
        setKeyPressed('ArrowDown')
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedItemIndex >= 0) {
        dispatch(selectDistrict(searchResults[selectedItemIndex]))
        setSelectedItemIndex(-1)
        handlePopperClose()
        if (!isScreenLg) {
          dispatch(toggleSidebar())
        }
      }
    }
  }

  const handleSearchFocus = () => {
    setSearchIsFocused(true)
    handleSearchChange(searchInputRef.current.value)
  }

  const clearSearch = () => {
    if (showClearBtn) {
      searchInputRef.current.value = ''
      setShowClearBtn(false)
    }
  }

  useEffect(() => {
    handleSearchPopperState(showPopper)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopper])

  useEffect(() => {
    if (!sidebarIsOpen) setShowPopper(false)
  }, [sidebarIsOpen])

  return (
    <>
      <div
        className={` ${
          sidebarIsOpen ? 'px-1 mt-[18px]' : 'px-0 mt-4'
        } duration-200`}
        ref={setReferenceEl}
      >
        <CSSTransition
          in={searchIsFocused}
          timeout={500}
          classNames="search-border"
          key="desktop"
        >
          <div
            ref={searchDivRef}
            className={`flex items-center bg-slate-800 transition-all duration-500 border-2  ${
              isScreenLg ? `justify-between` : `overflow-hidden`
            } ${
              sidebarIsOpen
                ? 'px-1.5 border-[2px] rounded-md'
                : 'pl-[9px] w-full rounded-sm py-[4px]'
            }
            
            ${searchIsFocused ? 'border-[#225ad380]' : 'border-transparent'}
            `}
          >
            <div
              className={` text-lg duration-200 md:text-xl text-slate-400 hover:text-slate-200 border-r-2 border-slate-600 pr-1 h-[20px] ${
                sidebarIsOpen ? '' : 'translate-x-3.5'
              }`}
            >
              <HiSearch
                className="hover:cursor-pointer"
                onClick={() => {
                  if (!sidebarIsOpen) {
                    dispatch(toggleSidebar())
                    searchInputRef.current.focus()
                    setSearchIsFocused(true)
                  }
                }}
              />
            </div>

            <input
              disabled={location.pathname === '/about' ? true : false}
              ref={searchInputRef}
              onChange={(e) => {
                handleSearchChange(e.target.value)
              }}
              onFocus={handleSearchFocus}
              onBlur={(e) => {
                setSearchIsFocused(false)
                handlePopperClose()
                setSelectedItemIndex(-1)
              }}
              onKeyDown={handleInputKeyDown}
              className={`inline-block h-[30px] text-xs py-0.5 text-slate-300 focus:outline-none bg-transparent ${
                isScreenLg ? `` : `w-52`
              } ${
                sidebarIsOpen
                  ? 'pl-1 ml-1 opacity-100 '
                  : 'pl-1 ml-1 opacity-0 w-0 '
              } transition-opacity duration-500 `}
              placeholder="Search for a District..."
            />

            <button
              type="button"
              className={`w-[20px] h-[20px] pr-1 -translate-x-5 translate-y-[0px] bg-slate-800 text-lg text-slate-400 hover:text-slate-200 transition-all duration-200 ${
                showClearBtn ? 'opacity-100' : 'opacity-0 cursor-default'
              }`}
              onClick={clearSearch}
            >
              <HiX />
            </button>
          </div>
        </CSSTransition>
      </div>

      <Portal>
        <SearchPopper
          showPopper={showPopper}
          setPopperEl={setPopperEl}
          styles={styles}
          attributes={attributes}
          closePopper={handlePopperClose}
          searchResults={searchResults}
          selectedItemIndex={selectedItemIndex}
          keyPressed={keyPressed}
          isScreenLg={isScreenLg}
        />
      </Portal>
    </>
  )
}

export default SearchBar
