/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface GehmitFullLogoProps {
  className?: string;
  height?: number | string;
  color?: string; // Default to Gehmit Green (#0E6441)
}

export default function GehmitFullLogo({ className = '', height = 120 }: GehmitFullLogoProps) {
  const style = height !== undefined ? { height } : undefined;
  return (
    <img 
      src="/logo_gehmit.png" 
      alt="Gehmit Full Logo" 
      className={`object-contain w-auto ${className}`}
      style={style}
      referrerPolicy="no-referrer"
    />
  );
}
