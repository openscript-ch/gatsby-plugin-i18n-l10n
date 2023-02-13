import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';

const mainStyle = () => css`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

type MainProps = PropsWithChildren<{}>;

export function Main({ children }: MainProps) {
  return <main css={mainStyle}>{children}</main>;
}
