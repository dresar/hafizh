'use client';

import React from 'react';
import { VIcon } from '@/components/ui/v-icon';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  href?: string;
  target?: string;
  rel?: string;
}

export function ShimmerButton({
  children,
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.35)',
  shimmerSize = '0.08em',
  borderRadius = '8px',
  shimmerDuration = '3s',
  background = 'rgba(15, 23, 42, 0.95)',
  icon,
  iconPosition = 'left',
  href,
  target,
  rel,
  ...props
}: ShimmerButtonProps) {
  const content = (
    <div
      style={
        {
          '--spread': '90deg',
          '--shimmer-color': shimmerColor,
          '--radius': borderRadius,
          '--speed': shimmerDuration,
          '--cut': shimmerSize,
          '--bg': background,
        } as React.CSSProperties
      }
      className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-slate-700/80 px-5 py-2.5 text-xs font-semibold text-slate-100 transition-all duration-300 active:scale-[0.98] hover:border-slate-500 hover:shadow-lg hover:shadow-black/40 ${className}`}
    >
      <div className="absolute inset-0 overflow-visible [container-type:size]">
        <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
          <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
        </div>
      </div>
      <div className="absolute inset-[1px] -z-10 rounded-[inherit] bg-slate-900/90 transition-colors duration-300 group-hover:bg-slate-800/90 backdrop-blur-md" />
      <span className="relative z-10 flex items-center gap-2">
        {icon && iconPosition === 'left' && <VIcon name={icon} className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors" />}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <VIcon name={icon} className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors" />}
      </span>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className="inline-block no-underline">
        {content}
      </a>
    );
  }

  return (
    <button type="button" {...props}>
      {content}
    </button>
  );
}
