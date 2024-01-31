import { FrameState } from 'ol/PluggableMap';
import { Layer } from 'ol/layer';
import State from 'ol/source/State';

interface RenderFunction {
  (frameState: FrameState, context: WebGLRenderingContext | null): void;
}

interface Props {
  opacity: number;
  renderFunction: RenderFunction;
}

export default class CustomWebGLLayer extends Layer {
  doRender: RenderFunction;

  constructor({ opacity, renderFunction }: Props) {
    super({ opacity });
    this.doRender = renderFunction;
  }

  // eslint-disable-next-line class-methods-use-this
  getSourceState() {
    return State.READY;
  }
}
