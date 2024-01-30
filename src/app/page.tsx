'use client';

import dynamic from 'next/dynamic';
import styled from 'styled-components';

import MixedBoundary from '@/components/Common/MixedBoundary';

const MyMap = dynamic(() => import('@/components/MyMap/MyMap'), { ssr: false });

const Wrap = styled.div`
  height: 100vh;
  width: 100vw;
`;

export default function Home() {
  return (
    <Wrap>
      <MixedBoundary>
        <MyMap />
      </MixedBoundary>
    </Wrap>
  );
}
