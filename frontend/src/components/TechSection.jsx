import { cloneElement, useState } from 'react'

import { ReactComponent as CloudSVG } from '../assets/google_cloud_console.svg'
import { ReactComponent as MapsSVG } from '../assets/maps_javascript_api.svg'
import { ReactComponent as EarthEngineSVG } from '../assets/earthengine.svg'
import { ReactComponent as MongoDbSVG } from '../assets/MongoDB_Logomark_ForestGreen.svg'
import { ReactComponent as ExpressSVG } from '../assets/expressjs-icon.svg'
import { ReactComponent as ReactSVG } from '../assets/react-logo.svg'
import { ReactComponent as NodeSVG } from '../assets/nodejs-seeklogo.com.svg'
import { ReactComponent as TailwindSVG } from '../assets/tailwindcss.svg'
import { ReactComponent as MaterialUiSVG } from '../assets/material-ui-1.svg'

const TechSection = ({ isScreenLg, isDarkMode }) => {
  const [apiLogos] = useState([
    {
      title: 'Google Earth Engine API',
      icon: <EarthEngineSVG className="w-[75px] h-[75px]" />,
    },
    {
      title: 'Google Maps Javascript API',
      icon: <MapsSVG />,
    },
    {
      title: 'Google Cloud Platform',
      icon: <CloudSVG />,
    },
    {
      title: 'MongoDB',
      icon: <MongoDbSVG />,
    },
    {
      title: 'ExpressJS',
      icon: <ExpressSVG />,
    },
    {
      title: 'ReactJS',
      icon: <ReactSVG />,
    },
    {
      title: 'NodeJS',
      icon: <NodeSVG />,
    },
    {
      title: 'TailwindCSS',
      icon: <TailwindSVG />,
    },
    {
      title: 'Material UI 5',
      icon: <MaterialUiSVG />,
    },
  ])

  return (
    <div
      className={`h-full py-4 ${
        isDarkMode ? 'text-slate-400' : 'text-slate-500'
      } `}
    >
      <h2 className="text-center tracking-wide h-[25px]">APIs & Stack</h2>
      <hr
        className={`mt-2 ${
          isDarkMode ? 'border-slate-700' : 'border-slate-400'
        }`}
      />
      <div
        className={`w-full h-calc-minus-65 grid grid-cols-3 justify-items-center place-items-center gap-y-14 ${
          isDarkMode ? 'opacity-60' : 'opacity-90'
        }`}
      >
        {apiLogos.map((logo) => (
          <div
            key={logo.title}
            className="hover:cursor-pointer"
          >
            {cloneElement(logo.icon, {
              style: {
                width: `${
                  logo.title === 'ExpressJS'
                    ? `${isScreenLg ? '85px' : '65px'}`
                    : `${isScreenLg ? '75px' : '55px'}`
                }`,
                height: `${
                  logo.title === 'ExpressJS'
                    ? `${isScreenLg ? '85px' : '65px'}`
                    : `${isScreenLg ? '75px' : '55px'}`
                }`,
                borderRadius: `${
                  logo.title === 'ExpressJS' ? '9000px' : '0px'
                }`,
                backgroundColor: `${
                  logo.title === 'ExpressJS' ? 'rgb(51 65 85)' : ''
                }`,
                padding: `${logo.title === 'ExpressJS' ? '4px' : '0px'}`,
              },
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TechSection
