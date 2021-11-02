import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './Map.css'
import { ReactDOM } from 'react-dom';
import Tooltip from './Tooltip.js';
import api from './station.json'
import status from './station_status.json'

mapboxgl.accessToken = 'pk.eyJ1Ijoib2xsZmthaWgiLCJhIjoiY2t2Y25oZW85MDdhZTJubjNxOWE5eWo4aiJ9.yZfjmSUM0p6A_bLoXAJR9g';

const Map = () => {
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(10.75);
  const [lat, setLat] = useState(59.92);
  const [zoom, setZoom] = useState(11);
  
  const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));
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
      'properties': {}
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

    map.current.on('mousemove', e => {
      const features = map.current.queryRenderedFeatures(e.point);
      if (features.length) {
        //showTooltip(features);
      }
    });
  });

  /*function showTooltip(features) {
    features.map(feature => {
      while (feature.source === stations) {
        return <Tooltip station={feature.station_id} />;
      }
    });
  }*/
  
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
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
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
    
    )
  }
  export default Map;