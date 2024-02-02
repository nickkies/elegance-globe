import { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import { get } from 'ol/proj';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

import { CanvasWindParticlesLayer, GradientLayer } from '@/components/Custom';
import {
  MAP_INIT,
  PARTICLES_LAYER_INIT,
  GRADIENT_LAYER_INIT,
} from '@/constants';
import { colorSelector, fetchUV } from '@/atoms';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
`;

export default function MyMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [map, setMap] = useState<Map | null>(null);
  const [particleLayer, setParticleLayer] =
    useState<CanvasWindParticlesLayer | null>(null);

  const uvBuffer = useRecoilValue(fetchUV);
  const { rv, hex } = useRecoilValue(colorSelector);

  useEffect(() => {
    if (!mapRef.current) return undefined;

    const mapObj = new Map({
      view: new View({
        projection: get('EPSG:3857') || 'EPSG:4326',
        ...MAP_INIT,
      }),
      layers: [new Tile({ source: new OSM() })],
    });

    const viewPort = mapObj.getViewport();
    viewPort.style.backgroundColor = '#1a1a1a';

    mapObj.setTarget(mapRef.current);
    setMap(mapObj);

    return () => mapObj.setTarget('');
  }, []);

  useEffect(() => {
    if (!map) return;

    const pl = new CanvasWindParticlesLayer({
      map,
      uvBuffer,
      ...PARTICLES_LAYER_INIT,
    });

    map.addLayer(pl);
    setParticleLayer(pl);

    map.addLayer(
      new GradientLayer({
        map,
        uvBuffer,
        ...GRADIENT_LAYER_INIT,
      }),
    );
  }, [map, uvBuffer]);

  useEffect(() => {
    if (!particleLayer) return;
    particleLayer.setData(hex, rv);
  }, [particleLayer, hex, rv]);

  return <Wrap ref={mapRef} />;
}
