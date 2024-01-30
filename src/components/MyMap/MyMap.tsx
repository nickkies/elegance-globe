import { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import { get } from 'ol/proj';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

import CanvasWindParticlesLayer from '@/components/Custom/CanvasWindParticlesLayer';
import fetchUV from './atom';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
`;

export default function MyMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const uvBuffer = useRecoilValue(fetchUV);

  useEffect(() => {
    if (!mapRef.current) return undefined;

    const mapObj = new Map({
      view: new View({
        projection: get('EPSG:3857') || 'EPSG:4326',
        zoom: 8,
        minZoom: 7,
        center: [14230000, 4400000],
      }),
      layers: [new Tile({ source: new OSM() })],
    });

    mapObj.setTarget(mapRef.current);
    setMap(mapObj);

    return () => mapObj.setTarget('');
  }, []);

  useEffect(() => {
    if (!map) return;

    map.addLayer(
      new CanvasWindParticlesLayer({
        map,
        uvBuffer,
        particles: 3000,
        ttl: 50,
        fading: 0.9,
        particleSize: 1.5,
      }),
    );
  }, [map, uvBuffer]);

  return <Wrap ref={mapRef} />;
}
