import styled from 'styled-components';

const Wrap = styled.div`
  z-index: 9999;
  position: absolute;
  @media (min-width: 1024px) {
    bottom: 1rem;
    left: calc(50% + 160px);
  }
  @media (max-width: 1024px) {
    top: 1rem;
    right: 1rem;
  }
`;
const Input = styled.input`
  display: none;
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
`;
const Dog = styled.div`
  display: inline-block;
  position: absolute;
  width: 2.5em;
  height: 2.5em;
  top: 0.25em;
  left: 0.2em;
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
const RightEar = styled(Ear)`
  left: auto;
  right: 0px;
  transform: rotate(40deg) scaleX(-1);
  transform-origin: center bottom;
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
const Mouth = styled.div`
  position: absolute;
  background: #222;
  width: 14px;
  height: 7px;
  left: 50%;
  margin-left: -7px;
  bottom: 12px;
  border-radius: 2px 2px 20px 20px;
  bottom: 8px;
`;

export default function Switcher() {
  return (
    <Wrap>
      <Input type="checkbox" id="is-dark" defaultValue="true" />
      <Label htmlFor="is-dark">
        <Dog>
          <Ear />
          <RightEar />
          <Face>
            <Eyes />
            <Mouth />
          </Face>
        </Dog>
      </Label>
    </Wrap>
  );
}
