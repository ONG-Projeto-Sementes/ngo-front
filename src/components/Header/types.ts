import type { ReactNode } from 'react';

export interface HeaderProps {
  title: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  actionTo?: string;
  children?: ReactNode;
}
