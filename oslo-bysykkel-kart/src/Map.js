import React, {useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './Map.css'
import ReactDOM from 'react-dom';
import api from './station.json'
import status from './station_status.json'
import Tooltip from './Tooltip.js'

mapboxgl.accessToken = 'pk.eyJ1Ijoib2xsZmthaWgiLCJhIjoiY2t2Y25oZW85MDdhZTJubjNxOWE5eWo4aiJ9.yZfjmSUM0p6A_bLoXAJR9g';

const Map = () => {
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const lng = 10.75;
  const lat = 59.92;
  const zoom = 11;
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))

  const stations = api.data.stations.map(s1 => ({...s1, ...status.data.stations.find(s2 => s2.station_id === s1.station_id)}))
  const stationsGeoJSONArray = stations.map(station => {
    return {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          station.lon, station.lat
        ]
      },
      'properties': {'station_id' : station.station_id}
    }
  });

  const featureCollection = {
    "type": "FeatureCollection",
    "features": stationsGeoJSONArray
  }
  
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('click', e => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['stations'],
      })
      if (features.length) {
        const feature = features[0]
        const currentStation = stations.find(station => station.station_id === feature.properties.station_id)
        const popupNode = document.createElement("div")
        ReactDOM.render(
          <Tooltip
            name = {currentStation.name}
            num_bikes_available = {currentStation.num_bikes_available}
            num_docks_available = {currentStation.num_docks_available}
          />, popupNode
        )
        popUpRef.current
          .setLngLat(e.lngLat)
          .setDOMContent(popupNode)
          .addTo(map.current)
       }
    });
  });

  
  useEffect(() => {
    if (!map.current) return;
    map.current.on('load', () => {
      map.current.addSource('stations', {
        "type": "geojson",
        "data": featureCollection
      })
      map.current.addLayer({
        id: 'stations',
        type: 'circle',
        source: 'stations',
        paint: {
          "circle-color": "#11bb22",
          "circle-radius": 10,
          "circle-stroke-color": "#333333",
          "circle-stroke-width": 2,
        },
      });
    });
  });
  
  return (
    <div ref={mapContainer} className="map-container">
    </div>
    )
  }
  export default Map;