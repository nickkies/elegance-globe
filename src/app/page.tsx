'use client';

import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { RecoilRoot } from 'recoil';

import MixedBoundary from '@/components/Common/MixedBoundary';

const MyMap = dynamic(() => import('@/components/MyMap'), { ssr: false });
const Controls = dynamic(() => import('@/components/Controls'), {
  ssr: false,
});
const Logo = dynamic(() => import('@/components/Logo'), { ssr: false });

const Wrap = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
`;

export default function Home() {
  return (
    <RecoilRoot>
      <Wrap>
        <Logo />
        <MixedBoundary>
          <MyMap />
        </MixedBoundary>
        <Controls />
      </Wrap>
    </RecoilRoot>
  );
}
