import type { SVGProps } from 'react';

type CinematicWingsProps = SVGProps<SVGSVGElement>;

export function CinematicWings({ className, ...rest }: CinematicWingsProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      {/* Left wing — three feather layers radiating leftward */}
      <g className="wing-left">
        <path
          d="M112 40 C82 18,42 22,8 40 C42 58,82 62,112 40Z"
          fill="currentColor"
          opacity="0.85"
        />
        <path
          d="M112 40 C87 26,56 29,30 40 C56 51,87 54,112 40Z"
          fill="currentColor"
          opacity="0.50"
        />
        <path
          d="M112 40 C92 32,70 34,52 40 C70 46,92 48,112 40Z"
          fill="currentColor"
          opacity="0.28"
        />
      </g>
      {/* Right wing — mirror of left */}
      <g className="wing-right">
        <path
          d="M128 40 C158 18,198 22,232 40 C198 58,158 62,128 40Z"
          fill="currentColor"
          opacity="0.85"
        />
        <path
          d="M128 40 C153 26,184 29,210 40 C184 51,153 54,128 40Z"
          fill="currentColor"
          opacity="0.50"
        />
        <path
          d="M128 40 C148 32,170 34,188 40 C170 46,148 48,128 40Z"
          fill="currentColor"
          opacity="0.28"
        />
      </g>
    </svg>
  );
}
