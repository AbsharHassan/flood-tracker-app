/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store } from '../app/store'
import axios from 'axios'
import GoogleMapReact from 'google-map-react'
import ee from '@google/earthengine'
import { selectDistrict } from '../features/apiData/apiDataSlice'
import {
  setMap,
  clearOverlay,
  setOverlay,
  setShowOverlay,
  setMapTheme,
} from '../features/map/mapSlice'
import mapStyles from '../MapModification/mapStyles'
import RoadMarker from './RoadMarker'
import MapSpinner from './MapSpinner'
import newCoordsPak from '../MapModification/newCoordsPak'
import MapDistrictsLegend from './MapDistrictsLegend'
import MapControlsUI from './MapControlsUI'

const Map = ({ center, zoom }) => {
  const dispatch = useDispatch()

  const {
    selectedFloodData,
    geoFormattedPolygons,
    globalSelectedDistrict,
    globalSelectedGeometry,
  } = useSelector((state) => state.apiData)

  const { showRoads, isInfoWindowOpen, mapTheme } = useSelector(
    (state) => state.map
  )
  const { isDarkMode } = useSelector((state) => state.sidebar)

  const [apiPolygonArray, setApiPolygonArray] = useState(
    geoFormattedPolygons ? geoFormattedPolygons : []
  )
  const [apiFloodDataArray, setApiFloodDataArray] = useState(
    selectedFloodData ? selectedFloodData.resultsArray : []
  )
  const [apiRoadCoords, setApiRoadCoords] = useState([])
  const [nativeMap, setNativeMap] = useState(null)
  const [nativeMaps, setNativeMaps] = useState(null)
  const [polygonArray, setPolygonArray] = useState([])
  const [showRoadsFor, setShowRoadsFor] = useState(null)
  const [roadSwitch, setRoadSwitch] = useState(showRoads)
  const [customZoom, setCustomZoom] = useState(null)
  const [customCenter, setCustomCenter] = useState({})
  const [showMapSpinner, setShowMapSpinner] = useState(false)
  const [maxFlood, setMaxFlood] = useState(
    selectedFloodData ? selectedFloodData.maxFlood : 0
  )

  let mapDistrictsLegendElRef = useRef()
  let mapMarkersLegendElRef = useRef()
  let mapDivRef = useRef()
  let axiosAbortController = useRef()

  const MapControls = () => {
    return (
      <>
        <div ref={mapDistrictsLegendElRef} />
        <div ref={mapMarkersLegendElRef} />
      </>
    )
  }

  const getFloodPixels = async (afterStart, afterEnd) => {
    if (axiosAbortController.current) {
      axiosAbortController.current.abort()
    }

    axiosAbortController.current = new AbortController()

    setShowMapSpinner(true)

    await axios
      .post(
        '/api/flood-data/district',
        {
          afterStart,
          afterEnd,
          district: globalSelectedDistrict.name,
        },
        {
          signal: axiosAbortController.current.signal,
        }
      )
      .then((response) => {
        console.log(`${globalSelectedDistrict.name} data recieved`)
        const mapid = response.data
        const tileSource = new ee.layers.EarthEngineTileSource({
          mapid,
        })
        const overlay = new ee.layers.ImageOverlay(tileSource)
        dispatch(setShowOverlay(true))
        dispatch(setOverlay(overlay))
        nativeMap.overlayMapTypes.push(overlay)
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request cancelled.')
        } else {
          console.log(error)
        }
      })

    setShowMapSpinner(false)
  }

  useEffect(() => {
    nativeApiHandler(nativeMap, nativeMaps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInfoWindowOpen])

  useEffect(() => {
    setRoadSwitch(showRoads)
  }, [showRoads])

  useEffect(() => {
    setApiPolygonArray(geoFormattedPolygons)
  }, [geoFormattedPolygons])

  useEffect(() => {
    if (!selectedFloodData) {
      return
    }

    setApiFloodDataArray(selectedFloodData.resultsArray)
    setMaxFlood(selectedFloodData.maxFlood)

    polygonArray.map((polygon) => {
      const floodDataObject = selectedFloodData.resultsArray.find(
        (floodObj) => floodObj.name === polygon.name
      )
      console.log(floodDataObject)
      return polygon.setOptions({
        fillOpacity: floodDataObject
          ? floodDataObject.results.after.floodWater /
            selectedFloodData.maxFlood
          : 0,
      })
    })
    nativeMap?.overlayMapTypes?.clear()

    if (!globalSelectedDistrict && nativeMap) {
      polygonArray.forEach((district) => {
        district.setOptions({
          visible: true,
        })
      })
      setShowRoadsFor(null)
      nativeMap.overlayMapTypes.clear()
      nativeMap.setZoom(6)
      setCustomZoom(6)
      setCustomCenter({})
      dispatch(setOverlay(null))
    } else if (globalSelectedDistrict && globalSelectedGeometry && nativeMap) {
      mapDistrictsLegendElRef.current?.scrollIntoView()

      polygonArray.forEach((district) => {
        district.setOptions({
          visible: true,
        })
      })

      const selectedPolygon = polygonArray.find(
        (polygon) => polygon.name === globalSelectedGeometry.name
      )
      selectedPolygon.setOptions({
        visible: false,
      })
      setCustomZoom(8)
      nativeMap.overlayMapTypes.clear()
      dispatch(clearOverlay())
      nativeMap.setZoom(8)
      setShowRoadsFor(globalSelectedGeometry.name)
      setCustomCenter(globalSelectedGeometry.center)
      getFloodPixels(selectedFloodData.after_START, selectedFloodData.after_END)
    }
  }, [selectedFloodData, globalSelectedDistrict, globalSelectedGeometry])

  useEffect(() => {
    if (nativeMap && nativeMaps) {
      nativeApiHandler(nativeMap, nativeMaps)
    }
  }, [nativeMap, nativeMaps])

  useEffect(() => {
    if (apiFloodDataArray?.length && showRoadsFor) {
      const districtObject = apiFloodDataArray.find(
        (district) => district.name === showRoadsFor
      )
      if (districtObject) {
        setApiRoadCoords(districtObject.results.roads)
      }
    }
  }, [apiFloodDataArray, showRoadsFor])

  useEffect(() => {
    dispatch(setMapTheme(isDarkMode ? 'dark' : 'light'))
    if (nativeMap) {
      nativeMap.data.setStyle({
        fillColor: isDarkMode ? '#0e1824' : '#fff',
        strokeWeight: isDarkMode ? 1 : 0.25,
        fillOpacity: 1,
      })
    }
  }, [isDarkMode])

  const nativeApiHandler = (map, maps) => {
    console.log('native api handler called')
    if (polygonArray && selectedFloodData) {
      polygonArray.map((polygon) => {
        const floodDataObject = selectedFloodData.resultsArray.find(
          (floodObj) => floodObj.name === polygon.name
        )
        console.log(floodDataObject)
        return polygon.setOptions({
          fillOpacity: floodDataObject
            ? floodDataObject.results.after.floodWater /
              selectedFloodData.maxFlood
            : 0,
        })
      })
    }
    // eslint-disable-next-line array-callback-return
    polygonArray.map((polygon) => {
      polygon.setMap(map)
      polygon.addListener('click', async () => {
        dispatch(selectDistrict(polygon.name))
        map.overlayMapTypes.clear()
        dispatch(clearOverlay())
      })
    })
  }

  const handleApiLoaded = (map, maps) => {
    const newCoordsPakArrayReducedArray = [].concat(...newCoordsPak)

    const holePolygonCoords = newCoordsPakArrayReducedArray.map(
      (innerArrays) => {
        return innerArrays.map((coords) => {
          return { lat: coords[1], lng: coords[0] }
        })
      }
    )

    const coverPolygonCoords = [
      //anti-clockwise
      { lat: -89, lng: 0 },
      { lat: -89, lng: 179 },
      { lat: 89, lng: 179 },
      { lat: 89, lng: 0 },
      { lat: -89, lng: 0 },
    ]

    holePolygonCoords.unshift(coverPolygonCoords)

    map.data.add({
      geometry: new maps.Data.Polygon(holePolygonCoords),
    })

    map.data.setStyle({
      fillColor: isDarkMode ? '#0e1824' : '#fff',
      strokeWeight: 1,
      fillOpacity: 1,
    })

    map.data.addListener('click', () => {
      dispatch(selectDistrict(null))
    })

    const districtPolygons = apiPolygonArray.map((geometryObject) => {
      const floodDataObject = apiFloodDataArray.find((floodObj) => {
        return floodObj.name === geometryObject.name
      })

      return new maps.Polygon({
        paths: geometryObject.coordinates,
        strokeColor: '#00aaff',
        strokeOpacity: 1,
        strokeWeight: 0.4,
        fillColor: '#33aaff',
        fillOpacity: floodDataObject
          ? floodDataObject.results.after.floodWater / maxFlood
          : 0,
        name: geometryObject.name,
        center: geometryObject.center,
        uncovered: false,
      })
    })

    createRoot(mapDistrictsLegendElRef.current).render(
      <Provider store={store}>
        <MapDistrictsLegend />
      </Provider>
    )
    map.controls[maps.ControlPosition.LEFT_BOTTOM].push(
      mapDistrictsLegendElRef.current
    )

    createRoot(mapMarkersLegendElRef.current).render(
      <Provider store={store}>
        <MapControlsUI maxValue={maxFlood} />
      </Provider>
    )
    map.controls[maps.ControlPosition.TOP_LEFT].push(
      mapMarkersLegendElRef.current
    )

    setPolygonArray(districtPolygons)
    setNativeMap(map)
    setNativeMaps(maps)

    dispatch(setMap(map))
  }

  return (
    <>
      <MapControls />
      <div
        className="mx-auto w-full h-full p-[3.5px]"
        ref={mapDivRef}
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          }}
          options={{
            styles: mapTheme === 'dark' ? mapStyles.labelDarkTheme : [],
            restriction: {
              latLngBounds: {
                north: 40,
                south: 20,
                west: 55,
                east: 82,
              },
              strictBounds: true,
            },
          }}
          defaultCenter={{ lat: 30.3753, lng: 69.3451 }}
          center={Object.keys(customCenter).length ? customCenter : center}
          defaultZoom={zoom}
          zoom={customZoom ? customZoom : zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps, MapOptions }) =>
            handleApiLoaded(map, maps, MapOptions)
          }
        >
          {showMapSpinner && customCenter && (
            <MapSpinner
              lat={customCenter.lat}
              lng={customCenter.lng}
            />
          )}
          {roadSwitch &&
            showRoadsFor &&
            apiRoadCoords.map((coordinates, i) => (
              <RoadMarker
                key={i}
                lat={coordinates.lat}
                lng={coordinates.lng}
                size="11px"
              />
            ))}
        </GoogleMapReact>
      </div>
    </>
  )
}

Map.defaultProps = {
  zoom: 6,
  center: { lat: 30.3753, lng: 69.3451 },
  isbDisplayPolygon: true,
  chitralDisplayPolygon: true,
}

export default Map
