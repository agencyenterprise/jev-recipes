import type { ReactNode } from 'react';
import './style.css';

export const metadata = {
  title: 'Support routing · Jev recipes',
  description: 'Follow a support request through a typed decision and an explicit review policy.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
