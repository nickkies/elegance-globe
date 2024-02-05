import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { colorSelector, referenceAtom } from '@/atoms';
import { ColorSelector } from '@/interfaces';

interface SlidProps {
  $deg: number;
  $hex: string;
}

const Wrap = styled.div`
  z-index: 9999;
  position: absolute;
  left: 50%;
  bottom: 1rem;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 3em;
  opacity: 0.9;
  background-color: #1f1f1f;
  border-radius: 18px;
  @media (max-width: 1024px) {
    width: 90%;
  }
`;

const RangeInput = styled.input<SlidProps>`
  appearance: none;
  outline: none;
  width: 280px;
  height: 2px;
  border-radius: 9999px;
  background-color: ${({ $deg }) => `hsl(${$deg}, 71%, 79%)`};
  opacity: 0.8;
  &::-webkit-slider-thumb {
    appearance: none;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    background: ${({ $deg }) => `hsl(${$deg}, 71%, 69%)`};
    border: 2px solid #fff;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 2em;
    height: 2em;
    background: ${({ $hex }) => $hex};
    cursor: pointer;
  }
  @media (max-width: 1024px) {
    width: 95%;
  }
`;

export default function Slider() {
  const [rv, setRv]: [number, SetterOrUpdater<number>] =
    useRecoilState(referenceAtom);
  const { degRev, hexRev }: ColorSelector = useRecoilValue(colorSelector);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRv(Number(e.currentTarget.value));
  };

  return (
    <Wrap>
      <RangeInput
        type="range"
        step="1"
        min="1"
        max="10"
        value={rv}
        onChange={onChange}
        $deg={degRev}
        $hex={hexRev}
      />
    </Wrap>
  );
}
