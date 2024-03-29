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

  viewportWithDataExtent: Extent;

  rgb: string;

  constructor({
    map,
    uvBuffer,
    particles,
    ttl,
    fading,
    particleSize,
    rgb,
  }: ParticleConfig) {
    super({
      renderFunction: (
        frameState: FrameState,
        context: CanvasRenderingContext2D | null,
      ) => this.render(frameState, context),
    });
    if (!particles) throw new Error('🚨check particles🚨');
    if (!rgb) throw new Error('🚨check rgb🚨');

    this.map = map;
    this.uvBuffer = uvBuffer;
    this.ttl = ttl;
    this.particles = Array.from({ length: particles - 1 }).map(() => ({
      ttl: Math.random() * this.ttl,
      coordinates: [],
    }));
    this.fading = fading;
    this.particleSize = particleSize;
    this.viewportWithDataExtent = createEmpty();
    this.rgb = rgb;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.map.getRenderer() as any).registerLayerRenderers([
      CustomCanvasLayerRenderer,
    ]);
  }

  setData(rgb: string, length: number) {
    this.rgb = rgb;
    this.particles = Array.from({ length }).map(() => ({
      ttl: Math.random() * this.ttl,
      coordinates: [],
    }));
  }

  render(
    frameState: FrameState,
    context: CanvasRenderingContext2D | null,
  ): void {
    if (!context) return;
    this.advanceParticles(frameState, context);

    const { width, height } = context.canvas;

    context.fillStyle = `rgba(${this.rgb}, ${this.fading})`;
    context.globalCompositeOperation = 'destination-in';
    context.fillRect(0, 0, width, height);
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
    getIntersection(this.uvBuffer.extent, extent, this.viewportWithDataExtent);
    if (isEmpty(this.viewportWithDataExtent)) return;

    this.particles.forEach((particle) => {
      if (
        particle.coordinates.length === 0 ||
        !containsCoordinate(this.viewportWithDataExtent, particle.coordinates)
      ) {
        randomizeCoordinates(this.viewportWithDataExtent, particle.coordinates);
      }

      const pixel = [particle.coordinates[0], particle.coordinates[1]];

      applyTransform(coordinateToPixelTransform, pixel);

      context.fillRect(
        pixel[0] * pixelRatio,
        pixel[1] * pixelRatio,
        this.particleSize * pixelRatio,
        this.particleSize * pixelRatio,
      );

      particle.ttl -= 1;

      if (particle.ttl < 0) {
        randomizeCoordinates(this.viewportWithDataExtent, particle.coordinates);
        particle.ttl = this.ttl;
      }

      const [u, v] = this.uvBuffer.getUVSpeed(particle.coordinates);

      particle.coordinates[0] += u * resolution;
      particle.coordinates[1] += v * resolution;
    });
  }
}
