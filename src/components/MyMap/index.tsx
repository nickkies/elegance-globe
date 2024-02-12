import { ColorSelector } from '@/interfaces';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { Map, View } from 'ol';
import { Layer, Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { isMobile } from 'react-device-detect';

import { CanvasWindParticlesLayer, GradientLayer } from '@/components/Custom';
import {
  MAP_INIT,
  PARTICLES_LAYER_INIT,
  GRADIENT_LAYER_INIT,
} from '@/constants';
import { colorSelector, fetchUV, isLightAtom } from '@/atoms';
import UVBuffer from '@/utils/UVBuffer';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
`;

const koreaLayer = new VectorLayer({
  source: new VectorSource({
    url: '/data/korea.geojson',
    format: new GeoJSON(),
  }),
  style: new Style({
    stroke: new Stroke({ width: 1, color: [255, 255, 255, 0.7] }),
  }),
  zIndex: 1,
});

const osm = { osm: new Tile({ source: new OSM(), zIndex: 1 }) };

export default function MyMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [map, setMap] = useState<Map | null>(null);
  const [particlesLayer, setParticlesLayer] =
    useState<CanvasWindParticlesLayer | null>(null);
  const [darkLayers] = useState<{ koreaLayer: VectorLayer }>({ koreaLayer });
  const [lightLayers, setLightLayers] = useState<{
    osm: Tile;
    gradientLayer?: Layer;
  }>(isMobile ? osm : { ...osm, gradientLayer: new Layer({}) });

  const uvBuffer = useRecoilValue<UVBuffer>(fetchUV);
  const { rv, rgb } = useRecoilValue<ColorSelector>(colorSelector);
  const isLight = useRecoilValue<boolean>(isLightAtom);

  useEffect(() => {
    if (!mapRef.current) return undefined;

    const mapObj = new Map({
      view: new View(MAP_INIT),
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

    // console.count('map init');

    const canvasWindParticlesLayer = new CanvasWindParticlesLayer({
      map,
      uvBuffer,
      ...PARTICLES_LAYER_INIT,
    });
    canvasWindParticlesLayer.setZIndex(3);
    map.addLayer(canvasWindParticlesLayer);
    setParticlesLayer(canvasWindParticlesLayer);

    if (!isMobile) {
      const gradientLayer = new GradientLayer({
        map,
        uvBuffer,
        ...GRADIENT_LAYER_INIT,
      });
      gradientLayer.setZIndex(2);
      setLightLayers((prev) => ({ ...prev, gradientLayer }));
    }
  }, [map, uvBuffer]);

  useEffect(() => {
    if (particlesLayer) {
      // console.count('change color');
      const particles = (rv * 500 + 499) * (isMobile ? 0.5 : 1);
      particlesLayer.setData(rgb, particles);
    }
  }, [particlesLayer, rgb, rv]);

  useEffect(() => {
    if (!map || !particlesLayer) return;

    // console.count('change layer group after check');

    let removes;
    let adds;

    if (isLight) {
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

    // manage effects of layers is defined above uesEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isLight]);

  return <Wrap ref={mapRef} />;
}
