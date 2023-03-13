import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { usePopper } from 'react-popper'
import { CSSTransition } from 'react-transition-group'

import Portal from './Portal'
import SearchPopper from './SearchPopper'

import { HiX, HiSearch } from 'react-icons/hi'
import { toggleSidebar } from '../features/sidebar/sidebarSlice'

import { selectDistrict } from '../features/apiData/apiDataSlice'

const SearchBar = ({ isScreenLg, handleSearchPopperState }) => {
  const dispatch = useDispatch()

  const { sidebarIsOpen } = useSelector((state) => state.sidebar)
  const { districtNames } = useSelector((state) => state.apiData)

  const [searchIsFocused, setSearchIsFocused] = useState(false)
  const [showPopper, setShowPopper] = useState(false)
  const [referenceEl, setReferenceEl] = useState()
  const [popperEl, setPopperEl] = useState()
  const [searchableArray, setSearchableArray] = useState(
    districtNames ? districtNames : []
  )
  const [searchResults, setSearchResults] = useState([])
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)
  const [keyPressed, setKeyPressed] = useState(null)

  let searchInputRef = useRef()
  let searchDivRef = useRef()

  useEffect(() => {
    handleSearchPopperState(showPopper)
  }, [showPopper])

  const { styles, attributes } = usePopper(referenceEl, popperEl, {
    modifiers: [
      { name: 'offset', options: { offset: [isScreenLg ? 100 : -30, 5] } },
    ],
  })

  const handleSearchChange = (value) => {
    const searchResultsArray = searchableArray.filter((entry) =>
      entry.toLowerCase().includes(value.toLowerCase())
    )

    setSearchResults(searchResultsArray)
    // console.log(searchResultsArray)
    setShowPopper(searchResultsArray?.length ? true : false)

    // console.log(searchResultsArray)
  }

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault()
  //   if (!searchResults?.length) {
  //     console.log('no results found')
  //     setError(true)
  //     searchDivRef.current.classList.add('border-red-700')
  //     console.log(searchDivRef.current.classList)
  //   }
  // }

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
      }
    }
  }

  const handleSearchFocus = () => {
    setSearchIsFocused(true)
    handleSearchChange(searchInputRef.current.value)
  }

  useEffect(() => {
    // console.log(selectedItemIndex)
  }, [selectedItemIndex])

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
            className={`flex items-center py-0.5 border-transparent bg-slate-600/50 transition-all duration-200 ${
              isScreenLg ? `justify-between` : `overflow-hidden`
            } ${
              sidebarIsOpen
                ? 'px-1.5 border-[2px] rounded-md'
                : 'pl-[9px] w-full rounded-sm'
            }`}
          >
            <div className="py-1 text-lg transition-colors duration-500 md:text-xl text-slate-400 hover:text-slate-200">
              <HiSearch
                className="hover:cursor-pointer"
                onClick={() => {
                  // setIsSearchOpen((v) => !v)
                  if (!sidebarIsOpen) {
                    dispatch(toggleSidebar())
                    searchInputRef.current.focus()
                    setSearchIsFocused(true)
                  }
                }}
              />
            </div>
            <form
              className="flex items-center"
              // onSubmit={handleSearchSubmit}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
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
                className={`text-xs text-slate-300 focus:outline-none bg-transparent border-l-2 border-slate-600 ${
                  isScreenLg ? `` : `w-52`
                } ${
                  sidebarIsOpen
                    ? 'pl-1.5 ml-1 opacity-100'
                    : 'pl-1.5 ml-1 opacity-0'
                } transition-opacity duration-500 `}
                placeholder="Search for a District..."
              />
            </form>
          </div>
        </CSSTransition>

        {/* <div className="bg-red-700 w-[100px] h-[200px] absolute z-20"></div> */}
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
        />
      </Portal>
      {/* <Menu
        id="long-menu"
        MenuListProps={{
          // 'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === 'Pyxis'}
            onClick={handleClose}
          >
            {option}
          </MenuItem>
        ))}
      </Menu> */}
    </>
  )
}

export default SearchBar
