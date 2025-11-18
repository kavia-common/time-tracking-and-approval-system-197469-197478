import React from 'react';

// PUBLIC_INTERFACE
export default function Container({ children }) {
  /** Standard padded container with surface styling. */
  return <div className="container">{children}</div>;
}
