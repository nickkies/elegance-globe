import { Map } from 'ol';

import UVBuffer from '@/utils/UVBuffer';

export interface ParticleConfig {
  map: Map;
  uvBuffer: UVBuffer;
  particles: number;
  ttl: number;
  fading: number;
  particleSize: number;
}
