import { forwardRef } from 'react'
const Loader = ({ isDarkMode }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        opacity: 1,
      }}
      className={`fixed top-0 left-0 z-[3000] flex items-center justify-center w-screen h-screen opacity-0 ${
        isDarkMode ? 'bg-themeBgColorDark' : 'bg-themeBgColorLight'
      }  `}
    >
      <div className="loader-box">
        <h1
          className={`mb-4 text-5xl font-bold tracking-tighter text-center sm:text-6xl ${
            isDarkMode ? 'text-slate-300' : 'text-slate-800'
          }`}
        >
          Flood <span className="text-gradient">Tracker</span>
        </h1>
        <h3 className="mb-4 font-medium tracking-tight text-center text-sky-500">
          Powered by Google Earth Engine
        </h3>
        <div className="rounded-full bg-gradient-to-r from-sky-500/30 via-sky-500/70 to-sky-500/30 bar-loader "></div>
      </div>
    </div>
  )
}

export default forwardRef(Loader)
