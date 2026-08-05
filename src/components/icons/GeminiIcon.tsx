import React, { useId } from 'react';

interface GeminiIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  colorful?: boolean;
}

export function GeminiIcon({ size = 24, className, colorful, ...props }: GeminiIconProps) {
  const uniqueId = useId().replace(/:/g, '');
  const clipId = `gemini-clip-${uniqueId}`;
  const blurId = `gemini-blur-${uniqueId}`;

  if (colorful) {
    return (
      <svg 
        width={size}
        height={size}
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <defs>
          <clipPath id={clipId}>
            <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/>
          </clipPath>
          <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="24" height="24" fill="#4285F4" />
          <circle cx="12" cy="0" r="12" fill="#EA4335" filter={`url(#${blurId})`} />
          <circle cx="12" cy="24" r="12" fill="#34A853" filter={`url(#${blurId})`} />
          <circle cx="0" cy="12" r="12" fill="#FBBC04" filter={`url(#${blurId})`} />
        </g>
      </svg>
    );
  }

  return (
    <svg 
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/>
    </svg>
  );
}
