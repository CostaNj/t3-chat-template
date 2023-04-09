import React from 'react';

import { Container } from './styles/layout.styles';

type LayoutProps = {
  children: React.ReactElement;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <Container>{children}</Container>;
};
