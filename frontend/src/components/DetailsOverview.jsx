import { useSelector } from 'react-redux'

import DetailsCard from './DetailsCard'
import { BsWater } from 'react-icons/bs'
import { GiPlantRoots, GiRoad } from 'react-icons/gi'
import { HiBuildingOffice2 } from 'react-icons/hi2'

const DetailsOverview = () => {
  const {
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
    return <HiBuildingOffice2 className="text-orange-700" />
  }
  const FarmIcon = () => {
    return <GiPlantRoots className="text-green-500" />
  }
  const RoadIcon = () => {
    return <GiRoad className="text-slate-400" />
  }

  return (
    <div
      className={`xs:grid space-y-3 xs:space-y-0 w-full grid-cols-2 px-1 py-4 md:py-4 gap-y-4 ${
        sidebarIsOpen ? 'xl:grid-cols-4' : 'lg:grid-cols-4'
      } transition-all duration-1000`}
    >
      <DetailsCard
        title="Total Land Flooded"
        value={
          globalSelectedDistrict
            ? (
                ((globalSelectedDistrict?.results.after.floodWater / 100) *
                  globalSelectedDistrict?.results.total) /
                1e6
              ).toFixed(0)
            : (
                ((selectedFloodData?.results.totalFlooded / 100) *
                  selectedFloodData?.results.totalArea) /
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

      <DetailsCard
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

      <DetailsCard
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

      <DetailsCard
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
