/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface GehmitLogoProps {
  className?: string;
  size?: number | string;
  color?: string; // Default to Gehmit Green (#008037)
}

export default function GehmitLogo({ className = '', size }: GehmitLogoProps) {
  const style = size !== undefined ? { width: size, height: size } : undefined;
  return (
    <img 
      src="/logo_techpath.png" 
      alt="Gehmit TechPath Logo" 
      className={`object-contain ${className}`}
      style={style}
      referrerPolicy="no-referrer"
    />
  );
}
