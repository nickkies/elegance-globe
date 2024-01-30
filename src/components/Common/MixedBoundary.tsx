import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Loading, Error } from '.';

interface Props {
  children: React.ReactNode;
  css?: React.CSSProperties;
  errFallback?: React.ReactElement<React.FunctionComponent>;
  susFallback?: React.ReactNode;
  resetKeys?: Array<unknown>;
}

export default function MixedBoundary({
  children,
  css,
  errFallback,
  susFallback,
  resetKeys,
}: Props) {
  return (
    <ErrorBoundary
      fallback={errFallback || <Error css={css} />}
      resetKeys={resetKeys}
    >
      <Suspense fallback={susFallback || <Loading css={css} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
