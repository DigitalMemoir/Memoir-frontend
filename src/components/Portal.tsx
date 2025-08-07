import type React from 'react';
import { createPortal } from 'react-dom';

export default function Portal({ children }: { children: React.ReactNode }) {
  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;
  return createPortal(children, portalRoot);
}
