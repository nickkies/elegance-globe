import { ColorSelector } from '@/interfaces';

import { useCallback, useEffect, useRef, useState } from 'react';
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

interface LightLayers {
  osm: Tile;
  gradientLayer?: Layer;
}

const Wrap = styled.div`
  width: 100%;
  height: 100%;
`;

const osm = { osm: new Tile({ source: new OSM(), zIndex: 1 }) };

const darkLayers = {
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
};

export default function MyMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [map, setMap] = useState<Map | null>(null);
  const [particlesLayer, setParticlesLayer] =
    useState<CanvasWindParticlesLayer | null>(null);
  const [lightLayers, setLightLayers] = useState<LightLayers>(osm);

  const uvBuffer = useRecoilValue<UVBuffer>(fetchUV);
  const { rv, rgb } = useRecoilValue<ColorSelector>(colorSelector);
  const isLight = useRecoilValue<boolean>(isLightAtom);

  const initMap = (): Map | null => {
    if (!mapRef.current) return null;

    const mapObj = new Map({
      view: new View(MAP_INIT),
      layers: [darkLayers.koreaLayer],
    });

    const viewPort = mapObj.getViewport();
    viewPort.style.backgroundColor = '#1a1a1a';

    mapObj.setTarget(mapRef.current);
    setMap(mapObj);

    return mapObj;
  };

  const initLayers = (mapObj: Map, buffer: UVBuffer) => {
    const params = { map: mapObj, uvBuffer: buffer };

    const canvasWindParticlesLayer = new CanvasWindParticlesLayer({
      ...params,
      ...PARTICLES_LAYER_INIT,
    });

    canvasWindParticlesLayer.setZIndex(3);
    mapObj.addLayer(canvasWindParticlesLayer);
    setParticlesLayer(canvasWindParticlesLayer);

    if (!isMobile) {
      const gradientLayer = new GradientLayer({
        ...params,
        ...GRADIENT_LAYER_INIT,
      });

      gradientLayer.setZIndex(2);
      setLightLayers((prev) => ({ ...prev, gradientLayer }));
    }
  };

  const changeRv = useCallback(
    (layer: CanvasWindParticlesLayer | null) => {
      if (layer) {
        const particles = (rv * 500 + 499) * (isMobile ? 0.5 : 1);
        layer.setData(rgb, particles);
      }
    },
    [rgb, rv],
  );

  const toggleLayers = useCallback(
    (mapObj: Map, light: LightLayers) => {
      let removes;
      let adds;

      if (isLight) {
        removes = darkLayers;
        adds = light;
      } else {
        removes = light;
        adds = darkLayers;
      }

      Object.entries(adds).forEach((layer) => {
        mapObj.addLayer(layer[1]);
      });
      Object.entries(removes).forEach((layer) => {
        mapObj.removeLayer(layer[1]);
      });
    },
    [isLight],
  );

  useEffect(() => {
    const mapObj = initMap();
    return () => mapObj?.setTarget('');
  }, []);

  useEffect(() => {
    if (!map) return;
    initLayers(map, uvBuffer);
  }, [map, uvBuffer]);

  useEffect(() => {
    changeRv(particlesLayer);

    // particlesLayer
    // to prevent entry during the first rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeRv]);

  useEffect(() => {
    if (!map || !particlesLayer) return;

    toggleLayers(map, lightLayers);

    // lightLayers, particlesLayer
    // manage effects of layers is defined above uesEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, toggleLayers]);

  return <Wrap ref={mapRef} />;
}
