import styled from 'styled-components';

import boundaryWrap from '@/style/boundary';

const ErrorBox = styled(boundaryWrap)`
  float: left;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  margin-bottom: 8px;
`;

const ErrorDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
`;

const Ebox = styled.div`
  font-weight: bold;
  font-size: 2em;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export default function Error({
  css,
}: {
  css: React.CSSProperties | undefined;
}) {
  return (
    <ErrorBox style={css}>
      <ErrorDiv>
        <Ebox>
          <div>
            오류<span> Error</span>
          </div>
        </Ebox>
      </ErrorDiv>
    </ErrorBox>
  );
}
