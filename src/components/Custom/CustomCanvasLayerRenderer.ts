import { Observable } from 'ol';
import { Layer } from 'ol/layer';
import { FrameState } from 'ol/PluggableMap';
import { apply } from 'ol/transform';

import { resizeCanvasIfNeeded } from '@/utils/mapUtils';
import CustomCanvasLayer from './CustomCanvasLayer';

let tmpPreviousCenterPixel: number[] = [];

export default class CustomCanvasLayerRenderer extends Observable {
  layer: CustomCanvasLayer;

  canvases: HTMLCanvasElement[];

  previousFrame: {
    canvasId: number;
    centerX: number;
    centerY: number;
    resolution: number;
  };

  constructor(layer: CustomCanvasLayer) {
    super();
    this.layer = layer;
    this.canvases = [
      document.createElement('canvas'),
      document.createElement('canvas'),
    ];
    this.previousFrame = {
      canvasId: 0,
      centerX: 0,
      centerY: 0,
      resolution: 0,
    };
  }

  static handles(layer: Layer): boolean {
    return layer instanceof CustomCanvasLayer;
  }

  static create(
    _: unknown,
    layer: CustomCanvasLayer,
  ): CustomCanvasLayerRenderer {
    return new CustomCanvasLayerRenderer(layer);
  }

  prepareFrame(frameState: FrameState) {
    const {
      canvases,
      // previousFrame: { canvasId, centerX, centerY, resolution },
      previousFrame: { canvasId, centerX, centerY },
    } = this;
    const previousCanvas = canvases[canvasId];
    // const resized = resizeCanvasIfNeeded(frameState, previousCanvas);
    resizeCanvasIfNeeded(frameState, previousCanvas);
    const nextResolution = frameState.viewState.resolution;
    const [currentCenterX, currentCenterY] = frameState.viewState.center;

    let nextCanvas = previousCanvas;
    let nextCanvasId = canvasId;

    // if (!resized && resolution === nextResolution) {
    // if (resolution === nextResolution) {
    tmpPreviousCenterPixel = [centerX, centerY];
    apply(frameState.coordinateToPixelTransform, tmpPreviousCenterPixel);

    const dx = tmpPreviousCenterPixel[0] - frameState.size[0] / 2;
    const dy = tmpPreviousCenterPixel[1] - frameState.size[1] / 2;

    if (dx !== 0 || dy !== 0) {
      nextCanvasId = (nextCanvasId + 1) % 2;
      nextCanvas = canvases[nextCanvasId];
      resizeCanvasIfNeeded(frameState, nextCanvas);

      const newContext = nextCanvas.getContext('2d');
      newContext?.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
      newContext?.drawImage(previousCanvas, dx, dy);
    }
    // }

    this.previousFrame = {
      canvasId: nextCanvasId,
      centerX: currentCenterX,
      centerY: currentCenterY,
      resolution: nextResolution,
    };

    const ctx = nextCanvas.getContext('2d');

    this.layer.doRender(frameState, ctx);

    frameState.animate = true;

    return true;
  }

  composeFrame(_: unknown, __: unknown, context: CanvasRenderingContext2D) {
    const canvas = this.canvases[this.previousFrame.canvasId];
    const { width, height } = canvas;

    context.drawImage(canvas, 0, 0, width, height);
  }
}
