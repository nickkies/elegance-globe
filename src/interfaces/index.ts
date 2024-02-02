import { Map } from 'ol';

import UVBuffer from '@/utils/UVBuffer';

interface Config {
  map: Map;
  uvBuffer: UVBuffer;
}

export interface ParticleConfig extends Config {
  particles: number;
  ttl: number;
  fading: number;
  particleSize: number;
}

export interface GradientConfig extends Config {
  opacity: number;
}

export interface ColorSelector {
  deg: number;
  degRev: number;
  color: string;
  colorRev: string;
}
