import { useRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import { isLightAtom } from '@/atoms';

const Wrap = styled.div`
  z-index: 9999;
  position: absolute;
  @media (min-width: 1024px) {
    bottom: 1.5rem;
    left: calc(50% + 160px);
  }
  @media (max-width: 1024px) {
    top: 1rem;
    right: 1rem;
  }
`;
const Input = styled.input`
  display: none;
  &:checked + label > div {
    left: 68px;
    transform: rotate(360deg);
  }
`;
const Label = styled.label`
  width: 7em;
  opacity: 0.9;
  background: #1f1f1f;
  height: 3em;
  display: inline-block;
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  transform-origin: 20% center;
  &:before {
    content: none;
    display: block;
    transition: all 0.2s ease;
    width: 2.3em;
    height: 2.3em;
    top: 0.25em;
    left: 0.25em;
    border-radius: 2em;
    border: 2px solid #88cf8f;
    transition: 0.3s ease;
  }
`;
const Dog = styled.div`
  display: inline-block;
  position: absolute;
  width: 2.5em;
  height: 2.5em;
  top: 0.25em;
  left: 0.2em;
  transition: 0.6s ease;
`;
const Ear = styled.div`
  width: 18px;
  height: 20px;
  position: absolute;
  left: -4px;
  bottom: 80%;
  background: #f9bb00;
  margin-bottom: -5px;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  box-shadow:
    inset 4px 0 0 0px #ffffff,
    inset -4px 0 0 0px #ffffff;
  transform: rotate(-40deg);
`;
const RightEar = styled(Ear)<{ isLight: boolean }>`
  left: auto;
  right: 0px;
  transform: scaleX(-1) rotate(-35deg);
  transform-origin: center bottom;
  transition: 0.4s ease-in-out;
  ${({ isLight }) =>
    isLight &&
    css`
      transform: rotate(60deg) scaleX(-1);
      transition-delay: 0.6s;
    `}
`;
const Face = styled.div`
  overflow: hidden;
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  position: absolute;
  background: #fff;
  z-index: 8;
`;
const Eyes = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: #222;
  border-radius: 50%;
  transform: translate(8px, 14px);
  box-shadow:
    16px 0 0 #222,
    22px -4px 0 12px #e4ac04;
`;
const Mouth = styled.div<{ isLight: boolean }>`
  position: absolute;
  background: #222;
  width: 14px;
  height: 7px;
  left: 50%;
  margin-left: -7px;
  bottom: 12px;
  border-radius: 2px 2px 20px 20px;
  bottom: 8px;
  transform: scale(0);
  transition: 0.1s ease;
  &:before {
    position: absolute;
    content: '';
    width: 8px;
    height: 8px;
    background: #ec788d;
    border-radius: 0 0 50% 50%;
    transform: translate(3px, 5px);
  }
  &:after {
    content: '';
    position: absolute;
  }
  ${({ isLight }) =>
    isLight &&
    css`
      transform: scale(1);
      transition-delay: 0.7s;
    `};
`;

export default function Switcher() {
  const [isLight, setisLight] = useRecoilState(isLightAtom);

  const onChange = () => {
    setisLight(!isLight);
  };

  return (
    <Wrap>
      <Input
        type="checkbox"
        id="is-dark"
        checked={isLight}
        onChange={onChange}
      />
      <Label htmlFor="is-dark">
        <Dog>
          <Ear />
          <RightEar isLight={isLight} />
          <Face>
            <Eyes />
            <Mouth isLight={isLight} />
          </Face>
        </Dog>
      </Label>
    </Wrap>
  );
}
