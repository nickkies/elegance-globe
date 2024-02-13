import { Observable } from 'ol';
import { Layer } from 'ol/layer';
import { FrameState } from 'ol/PluggableMap';

import { resizeCanvasIfNeeded } from '@/utils/mapUtils';
import CustomWebGLLayer from './CustomWebGLLayer';

export default class CustomWebGLLayerRenderer extends Observable {
  layer: CustomWebGLLayer;

  canvas: HTMLCanvasElement;

  constructor(layer: CustomWebGLLayer) {
    super();
    this.layer = layer;
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('custom-canvas');
  }

  static handles(layer: Layer): boolean {
    return layer instanceof CustomWebGLLayer;
  }

  static create(_: unknown, layer: CustomWebGLLayer): CustomWebGLLayerRenderer {
    return new CustomWebGLLayerRenderer(layer);
  }

  prepareFrame(frameState: FrameState): void {
    const { layer, canvas } = this;

    resizeCanvasIfNeeded(frameState, canvas);

    return layer.doRender.call(layer, frameState, canvas.getContext('webgl'));
  }

  composeFrame(
    _: unknown,
    __: unknown,
    context: CanvasRenderingContext2D,
  ): void {
    const { layer, canvas } = this;
    context.globalAlpha = layer.getOpacity();
    context.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
  }
}
