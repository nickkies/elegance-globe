import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { Map, View } from 'ol';
import { get } from 'ol/proj';
import { Layer, Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import { CanvasWindParticlesLayer, GradientLayer } from '@/components/Custom';
import {
  MAP_INIT,
  PARTICLES_LAYER_INIT,
  GRADIENT_LAYER_INIT,
} from '@/constants';
import { colorSelector, fetchUV } from '@/atoms';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
`;

export default function MyMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [map, setMap] = useState<Map | null>(null);
  const [particlesLayer, setParticlesLayer] =
    useState<CanvasWindParticlesLayer | null>(null);
  const [darkLayers] = useState({
    koreaLayer: new VectorLayer({
      source: new VectorSource({
        url: '/data/korea.geojson',
        format: new GeoJSON(),
      }),
      style: new Style({
        stroke: new Stroke({ width: 1, color: [255, 255, 255, 0.7] }),
      }),
      zIndex: 1,
    }),
  });
  const [lightLayers, setLightLayers] = useState({
    osm: new Tile({ source: new OSM(), zIndex: 1 }),
    gradientLayer: new Layer({}),
  });

  const uvBuffer = useRecoilValue(fetchUV);
  const { rv, hex } = useRecoilValue(colorSelector);

  // TODO REMOVE
  const [bool, setBool] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return undefined;

    const mapObj = new Map({
      view: new View({
        projection: get('EPSG:3857') || 'EPSG:4326',
        ...MAP_INIT,
      }),
      layers: [darkLayers.koreaLayer],
    });

    const viewPort = mapObj.getViewport();
    viewPort.style.backgroundColor = '#1a1a1a';

    mapObj.setTarget(mapRef.current);
    setMap(mapObj);

    return () => mapObj.setTarget('');
  }, [darkLayers.koreaLayer]);

  useEffect(() => {
    if (!map) return;

    const canvasWindParticlesLayer = new CanvasWindParticlesLayer({
      map,
      uvBuffer,
      ...PARTICLES_LAYER_INIT,
    });

    map.addLayer(canvasWindParticlesLayer);

    const gradientLayer = new GradientLayer({
      map,
      uvBuffer,
      ...GRADIENT_LAYER_INIT,
    });

    canvasWindParticlesLayer.setZIndex(3);
    gradientLayer.setZIndex(2);

    setParticlesLayer(canvasWindParticlesLayer);
    setLightLayers((prev) => ({ ...prev, gradientLayer }));
  }, [map, uvBuffer]);

  useEffect(() => {
    if (particlesLayer) {
      particlesLayer.setData(hex, rv);
    }
  }, [particlesLayer, hex, rv]);

  // TODO REMOVE
  useEffect(() => {
    if (!map) return;
    if (!(lightLayers.gradientLayer instanceof GradientLayer)) {
      return;
    }

    let removes;
    let adds;

    if (bool) {
      removes = darkLayers;
      adds = lightLayers;
    } else {
      removes = lightLayers;
      adds = darkLayers;
    }

    Object.entries(adds).forEach((layer) => {
      map.addLayer(layer[1]);
    });
    Object.entries(removes).forEach((layer) => {
      map.removeLayer(layer[1]);
    });
  }, [map, bool]);

  // TODO REMOVE
  useEffect(() => {
    setBool((prev) => !prev);
  }, [rv]);

  return <Wrap ref={mapRef} />;
}
