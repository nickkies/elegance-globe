import styled from 'styled-components';

const Wrap = styled.div`
  z-index: 9999;
  position: absolute;
  top: 1.5em;
  left: 1.5em;
  width: 5em;
  height: 5em;
  cursor: pointer;
  &:hover {
    width: 10em;
    height: 10em;
  }
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  &:hover {
    content: url('/telescope.svg');
  }
`;

export default function Logo() {
  return (
    <Wrap>
      <Img src="/ddabong.svg" alt="Yoonsung Kim" />
    </Wrap>
  );
}
