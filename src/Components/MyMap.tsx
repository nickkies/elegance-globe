import { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import { get } from 'ol/proj';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
`;

export default function MyMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return undefined;

    const mapObj = new Map({
      view: new View({
        projection: get('EPSG:3857') || 'EPSG:4326',
        zoom: 7,
        minZoom: 7,
        center: [14230000, 4400000],
      }),
      layers: [new Tile({ source: new OSM() })],
    });

    mapObj.setTarget(mapRef.current);
    return () => mapObj.setTarget('');
  }, []);

  return <Wrap ref={mapRef} />;
}
