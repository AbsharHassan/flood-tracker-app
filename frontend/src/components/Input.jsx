import React from 'react'

const Input = ({
  label,
  name,
  type,
  placeholder,
  value,
  redBorder,
  handleOnChange,
}) => {
  return (
    <div className="flex flex-col mb-6">
      <label className=" text-xs text-slate-400 font-medium mb-2">
        {label}
      </label>
      <input
        className={`h-11 bg-transparent border-2  rounded focus:outline-none focus:border-[#225ad3ff] transition-colors duration-300 p-3 text-xs text-slate-500 placeholder:text-slate-500 ${
          redBorder ? 'border-red-600' : 'border-[#225ad380]'
        }`}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
      />
    </div>
  )
}

export default Input
