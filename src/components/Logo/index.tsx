import styled, { keyframes } from 'styled-components';

const turnAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const shineAnimation = keyframes`
  0% {
    opacity: 0;
  }
  15% {
    opacity: 0.5;
  }
  55% {
    opacity: 0.75;
  }
  100% {
    opacity: 0.5;
  }
`;

const shine2Animation = keyframes`
  0% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  55% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const Wrap = styled.div`
  z-index: 9999;
  position: absolute;
  top: 1.5em;
  left: 1.5em;
  width: 5em;
  height: 5em;
  scale: 1;
  cursor: pointer;
  isolation: isolate;
  transition: transform 0.5s ease;
  transform-origin: top left;
  &:hover {
    transform: scale(2);
    transform-origin: top left;
  }
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  position: absolute;
  &:hover {
    content: url('/telescope.svg');
  }
`;

const Shine = styled.span`
  position: absolute;
  inset: -3em;
  border-radius: 50%;
  mask-image: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 10%,
    black 36%,
    black 45%,
    transparent 50%,
    transparent 60%,
    black 85%,
    black 95%,
    transparent 100%
  );
  mask-size: cover;
  mix-blend-mode: plus-lighter;
  animation: ${turnAnimation} 1.8s linear infinite both;
  transition: all 1.33s
    linear(
      0,
      0.002,
      0.01 0.9%,
      0.038 1.8%,
      0.156,
      0.312 5.8%,
      0.789 11.1%,
      1.015 14.2%,
      1.096,
      1.157,
      1.199,
      1.224 20.3%,
      1.231,
      1.231,
      1.226,
      1.214 24.6%,
      1.176 26.9%,
      1.057 32.6%,
      1.007 35.5%,
      0.984,
      0.968,
      0.956,
      0.949 42%,
      0.946 44.1%,
      0.95 46.5%,
      0.998 57.2%,
      1.007,
      1.011 63.3%,
      1.012 68.3%,
      0.998 84%,
      1
    );
  &::before,
  &::after {
    opacity: 0.5;
    animation: ${shineAnimation} 2s ease-in infinite forwards;
  }
  ${Wrap}:hover &::before,
  ${Wrap}:hover &::after {
    opacity: 1;
    animation: ${shine2Animation} 1.2s ease-in infinite forwards;
  }
  &::before,
  &::after {
    transition: all 0.5s ease;
    opacity: 0;
    content: '';
    border-radius: inherit;
    position: absolute;
    mix-blend-mode: color;
    inset: 4em;
  }
  &::before {
    box-shadow:
      0 0 3px 2px hsl(222 20% 95%),
      0 0 7px 4px hsl(222 20% 80%),
      0 0 13px 4px hsl(222 50% 70%),
      0 0 25px 5px hsl(222 100% 70%);
    z-index: -1;
  }
  &::after {
    box-shadow:
      inset 0 0 0 1px hsl(222 70% 95%),
      inset 0 0 2px 1px hsl(222 100% 80%),
      inset 0 0 5px 2px hsl(222 100% 70%);
    z-index: 2;
  }
`;

export default function Logo() {
  const moveRepo = () => {
    const repo = window.open(
      'https://github.com/nickkies/elegance-globe',
      '_blank',
    );
    if (repo) repo.opener = null;
  };

  return (
    <Wrap onClick={moveRepo}>
      <Shine />
      <Img src="/ddabong.svg" alt="Yoonsung Kim" />
    </Wrap>
  );
}
