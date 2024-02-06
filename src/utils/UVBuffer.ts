import { clone } from 'ol/extent';

import { interpolatePosition, positionFromCoordinate } from './mapUtils';

export default class UVBuffer {
  size: number;

  extent: number[];

  dataWidth: number;

  dataHeight: number;

  speedBuffer: Float32Array;

  simpleSpeedBuffer: Uint8Array;

  rotationBuffer: Float32Array;

  uBuffer: Float32Array;

  vBuffer: Float32Array;

  constructor(
    us: Float32Array | null,
    vs: Float32Array | null,
    width: number,
    height: number,
    extent: number[],
  ) {
    this.size = width * height;

    if (!us || !vs || us.length !== this.size || vs.length !== this.size) {
      alert('🚨Check uv size🚨');
      throw new Error('🚨Check uv size🚨');
    }

    this.extent = clone(extent);
    this.dataWidth = width;
    this.dataHeight = height;
    this.speedBuffer = new Float32Array(us.length);
    this.simpleSpeedBuffer = new Uint8Array(us.length);
    this.rotationBuffer = new Float32Array(us.length);
    this.uBuffer = us;
    this.vBuffer = vs;

    us.forEach((u: number, i: number) => {
      const v = vs[i];
      const speed = Math.sqrt(u * u + v * v);
      this.speedBuffer[i] = speed;
      this.simpleSpeedBuffer[i] = Math.ceil(speed);
      this.rotationBuffer[i] = Math.atan2(v, u);
    });
  }

  getUVSpeed(coordinate: number[]): number[] {
    const width = this.dataWidth;
    const height = this.dataHeight;
    const position = positionFromCoordinate(
      this.extent,
      width,
      height,
      coordinate,
    );

    const u = interpolatePosition(width, position, this.uBuffer);
    const v = interpolatePosition(width, position, this.vBuffer);

    return [u, v];
  }
}
