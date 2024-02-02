import { Map } from 'ol';

import UVBuffer from '@/utils/UVBuffer';

interface Config {
  map: Map;
  uvBuffer: UVBuffer;
}

export interface ParticleConfig extends Config {
  particles: number;
  hex: string;
  ttl: number;
  fading: number;
  particleSize: number;
}

export interface GradientConfig extends Config {
  opacity: number;
}

export interface ColorSelector {
  rv: number;
  deg: number;
  degRev: number;
  hex: string;
  hexRev: string;
}
