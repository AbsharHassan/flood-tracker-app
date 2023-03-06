import { useSelector } from 'react-redux'

const SelectedDistrict = () => {
  const { globalSelectedDistrict } = useSelector((state) => state.apiData)
  return (
    <>
      <div className="selected-district border-b border-[#162436] bg-[#121e2d] text-slate-400 text-xs flex items-center pl-4 ">
        Displaying data for:{' '}
        <span className="font-bold ml-1">
          {' '}
          {globalSelectedDistrict
            ? globalSelectedDistrict.name + ' (Pakistan)'
            : 'Pakistan'}{' '}
        </span>
      </div>
    </>
  )
}

export default SelectedDistrict
