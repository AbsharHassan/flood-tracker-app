import React, { useState, useEffect, useRef } from 'react'

import { Provider, useSelector, useDispatch } from 'react-redux'

import { store } from '../app/store'

import { createRoot } from 'react-dom/client'
import axios from 'axios'

import GoogleMapReact from 'google-map-react'
import ee from '@google/earthengine'
import { selectDistrict } from '../features/apiData/apiDataSlice'
import {
  setMap,
  clearOverlay,
  setOverlay,
  setShowOverlay,
} from '../features/map/mapSlice'

import mapStyles from '../MapModification/mapStyles'
import RoadMarker from './RoadMarker'
import MapSpinner from './MapSpinner'
import newCoordsPak from '../MapModification/newCoordsPak'
import MapDistrictsLegend from './MapDistrictsLegend'
import MapMarkersLegend from './MapMarkersLegend'

const Map = ({ center, zoom, backendData }) => {
  const dispatch = useDispatch()

  const {
    selectedFloodData,
    geoFormattedPolygons,
    globalSelectedDistrict,
    globalSelectedGeometry,
  } = useSelector((state) => state.apiData)
  const { apiKey, showRoads, overlay, isInfoWindowOpen, mapTheme } =
    useSelector((state) => state.map)

  const [apiDataArray, setApiDataArray] = useState([])
  const [apiPolygonArray, setApiPolygonArray] = useState(
    geoFormattedPolygons ? geoFormattedPolygons : []
  )
  const [apiFloodDataArray, setApiFloodDataArray] = useState(
    selectedFloodData ? selectedFloodData.results.resultsArray : []
  )
  const [apiRoadCoords, setApiRoadCoords] = useState([])
  const [nativeMap, setNativeMap] = useState(null)
  const [nativeMaps, setNativeMaps] = useState(null)
  const [polygonArray, setPolygonArray] = useState([])
  const [showRoadsFor, setShowRoadsFor] = useState(null)
  const [roadSwitch, setRoadSwitch] = useState(showRoads)
  const [customZoom, setCustomZoom] = useState(null)
  const [customCenter, setCustomCenter] = useState({})
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [showMapSpinner, setShowMapSpinner] = useState(false)
  const [maxFlood, setMaxFlood] = useState(selectedFloodData.results.maxFlood)
  const [selectedPeriodDates, setSelectedPeriodDates] = useState([
    selectedFloodData.after_START,
    selectedFloodData.after_END,
  ])

  let mapDistrictsLegendElRef = useRef()
  let mapMarkersLegendElRef = useRef()
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
        // setSelectedDistrict(null)
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
    // console.log(isInfoWindowOpen)
    nativeApiHandler(nativeMap, nativeMaps)
  }, [isInfoWindowOpen])

  useEffect(() => {
    setRoadSwitch(showRoads)
  }, [showRoads])

  useEffect(() => {
    setApiPolygonArray(geoFormattedPolygons)
  }, [geoFormattedPolygons])

  useEffect(() => {
    // console.log(apiRoadCoords)
  }, [apiRoadCoords])

  useEffect(() => {
    setApiFloodDataArray(selectedFloodData.results.resultsArray)
    setMaxFlood(selectedFloodData.results.maxFlood)
    setSelectedPeriodDates([
      selectedFloodData.after_START,
      selectedFloodData.after_END,
    ])
    polygonArray.map((polygon) => {
      const floodDataObject = selectedFloodData.results.resultsArray.find(
        (floodObj) => floodObj.name === polygon.name
      )
      return polygon.setOptions({
        fillOpacity:
          floodDataObject.results.after.floodWater /
          selectedFloodData.results.maxFlood,
      })
    })
    // dispatch(selectDistrict(null))
    nativeMap?.overlayMapTypes?.clear()

    // if (globalSelectedDistrict) {
    //   getFloodPixels(selectedFloodData.after_START, selectedFloodData.after_END)
    // }

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
      // console.log('this was called too')
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

  const nativeApiHandler = (map, maps) => {
    polygonArray.map((polygon) => {
      polygon.setMap(map)
      polygon.addListener('click', async () => {
        dispatch(selectDistrict(polygon.name))
        const districtFloodObject = apiFloodDataArray.find(
          (floodObj) => floodObj.name === polygon.name
        )
        setSelectedDistrict(districtFloodObject)
        map.overlayMapTypes.clear()
        dispatch(clearOverlay())
        // map.setZoom(8)
        setCustomZoom(8)
        map.setZoom(8)
        // console.log(customZoom)
        setShowRoadsFor(polygon.name)
        setCustomCenter(polygon.center)

        polygonArray.forEach((district) => {
          district.setOptions({
            visible: true,
          })
        })
        polygon.setOptions({
          visible: false,
        })
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
      fillColor: '#020416',
      // fillColor: '#0e1824',
      strokeWeight: 1,
      fillOpacity: 1,
    })

    map.data.addListener('click', () => {
      dispatch(selectDistrict(null))
    })

    const districtPolygons = apiPolygonArray.map((geometryObject) => {
      const floodDataObject = apiFloodDataArray.find(
        (floodObj) => floodObj.name === geometryObject.name
      )
      return new maps.Polygon({
        paths: geometryObject.coordinates,
        strokeColor: '#00aaff',
        strokeOpacity: 1,
        strokeWeight: 0.4,
        // fillColor: '#00FFFF88',
        fillColor: '#33aaff',
        fillOpacity: floodDataObject.results.after.floodWater / maxFlood,
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
        <MapMarkersLegend maxValue={maxFlood} />
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
      <div className="map h-full">
        <GoogleMapReact
          bootstrapURLKeys={{
            key: apiKey,
          }}
          options={{
            // disableDefaultUI: true,
            // disableDoubleClickZoom: true,
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
          {!selectedDistrict &&
            roadSwitch &&
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

//546
//448
//388
