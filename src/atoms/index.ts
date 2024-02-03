import { ColorSelector } from '@/interfaces';

import { atom, selector } from 'recoil';

import UVBuffer from '@/utils/UVBuffer';
import { HEX_ARR } from '@/constants';

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

export const referenceAtom = atom({
  key: 'referenceAtom',
  default: 5,
});

export const colorSelector = selector({
  key: 'colorSelector',
  get: ({ get }): ColorSelector => {
    const rv = get(referenceAtom);
    const i = rv - 1;

    return {
      rv,
      deg: rv * 36,
      hex: HEX_ARR[i],
      degRev: rv * 36 + 180,
      hexRev: HEX_ARR[i % HEX_ARR.length],
    };
  },
});
