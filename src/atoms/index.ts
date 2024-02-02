import { atom, selector } from 'recoil';

import UVBuffer from '@/utils/UVBuffer';

export const fetchUV = selector({
  key: 'fetchUV',
  get: async () => {
    const [{ extent, width, height }, us, vs] = await Promise.all([
      fetch('/data/metadata.json').then((r) => r.json()),
      fetch('/data/u.bin').then((r) => r.arrayBuffer()),
      fetch('/data/v.bin').then((r) => r.arrayBuffer()),
    ]);

    return new UVBuffer(
      new Float32Array(us),
      new Float32Array(vs),
      width,
      height,
      extent,
    );
  },
});

export const referenceValue = atom({
  key: 'referenceValue',
  default: '1',
});
