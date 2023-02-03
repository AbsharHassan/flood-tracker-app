import { useSelector } from 'react-redux'

const SelectedDistrict = () => {
  const { globalSelectedDistrict } = useSelector((state) => state.apiData)
  return (
    <>
      <div className="h-[25px] border-b border-blue-600/20 text-slate-400 text-xs flex items-center pl-4 mr-2">
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
