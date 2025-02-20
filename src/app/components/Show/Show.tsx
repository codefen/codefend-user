import type { FC, ReactNode } from 'react';

interface ShowProps {
  when: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

const Show: FC<ShowProps> = ({ when, fallback = null, children }) => (when ? children : fallback);

export default Show;
