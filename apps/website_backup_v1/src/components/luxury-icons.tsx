'use client';

import * as React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  accentColor?: string;
  filled?: boolean;
}

/**
 * CINMAX Bespoke Luxury Icon Set
 * Hand-crafted vector geometry with gold accents for CINMAX Global Botanical Products.
 */

export function LuxurySearchIcon({
  size = 24,
  color = 'currentColor',
  accentColor = '#C5A880',
  active = false,
  className,
  ...props
}: IconProps & { active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Search Lens Ring */}
      <circle
        cx="10.5"
        cy="10.5"
        r="6.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill={active ? `${accentColor}1A` : 'none'}
      />
      {/* Diagonal Handle */}
      <path
        d="M15.5 15.5L20.5 20.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Handle Base Accent Stud */}
      <circle cx="15.5" cy="15.5" r="1" fill={accentColor} />
      {/* Subtle Gold Sparkle Accent (Top-Right of Lens) */}
      <path
        d="M16 4.5C16 5.3 16.5 5.8 17.3 5.8C16.5 5.8 16 6.3 16 7.1C16 6.3 15.5 5.8 14.7 5.8C15.5 5.8 16 5.3 16 4.5Z"
        fill={accentColor}
      />
    </svg>
  );
}

export function LuxuryWishlistIcon({
  size = 24,
  color = 'currentColor',
  accentColor = '#C5A880',
  filled = false,
  active = false,
  className,
  ...props
}: IconProps & { active?: boolean }) {
  const isFilled = filled || active;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {isFilled ? (
        <>
          <defs>
            <linearGradient id="cinmax-heart-filled" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E11D48" />
              <stop offset="1" stopColor="#9F1239" />
            </linearGradient>
          </defs>
          {/* Filled Heart Body */}
          <path
            d="M12 21L10.55 19.68C5.4 15.01 2 11.93 2 8.3C2 5.35 4.3 3 7.25 3C8.88 3 10.45 3.75 11.5 4.95C12.55 3.75 14.12 3 15.75 3C18.7 3 21 5.35 21 8.3C21 11.93 17.6 15.01 12.45 19.69L12 21Z"
            fill="url(#cinmax-heart-filled)"
            stroke={accentColor}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Glare Highlight */}
          <path
            d="M6.5 6C5.5 7.2 5.2 8.8 5.6 10.2"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
          {/* Accent Gold Node */}
          <circle cx="16.5" cy="6.5" r="1" fill={accentColor} />
        </>
      ) : (
        <>
          {/* Heart Outline */}
          <path
            d="M12 20.8L10.55 19.48C5.4 14.8 2 11.72 2 8.1C2 5.15 4.3 2.8 7.25 2.8C8.88 2.8 10.45 3.55 11.5 4.75C12.55 3.55 14.12 2.8 15.75 2.8C18.7 2.8 21 5.15 21 8.1C21 11.72 17.6 14.8 12.45 19.49L12 20.8Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Gold Accent Dot at top-center notch */}
          <circle cx="12" cy="5.8" r="1" fill={accentColor} />
        </>
      )}
    </svg>
  );
}

export function LuxuryUserIcon({
  size = 24,
  color = 'currentColor',
  accentColor = '#C5A880',
  active = false,
  className,
  ...props
}: IconProps & { active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Head Circle */}
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke={color}
        strokeWidth="2"
        fill={active ? `${accentColor}25` : 'none'}
      />
      {/* Shoulder Arch */}
      <path
        d="M4 20C4 16.14 7.58 13.5 12 13.5C16.42 13.5 20 16.14 20 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Gold Necklace Accent Curve */}
      <path
        d="M9.5 15.5C10.3 16.3 11.1 16.7 12 16.7C12.9 16.7 13.7 16.3 14.5 15.5"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Gold Crown Gem above Head */}
      <circle cx="12" cy="2.5" r="0.9" fill={accentColor} />
    </svg>
  );
}

export function LuxuryBagIcon({
  size = 24,
  color = 'currentColor',
  accentColor = '#C5A880',
  active = false,
  className,
  ...props
}: IconProps & { active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Handle */}
      <path
        d="M8.5 8V5.8C8.5 3.87 10.07 2.3 12 2.3C13.93 2.3 15.5 3.87 15.5 5.8V8"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bag Body - Luxury Tapered Tote */}
      <path
        d="M4.5 8H19.5L20.6 20.2C20.7 21.2 19.9 22 18.9 22H5.1C4.1 22 3.3 21.2 3.4 20.2L4.5 8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        fill={active ? `${accentColor}20` : 'none'}
      />
      {/* Handle Base Studs */}
      <circle cx="8.5" cy="8" r="1.1" fill={accentColor} />
      <circle cx="15.5" cy="8" r="1.1" fill={accentColor} />
      {/* Atelier Central Gold Lock / Clasp */}
      <path
        d="M12 11V13.5"
        stroke={accentColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="13.5" r="1" fill={accentColor} />
    </svg>
  );
}

export function LuxuryMenuIcon({ size = 22, color = 'currentColor', accentColor = '#C5A880', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M3 6H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 12H15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="19" cy="12" r="1.5" fill={accentColor} />
      <path d="M3 18H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function LuxuryCloseIcon({ size = 22, color = 'currentColor', accentColor = '#C5A880', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M18 6L6 18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.5" fill={accentColor} />
    </svg>
  );
}

export function LuxuryStarIcon({ size = 18, color = '#F59E0B', accentColor = '#C5A880', filled = true, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12 2L14.917 8.263L21.756 9.106L16.716 13.797L18.034 20.564L12 17.15L5.966 20.564L7.284 13.797L2.244 9.106L9.083 8.263L12 2Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="1.2" fill={accentColor} />
    </svg>
  );
}

export function LuxuryArrowRightIcon({ size = 20, color = 'currentColor', accentColor = '#C5A880', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M4 12H19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 6L19 12L13 18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 12L16 9" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LuxurySparklesIcon({ size = 22, color = '#C5A880', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12 3C12 7.5 15.5 11 20 11C15.5 11 12 14.5 12 19C12 14.5 8.5 11 4 11C8.5 11 12 7.5 12 3Z"
        fill={color}
      />
      <path
        d="M5 3C5 5 3.5 6.5 1.5 6.5C3.5 6.5 5 8 5 10C5 8 6.5 6.5 8.5 6.5C6.5 6.5 5 5 5 3Z"
        fill={color}
        opacity="0.7"
      />
      <path
        d="M19 16C19 17.5 17.8 18.8 16.2 18.8C17.8 18.8 19 20 19 21.5C19 20 20.2 18.8 21.8 18.8C20.2 18.8 19 17.5 19 16Z"
        fill={color}
        opacity="0.8"
      />
    </svg>
  );
}

export function LuxuryTagIcon({ size = 20, color = 'currentColor', accentColor = '#C5A880', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.8" fill={accentColor} stroke={color} strokeWidth="1" />
      <path d="M12 12L16 16" stroke={accentColor} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function LuxuryLeafIcon({ size = 22, color = '#10B981', accentColor = '#C5A880', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M11 20A9 9 0 0 1 2 11C2 6.5 6.5 2 11 2C16 2 22 4 22 13C22 18 17.5 20 11 20Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M2 22L11 13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 13C13.5 10.5 17 9 19.5 8.5" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="16" cy="6" r="1" fill={accentColor} />
    </svg>
  );
}

export function LuxuryTruckIcon({ size = 22, color = 'currentColor', accentColor = '#C5A880', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect x="1" y="4" width="13" height="11" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M14 8H18L22 12V15H14V8Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="5.5" cy="17.5" r="2.5" stroke={color} strokeWidth="1.6" fill="#002754" />
      <circle cx="5.5" cy="17.5" r="0.8" fill={accentColor} />
      <circle cx="17.5" cy="17.5" r="2.5" stroke={color} strokeWidth="1.6" fill="#002754" />
      <circle cx="17.5" cy="17.5" r="0.8" fill={accentColor} />
      <path d="M3 8H9" stroke={accentColor} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function LuxuryGiftIcon({ size = 22, color = 'currentColor', accentColor = '#C5A880', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect x="3" y="10" width="18" height="11" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M2 7H22V10H2V7Z" stroke={color} strokeWidth="1.6" />
      <path d="M12 7V21" stroke={accentColor} strokeWidth="1.8" />
      <path d="M12 7C12 7 9.5 2 6.5 4C4.5 5.33 6.5 7 12 7Z" stroke={accentColor} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 7C12 7 14.5 2 17.5 4C19.5 5.33 17.5 7 12 7Z" stroke={accentColor} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function LuxuryPlayIcon({ size = 22, color = 'currentColor', accentColor = '#C5A880', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
      <circle cx="12" cy="12" r="10.5" stroke={accentColor} strokeWidth="0.8" strokeDasharray="2 3" />
      <path d="M10 8L16 12L10 16V8Z" fill={accentColor} stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function LuxuryShieldIcon({ size = 22, color = 'currentColor', accentColor = '#C5A880', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 12L11 14L15 9" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LuxuryTrashIcon({ size = 18, color = 'currentColor', accentColor = '#EF4444', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M3 6H21" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke={color} strokeWidth="1.6" />
      <path d="M19 6L18.1 19.35C18.04 20.27 17.27 21 16.35 21H7.65C6.73 21 5.96 20.27 5.9 19.35L5 6" stroke={color} strokeWidth="1.6" />
      <path d="M10 11V16" stroke={accentColor} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14 11V16" stroke={accentColor} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function LuxuryQuickIcon({ size = 20, color = '#F59E0B', accentColor = '#002754', className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill={color}
        stroke={accentColor}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1" fill="#FFFFFF" />
    </svg>
  );
}
