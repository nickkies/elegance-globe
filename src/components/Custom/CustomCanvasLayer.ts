import { FrameState } from 'ol/PluggableMap';
import Layer from 'ol/layer/Layer';
import State from 'ol/source/State';

interface RenderFunction {
  (frameState: FrameState, context: CanvasRenderingContext2D | null): void;
}

export default class CustomCanvasLayer extends Layer {
  doRender: RenderFunction;

  constructor({ renderFunction }: { renderFunction: RenderFunction }) {
    super({});
    this.doRender = renderFunction;
  }

  // eslint-disable-next-line class-methods-use-this
  getSourceState() {
    return State.READY;
  }
}
