'use client';

import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { RecoilRoot } from 'recoil';

import MixedBoundary from '@/components/Common/MixedBoundary';

const MyMap = dynamic(() => import('@/components/MyMap'), { ssr: false });
const Slider = dynamic(() => import('@/components/Slider'), { ssr: false });

const Wrap = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
`;

export default function Home() {
  return (
    <RecoilRoot>
      <Wrap>
        <MixedBoundary>
          <MyMap />
        </MixedBoundary>
        <Slider />
      </Wrap>
    </RecoilRoot>
  );
}
