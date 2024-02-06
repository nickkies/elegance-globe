import { Extent, getHeight, getWidth, getCenter, getSize } from 'ol/extent';
import { create, scale, translate, multiply, Transform } from 'ol/transform';
import { FrameState } from 'ol/PluggableMap';
import { Map } from 'ol';

/**
 * @param {Extent} extent
 * @param {number[]} coordinates
 * @returns {void}
 */
export const randomizeCoordinates = (
  extent: Extent,
  coordinates: number[],
): void => {
  coordinates[0] = Math.random() * getWidth(extent) + extent[0];
  coordinates[1] = Math.random() * getHeight(extent) + extent[1];
};

/**
 * @param {FrameState} { size, pixelRatio }
 * @param {HTMLCanvasElement} canvas
 * @returns {boolean} - True if the canvas is resized, false otherwise.
 */
export const resizeCanvasIfNeeded = (
  { size, pixelRatio }: FrameState,
  canvas: HTMLCanvasElement,
): boolean => {
  let [width, height] = size;

  width *= pixelRatio;
  height *= pixelRatio;

  if (canvas.width === width && canvas.height === height) {
    return false;
  }

  canvas.width = width;
  canvas.height = height;

  return true;
};

/**
 * @param {Extent} extent
 * @param {number} width
 * @param {number} height
 * @param {number[]} [x, y]
 * @returns {number[]} - Transformed coordinates [x, y].
 */
export const positionFromCoordinate = (
  [e0, e1, e2, e3]: Extent,
  width: number,
  height: number,
  [x, y]: number[],
): number[] => {
  return [
    ((x - e0) / (e2 - e0)) * (width - 1),
    ((y - e1) / (e3 - e1)) * (height - 1),
  ];
};

/**
 * @param {number} width
 * @param {number[]} position
 * @param {Float32Array | number[]} buffer
 * @returns {number} - The interpolated value at the specified coordinate.
 * @throws Will thorw an error if x > width or if y * width + x >= buffer.length.
 */
export const interpolatePosition = (
  width: number,
  [x, y]: number[],
  buffer: Float32Array | number[],
): number => {
  if (x > width) {
    alert('🚨Out of bound🚨');
    throw new Error('🚨Out of bound🚨');
  }
  if (y * width + x >= buffer.length) {
    alert('🚨Out of buffer bound🚨');
    throw new Error('🚨Out of buffer bound🚨');
  }

  const x1 = Math.floor(x);
  const y1 = Math.floor(y);
  const x2 = Math.ceil(x);
  const y2 = Math.ceil(y);

  const dx = x - x1;
  const dy = y - y1;

  const fx1y1 = buffer[x1 + width * y1];
  const fx1y2 = buffer[x1 + width * y2];
  const fx2y1 = buffer[x2 + width * y1];
  const fx2y2 = buffer[x2 + width * y2];
  const dfx = fx2y1 - fx1y1;
  const dfy = fx1y2 - fx1y1;
  const dfxy = fx1y1 + fx2y2 - fx2y1 - fx1y2;

  return dfx * dx + dfy * dy + dfxy * dx * dy + fx1y1;
};

const createExtentTransformToUnit = (extent: Extent): Transform => {
  const center = getCenter(extent);
  const size = getSize(extent);
  const translateToOrigin = translate(create(), -center[0], -center[1]);
  const scaleToUnit = scale(create(), 2 / size[0], 2 / size[1]);
  return multiply(scaleToUnit, translateToOrigin);
};

const createExtentTransformFromUnit = (extent: Extent): Transform => {
  const center = getCenter(extent);
  const size = getSize(extent);
  const scaleToSize = scale(create(), size[0] / 2, size[1] / 2);
  const translateToCenter = translate(create(), center[0], center[1]);
  return multiply(translateToCenter, scaleToSize);
};

const createExtentTransform = (
  srcExtent: number[],
  dstExtent: number[],
): Transform => {
  const A = createExtentTransformToUnit(srcExtent);
  const B = createExtentTransformFromUnit(dstExtent);
  return multiply(B, A);
};

export const createMatrix3FromTransform = (
  map: Map,
  extent: Extent,
): number[] => {
  const mapSize = map.getSize();
  const view = map.getView();
  const vieportExtent = view.calculateExtent(mapSize);

  const A = createExtentTransform([0, 0, ...mapSize], vieportExtent);
  const B = createExtentTransform(extent, [0, 0, 1, 1]);
  const [t0, t1, t2, t3, t4, t5] = multiply(B, A);

  return [t0, t1, 0, t2, t3, 0, t4, t5, 1];
};
