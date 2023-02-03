const Loader = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="loader-box">
        <h1 className="mb-4 text-5xl font-bold tracking-tighter text-center text-slate-300 sm:text-6xl">
          Flood <span className="text-gradient">Tracker</span>
        </h1>
        <h3 className="mb-4 font-medium tracking-tight text-center text-sky-500">
          Powered by Google Earth Engine
        </h3>
        <div className="rounded-full bg-gradient-to-r from-sky-500/30 via-sky-500/70 to-sky-500/30 bar-loader "></div>
        {/* <div className="text-xs text-center text-slate-300"> 78%</div> */}
      </div>
    </div>
  )
}

export default Loader
