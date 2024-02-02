import styled from 'styled-components';

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
  height: 36px;
  opacity: 0.9;
  background-color: #1a1a1a;
  border-radius: 18px;
  @media (max-width: 1024px) {
    width: 90%;
  }
`;

const RangeInput = styled.input`
  appearance: none;
  outline: none;
  width: 280px;
  height: 2px;
  border-radius: 9999px;
  background-color: hsl(180, 71%, 79%);
  opacity: 0.8;
  &::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: hsl(180, 71%, 69%);
    border: 2px solid #fff;
    opacity: 0.9;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #a3efef;
    cursor: pointer;
  }
  @media (max-width: 1024px) {
    width: 95%;
  }
`;

export default function Slider() {
  return (
    <Wrap>
      <RangeInput type="range" min="1" max="10" defaultValue="1" step="1" />
    </Wrap>
  );
}
