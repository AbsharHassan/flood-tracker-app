import { useSelector } from 'react-redux'

const SelectedDistrict = () => {
  const { isDarkMode } = useSelector((state) => state.sidebar)
  const { globalSelectedDistrict, selectedDate } = useSelector(
    (state) => state.apiData
  )
  return (
    <>
      <div
        className={`selected-district border-b text-xs flex items-center pl-4 ${
          isDarkMode
            ? 'border-themeBorderColorDark bg-themeCardColorDark text-slate-400'
            : 'border-themeBorderColorLight bg-themeCardColorLight text-slate-800'
        }`}
      >
        Displaying data for:{' '}
        <span className="font-bold ml-1">
          {' '}
          {globalSelectedDistrict
            ? globalSelectedDistrict.name + ' (Pakistan) '
            : 'Pakistan'}{' '}
        </span>
        <span className="ml-2 text-slate-500 italic">
          {' '}
          during {selectedDate}
        </span>
      </div>
    </>
  )
}

export default SelectedDistrict
