import { useSelector } from 'react-redux'
import DetailsCard from './DetailsCard'
import DetailsCardV2 from './DetailsCardV2'
import { BsFillHouseFill, BsWater } from 'react-icons/bs'
import { GiPlantRoots, GiRoad } from 'react-icons/gi'
import { FaRoad } from 'react-icons/fa'
import { HiBuildingOffice2 } from 'react-icons/hi2'

const DetailsOverview = () => {
  const {
    totalArea,
    totalFlooded,
    totalFarmlandAffected,
    totalUrbanAffected,
    totalRoadsAffected,
    globalSelectedDistrict,
    prevPeriodGlobalSelectedDistrict,
    selectedFloodData,
    prevPeriodFloodData,
  } = useSelector((state) => state.apiData)

  const { sidebarIsOpen } = useSelector((state) => state.sidebar)

  const FloodIcon = () => {
    return <BsWater className="text-sky-500" />
  }
  const UrbanIcon = () => {
    // return <BsFillHouseFill className="text-orange-700" />
    return <HiBuildingOffice2 className="text-orange-700" />
  }
  const FarmIcon = () => {
    return <GiPlantRoots className="text-green-500" />
  }
  const RoadIcon = () => {
    return <GiRoad className="text-slate-400" />
  }
  // const RoadIcon = () => {
  //   return <GiRoad className="xs:-ml-7 md:-ml-5 xs:-mr-5 text-slate-500" />
  // }

  return (
    //grid w-full grid-cols-2 px-1 py-6 md:py-6 md:grid-cols-4 gap-y-6
    <div
      className={`xs:grid space-y-3 xs:space-y-0 w-full grid-cols-2 px-1 py-4 md:py-4 gap-y-4 ${
        sidebarIsOpen ? 'xl:grid-cols-4' : 'lg:grid-cols-4'
      } transition-all duration-1000`}
    >
      {/* <div className="flex justify-center w-full">
        <div className="max-w-[220px] w-full md:min-h-[95px]  max-h-[105px] min-h-[70px] bg-[#ffffff11] bg-clip-padding backdrop-blur-3xl  rounded-sm flex justify-around sm:justify-center text-white space-x-3 sm:space-x-3 items-stretch shadow-2xl details-card ">
          <div className="flex items-center text-3xl sm:text-5xl text-sky-500">
            <BsWater />
          </div>
          <div className="flex flex-col justify-center text-xs font-medium text-slate-300">
            <div>Total Land Flooded</div>
            <div className="flex items-baseline  text-sm text-[10px] font-medium  ">
              <span className="text-lg text-md sm:text-3xl">106 </span> - km
              squared
            </div>
          </div>
        </div>
      </div> */}
      {/* <DetailsCard
        title="Total Land Flooded"
        value={
          globalSelectedDistrict
            ? (
                ((globalSelectedDistrict.results.after.floodWater / 100) *
                  globalSelectedDistrict.results.total) /
                1e6
              ).toFixed(0)
            : (((totalFlooded / 100) * totalArea) / 1e6).toFixed(0)
        }
        units="sqaure km"
        icon={FloodIcon}
        color="text-sky-500"
      /> */}
      <DetailsCardV2
        title="Total Land Flooded"
        value={
          globalSelectedDistrict
            ? (
                ((globalSelectedDistrict.results.after.floodWater / 100) *
                  globalSelectedDistrict.results.total) /
                1e6
              ).toFixed(0)
            : (
                ((selectedFloodData.results.totalFlooded / 100) *
                  selectedFloodData.results.totalArea) /
                1e6
              ).toFixed(0)
        }
        units="km&#178;"
        icon={FloodIcon}
        color="text-sky-500"
        difference={{
          value:
            globalSelectedDistrict && prevPeriodGlobalSelectedDistrict
              ? (
                  globalSelectedDistrict?.results.after.floodWater -
                  prevPeriodGlobalSelectedDistrict?.results.after.floodWater
                ).toFixed(2)
              : (
                  selectedFloodData?.results.totalFlooded -
                  prevPeriodFloodData?.results.totalFlooded
                ).toFixed(2),
          polarity:
            globalSelectedDistrict && prevPeriodGlobalSelectedDistrict
              ? globalSelectedDistrict?.results.after.floodWater -
                  prevPeriodGlobalSelectedDistrict?.results.after.floodWater >
                0
                ? false
                : true
              : selectedFloodData?.results.totalFlooded -
                  prevPeriodFloodData?.results.totalFlooded >
                0
              ? false
              : true,
        }}
      />
      {/* <div className="flex justify-center w-full">
        <div className="max-w-[220px] w-full max-h-[105px] min-h-[70px] md:min-h-[95px] bg-[#ffffff11] bg-clip-padding backdrop-blur-3xl  rounded-sm flex justify-around sm:justify-center text-white space-x-3 sm:space-x-3 items-stretch shadow-2xl details-card">
          <div className="flex items-center text-3xl text-orange-700 sm:text-5xl">
            <BsFillHouseFill />
          </div>
          <div className="flex flex-col justify-center text-xs font-medium text-slate-300">
            <div>Urban Areas Affected</div>
            <div className="flex items-baseline  text-sm text-[10px] font-medium  ">
              <span className="text-lg sm:text-3xl">21</span> - km squared
            </div>
          </div>
        </div>
      </div> */}
      {/* <DetailsCard
        title="Farm Areas Affected"
        value={
          globalSelectedDistrict
            ? (
                (((globalSelectedDistrict.results.before.farmland -
                  globalSelectedDistrict.results.after.farmland) /
                  100) *
                  globalSelectedDistrict.results.total) /
                1e6
              ).toFixed(0)
            : (((totalFarmlandAffected / 100) * totalArea) / 1e6).toFixed(0)
        }
        units="sqaure km"
        icon={FarmIcon}
        color="text-green-500"
      /> */}
      <DetailsCardV2
        title="Farm Areas Affected"
        value={
          globalSelectedDistrict
            ? (
                (((globalSelectedDistrict?.results.before.farmland -
                  globalSelectedDistrict?.results.after.farmland) /
                  100) *
                  globalSelectedDistrict?.results.total) /
                1e6
              ).toFixed(0)
            : (
                ((selectedFloodData?.results.totalFarmlandAffected / 100) *
                  selectedFloodData?.results.totalArea) /
                1e6
              ).toFixed(0)
        }
        units="km&#178;"
        icon={FarmIcon}
        color="text-green-500"
        // difference={{
        //   value: 2.34,
        //   polarity: false,
        // }}
        difference={{
          value:
            globalSelectedDistrict && prevPeriodGlobalSelectedDistrict
              ? (
                  globalSelectedDistrict?.results.before.farmland -
                  globalSelectedDistrict?.results.after.farmland -
                  (prevPeriodGlobalSelectedDistrict?.results.before.farmland -
                    prevPeriodGlobalSelectedDistrict?.results.after.farmland)
                ).toFixed(2)
              : (
                  selectedFloodData?.results.totalFarmlandAffected -
                  prevPeriodFloodData?.results.totalFarmlandAffected
                ).toFixed(2),
          polarity:
            globalSelectedDistrict && prevPeriodGlobalSelectedDistrict
              ? globalSelectedDistrict?.results.before.farmland -
                  globalSelectedDistrict?.results.after.farmland -
                  (prevPeriodGlobalSelectedDistrict?.results.before.farmland -
                    prevPeriodGlobalSelectedDistrict?.results.after.farmland) >
                0
                ? false
                : true
              : selectedFloodData?.results.totalFarmlandAffected -
                  prevPeriodFloodData?.results.totalFarmlandAffected >
                0
              ? false
              : true,
        }}
      />
      {/* <div className="flex justify-center w-full">
        <div className="max-w-[220px] w-full max-h-[105px] min-h-[70px] md:min-h-[95px] bg-[#ffffff11] bg-clip-padding backdrop-blur-3xl rounded-sm flex justify-around sm:justify-center text-white space-x-1 sm:space-x-3 items-stretch shadow-2xl details-card">
          <div className="flex items-center text-3xl text-green-500 sm:text-5xl">
            <GiPlantRoots />
          </div>
          <div className="flex flex-col justify-center text-xs font-medium text-slate-300">
            <div>Farmland Affected</div>
            <div className="flex items-baseline  text-sm text-[10px] font-medium ">
              <span className="text-lg sm:text-3xl">64</span> - km squared
            </div>
          </div>
        </div>
      </div> */}
      {/* <DetailsCard
        title="Urban Areas Affected"
        value={
          globalSelectedDistrict
            ? (
                (((globalSelectedDistrict.results.before.urban -
                  globalSelectedDistrict.results.after.urban) /
                  100) *
                  globalSelectedDistrict.results.total) /
                1e6
              ).toFixed(0)
            : (((totalUrbanAffected / 100) * totalArea) / 1e6).toFixed(0)
        }
        units="sqaure km"
        icon={UrbanIcon}
        color="text-orange-700"
      /> */}
      <DetailsCardV2
        title="Urban Areas Affected"
        value={
          globalSelectedDistrict
            ? (
                (((globalSelectedDistrict?.results.before.urban -
                  globalSelectedDistrict?.results.after.urban) /
                  100) *
                  globalSelectedDistrict?.results.total) /
                1e6
              ).toFixed(0)
            : (
                ((selectedFloodData?.results.totalUrbanAffected / 100) *
                  selectedFloodData?.results.totalArea) /
                1e6
              ).toFixed(0)
        }
        units="km&#178;"
        icon={UrbanIcon}
        color="text-orange-700"
        // difference={{
        //   value: 1.4,
        //   polarity: true,
        // }}

        difference={{
          value:
            globalSelectedDistrict && prevPeriodGlobalSelectedDistrict
              ? (
                  (globalSelectedDistrict?.results.before.urban -
                    globalSelectedDistrict?.results.after.urban -
                    (prevPeriodGlobalSelectedDistrict?.results.before.urban -
                      prevPeriodGlobalSelectedDistrict?.results.after.urban)) *
                  10
                ).toFixed(2)
              : (
                  (selectedFloodData?.results.totalUrbanAffected -
                    prevPeriodFloodData?.results.totalUrbanAffected) *
                  10
                ).toFixed(2),
          polarity:
            globalSelectedDistrict && prevPeriodGlobalSelectedDistrict
              ? globalSelectedDistrict?.results.before.urban -
                  globalSelectedDistrict?.results.after.urban -
                  (prevPeriodGlobalSelectedDistrict?.results.before.urban -
                    prevPeriodGlobalSelectedDistrict?.results.after.urban) >
                0
                ? false
                : true
              : selectedFloodData?.results.totalUrbanAffected -
                  prevPeriodFloodData?.results.totalUrbanAffected >
                0
              ? false
              : true,
        }}
      />
      {/* <div className="flex justify-center w-full">
        <div className="max-w-[220px] w-full max-h-[105px] min-h-[70px] md:min-h-[95px] bg-[#ffffff11] bg-clip-padding backdrop-blur-3xl  rounded-sm flex justify-around sm:justify-center text-white space-x-1 sm:space-x-3 items-stretch shadow-2xl details-card">
          <div className="flex items-center text-3xl sm:text-5xl text-slate-500">
            <FaRoad />
          </div>
          <div className="flex flex-col justify-center text-xs font-medium text-slate-300">
            <div>Roads Affected</div>
            <div className="flex items-baseline  text-sm text-[10px] font-medium ">
              <span className="text-lg sm:text-3xl">312</span> - roads
            </div>
          </div>
        </div>
      </div> */}
      {/* <DetailsCard
        title="Roads Affected"
        value={
          globalSelectedDistrict
            ? globalSelectedDistrict.results.roads.length
            : totalRoadsAffected
        }
        units="segments"
        icon={RoadIcon}
        color="text-slate-500"
      /> */}
      <DetailsCardV2
        title="Roads Affected"
        value={
          globalSelectedDistrict
            ? globalSelectedDistrict?.results.roads.length
            : selectedFloodData?.results.totalRoadsAffected
        }
        units="segments"
        icon={RoadIcon}
        color="text-slate-400"
        differenceUnit=" "
        // difference={{
        //   value: 22,
        //   polarity: true,
        // }}

        difference={{
          value:
            globalSelectedDistrict && prevPeriodGlobalSelectedDistrict
              ? (
                  globalSelectedDistrict?.results.roads.length -
                  prevPeriodGlobalSelectedDistrict?.results.roads.length
                ).toFixed(2)
              : (
                  selectedFloodData?.results.totalRoadsAffected -
                  prevPeriodFloodData?.results.totalRoadsAffected
                ).toFixed(2),
          polarity:
            globalSelectedDistrict && prevPeriodGlobalSelectedDistrict
              ? globalSelectedDistrict?.results.roads.length -
                  prevPeriodGlobalSelectedDistrict?.results.roads.length >
                0
                ? false
                : true
              : selectedFloodData?.results.totalRoadsAffected -
                  prevPeriodFloodData?.results.totalRoadsAffected >
                0
              ? false
              : true,
        }}
      />
    </div>
  )
}

export default DetailsOverview
