import { ParticleConfig } from '@/interfaces';

import { FrameState } from 'ol/PluggableMap';
import {
  Extent,
  containsCoordinate,
  createEmpty,
  getIntersection,
  isEmpty,
} from 'ol/extent';
import { Map } from 'ol';
import { apply as applyTransform } from 'ol/transform';

import { randomizeCoordinates } from '@/utils/mapUtils';
import UVBuffer from '@/utils/UVBuffer';
import CustomCanvasLayer from './CustomCanvasLayer';
import CustomCanvasLayerRenderer from './CustomCanvasLayerRenderer';

export default class CanvasWindParticlesLayer extends CustomCanvasLayer {
  map: Map;

  uvBuffer: UVBuffer;

  particles: { ttl: number; coordinates: number[] }[];

  ttl: number;

  fading: number;

  particleSize: number;

  pixel: number[];

  viewportWithDataExtent: Extent;

  hex: string;

  constructor({
    map,
    uvBuffer,
    particles,
    ttl,
    fading,
    particleSize,
    hex,
  }: ParticleConfig) {
    super({
      renderFunction: (
        frameState: FrameState,
        context: CanvasRenderingContext2D | null,
      ) => this.render(frameState, context),
    });
    if (!particles) throw new Error('🚨check particles🚨');
    if (!hex) throw new Error('🚨check hex🚨');

    this.map = map;
    this.uvBuffer = uvBuffer;
    this.ttl = ttl;
    this.particles = Array.from({ length: particles - 1 }).map(() => ({
      ttl: Math.random() * this.ttl,
      coordinates: [],
    }));
    this.fading = fading;
    this.particleSize = particleSize;
    this.pixel = [];
    this.viewportWithDataExtent = createEmpty();
    this.hex = hex;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.map.getRenderer() as any).registerLayerRenderers([
      CustomCanvasLayerRenderer,
    ]);
  }

  setData(hex: string, rv: number, length: number) {
    this.hex = hex;
    this.particles = Array.from({ length }).map(() => ({
      ttl: Math.random() * rv * 10,
      coordinates: [],
    }));
  }

  render(
    frameState: FrameState,
    context: CanvasRenderingContext2D | null,
  ): void {
    if (!context) return;

    context.fillStyle = this.hex;

    this.advanceParticles(frameState, context);

    const { width, height } = context.canvas;

    context.globalAlpha = this.fading;
    context.globalCompositeOperation = 'destination-in';
    context.fillRect(0, 0, width, height);
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
  }

  advanceParticles(
    {
      extent,
      pixelRatio,
      coordinateToPixelTransform,
      viewState: { resolution },
    }: FrameState,
    context: CanvasRenderingContext2D,
  ): void {
    const { uvBuffer, viewportWithDataExtent, particles, particleSize } = this;

    getIntersection(uvBuffer.extent, extent, this.viewportWithDataExtent);

    if (isEmpty(viewportWithDataExtent)) return;

    particles.forEach((particle) => {
      const { coordinates } = particle;

      if (
        coordinates.length === 0 ||
        !containsCoordinate(viewportWithDataExtent, coordinates)
      ) {
        randomizeCoordinates(viewportWithDataExtent, coordinates);
      }

      const pixel = [coordinates[0], coordinates[1]];

      applyTransform(coordinateToPixelTransform, pixel);

      context.fillRect(
        pixel[0] * pixelRatio,
        pixel[1] * pixelRatio,
        particleSize * pixelRatio,
        particleSize * pixelRatio,
      );

      particle.ttl -= 1;

      if (particle.ttl < 0) {
        randomizeCoordinates(viewportWithDataExtent, coordinates);
        particle.ttl = this.ttl;
      }

      const [u, v] = uvBuffer.getUVSpeed(coordinates);

      particle.coordinates[0] += u * resolution;
      particle.coordinates[1] += v * resolution;
    });
  }
}
