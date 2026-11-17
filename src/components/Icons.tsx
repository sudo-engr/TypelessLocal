/* Factory-created SVG components; each export is a React forwardRef component. */
/* eslint-disable react-refresh/only-export-components */
// Adapted from Kubai Icons (MIT). See src/assets/kubai/LICENSE.
import { forwardRef, type ReactNode } from 'react'
import type { LucideIcon, LucideProps } from 'lucide-react'

function icon(name: string, shapes: ReactNode): LucideIcon {
  const Icon = forwardRef<SVGSVGElement, LucideProps>(
    (
      {
        size = 24,
        color = 'currentColor',
        strokeWidth: _strokeWidth,
        absoluteStrokeWidth: _absoluteStrokeWidth,
        ...props
      },
      ref,
    ) => (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -3 31 31"
        width={size}
        height={size}
        fill="none"
        color={color}
        aria-hidden="true"
        {...props}
      >
        {shapes}
      </svg>
    ),
  )
  Icon.displayName = `Kubai${name}`
  return Icon
}

export const AlertCircle = icon(
  'AlertCircle',
  <>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-circle-alert-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g transform="rotate(0 15.5 19.4)">
      <path
        d="M15.5 6.6V13.4"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="var(--color-bg-primary)"
      />
      <circle cx="15.5" cy="17.8" r="1.6" fill="var(--color-bg-primary)" />
    </g>
  </>,
)
export const AppWindow = icon(
  'AppWindow',
  <>
    <path
      d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 19.5Q27 21.7 24.8 21.7L6.2 21.7Q4 21.7 4 19.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 19.5Q27 21.7 24.8 21.7L6.2 21.7Q4 21.7 4 19.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 19.5Q27 21.7 24.8 21.7L6.2 21.7Q4 21.7 4 19.5Z"
      mask="url(#ol-ki-app-window-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M6 12.1Q6 10.9 7.2 10.9L23.8 10.9Q25 10.9 25 12.1L25 18.5Q25 19.7 23.8 19.7L7.2 19.7Q6 19.7 6 18.5Z"
      fill="var(--color-bg-primary)"
    />
    <clipPath>
      <path d="M6 12.1Q6 10.9 7.2 10.9L23.8 10.9Q25 10.9 25 12.1L25 18.5Q25 19.7 23.8 19.7L7.2 19.7Q6 19.7 6 18.5Z" />
    </clipPath>
    <g clipPath="url(#pg-ki-app-window)">
      <path
        d="M8.6 13.4H20.2M8.6 16.8H16M8.6 20.6H18.4"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        stroke="currentColor"
      />
    </g>
    <g>
      <path
        d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 7.9Q27 7.9 27 7.9L4 7.9Q4 7.9 4 7.9Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 7.9Q27 7.9 27 7.9L4 7.9Q4 7.9 4 7.9Z"
      fill="none"
    />
    <circle cx="7.2" cy="5.6" r="1.2" fill="currentColor" />
    <circle cx="10.6" cy="5.6" r="1.2" fill="currentColor" />
    <circle cx="14" cy="5.6" r="1.2" fill="currentColor" />
  </>,
)
export const ArrowDown = icon(
  'ArrowDown',
  <>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-arrow-down-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g>
      <path
        d="M7.1 12.5A8.4 8.4 0 1 0 23.9 12.5A8.4 8.4 0 1 0 7.1 12.5Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path d="M7.1 12.5A8.4 8.4 0 1 0 23.9 12.5A8.4 8.4 0 1 0 7.1 12.5Z" fill="none" />
    <g transform="translate(15.5 12.5) rotate(90)">
      <path
        d="M-5.6 0L2.1 0"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M1.5 2.6Q1.5 3.1 1.887 2.784L4.835 0.379Q5.3 0 4.835 -0.379L1.887 -2.784Q1.5 -3.1 1.5 -2.6Z"
        fill="currentColor"
      />
    </g>
  </>,
)
export const ArrowRight = icon(
  'ArrowRight',
  <>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-arrow-right-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g>
      <path
        d="M7.1 12.5A8.4 8.4 0 1 0 23.9 12.5A8.4 8.4 0 1 0 7.1 12.5Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path d="M7.1 12.5A8.4 8.4 0 1 0 23.9 12.5A8.4 8.4 0 1 0 7.1 12.5Z" fill="none" />
    <g transform="translate(15.5 12.5) rotate(0)">
      <path
        d="M-5.6 0L2.1 0"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M1.5 2.6Q1.5 3.1 1.887 2.784L4.835 0.379Q5.3 0 4.835 -0.379L1.887 -2.784Q1.5 -3.1 1.5 -2.6Z"
        fill="currentColor"
      />
    </g>
  </>,
)
export const ArrowUp = icon(
  'ArrowUp',
  <>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-arrow-up-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g>
      <path
        d="M7.1 12.5A8.4 8.4 0 1 0 23.9 12.5A8.4 8.4 0 1 0 7.1 12.5Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path d="M7.1 12.5A8.4 8.4 0 1 0 23.9 12.5A8.4 8.4 0 1 0 7.1 12.5Z" fill="none" />
    <g transform="translate(15.5 12.5) rotate(-90)">
      <path
        d="M-5.6 0L2.1 0"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M1.5 2.6Q1.5 3.1 1.887 2.784L4.835 0.379Q5.3 0 4.835 -0.379L1.887 -2.784Q1.5 -3.1 1.5 -2.6Z"
        fill="currentColor"
      />
    </g>
  </>,
)
export const BookOpen = icon(
  'BookOpen',
  <>
    <path
      d="M4 5.8Q4 3.6 6.2 3.6L24.8 3.6Q27 3.6 27 5.8L27 19Q27 21.2 24.821 21.503L16.689 22.635Q15.5 22.8 14.311 22.635L6.179 21.503Q4 21.2 4 19Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 5.8Q4 3.6 6.2 3.6L24.8 3.6Q27 3.6 27 5.8L27 19Q27 21.2 24.821 21.503L16.689 22.635Q15.5 22.8 14.311 22.635L6.179 21.503Q4 21.2 4 19Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 5.8Q4 3.6 6.2 3.6L24.8 3.6Q27 3.6 27 5.8L27 19Q27 21.2 24.821 21.503L16.689 22.635Q15.5 22.8 14.311 22.635L6.179 21.503Q4 21.2 4 19Z"
      mask="url(#ol-ki-book-open-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M15.5 7C12.8 5.6 9.4 5.2 6.2 5.6V19.2C9.4 18.8 12.8 19.4 15.5 20.6Z"
      fill="var(--color-bg-primary)"
    />
    <path
      d="M13.2 10.6H8M13.2 13.6H9.6"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      stroke="currentColor"
    />
    <path
      d="M15.5 7C18.2 5.6 21.6 5.2 24.8 5.6V19.2C21.6 18.8 18.2 19.4 15.5 20.6Z"
      fill="var(--color-bg-primary)"
    />
    <path
      d="M17.8 10.6H23M17.8 13.6H21.4"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      stroke="currentColor"
    />
    <g transform="translate(15.5 0) scale(1 1) translate(-15.5 0)">
      <path
        d="M15.5 7C18.2 5.6 21.6 5.2 24.8 5.6V19.2C21.6 18.8 18.2 19.4 15.5 20.6Z"
        fill="var(--color-bg-primary)"
      />
      <path
        d="M17.8 10.6H23M17.8 13.6H21.4"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        stroke="currentColor"
      />
      <path
        d="M15.5 7C18.2 5.6 21.6 5.2 24.8 5.6V19.2C21.6 18.8 18.2 19.4 15.5 20.6Z"
        opacity="0"
        fill="currentColor"
      />
    </g>
  </>,
)
export const Bot = icon(
  'Bot',
  <>
    <path
      d="M2.8 12.8Q2.8 11.6 4 11.6L5.2 11.6Q6.4 11.6 6.4 12.8L6.4 16.8Q6.4 18 5.2 18L4 18Q2.8 18 2.8 16.8Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M2.8 12.8Q2.8 11.6 4 11.6L5.2 11.6Q6.4 11.6 6.4 12.8L6.4 16.8Q6.4 18 5.2 18L4 18Q2.8 18 2.8 16.8Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M2.8 12.8Q2.8 11.6 4 11.6L5.2 11.6Q6.4 11.6 6.4 12.8L6.4 16.8Q6.4 18 5.2 18L4 18Q2.8 18 2.8 16.8Z"
      mask="url(#ol-ki-bot-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M24.6 12.8Q24.6 11.6 25.8 11.6L27 11.6Q28.2 11.6 28.2 12.8L28.2 16.8Q28.2 18 27 18L25.8 18Q24.6 18 24.6 16.8Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M24.6 12.8Q24.6 11.6 25.8 11.6L27 11.6Q28.2 11.6 28.2 12.8L28.2 16.8Q28.2 18 27 18L25.8 18Q24.6 18 24.6 16.8Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M24.6 12.8Q24.6 11.6 25.8 11.6L27 11.6Q28.2 11.6 28.2 12.8L28.2 16.8Q28.2 18 27 18L25.8 18Q24.6 18 24.6 16.8Z"
      mask="url(#ol-ki-bot-1)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g transform="rotate(0 15.5 7.4)">
      <path
        d="M15.5 7.4V4.4"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        stroke="currentColor"
      />
      <circle cx="15.5" cy="3" r="1.8" fill="currentColor" />
    </g>
    <path
      d="M5.2 11Q5.2 7 9.2 7L21.8 7Q25.8 7 25.8 11L25.8 18.6Q25.8 22.6 21.8 22.6L9.2 22.6Q5.2 22.6 5.2 18.6Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M5.2 11Q5.2 7 9.2 7L21.8 7Q25.8 7 25.8 11L25.8 18.6Q25.8 22.6 21.8 22.6L9.2 22.6Q5.2 22.6 5.2 18.6Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M5.2 11Q5.2 7 9.2 7L21.8 7Q25.8 7 25.8 11L25.8 18.6Q25.8 22.6 21.8 22.6L9.2 22.6Q5.2 22.6 5.2 18.6Z"
      mask="url(#ol-ki-bot-2)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M8.2 12.6Q8.2 10 10.8 10L20.2 10Q22.8 10 22.8 12.6L22.8 17Q22.8 19.6 20.2 19.6L10.8 19.6Q8.2 19.6 8.2 17Z"
      fill="var(--color-bg-primary)"
    />
    <path
      d="M10.8 14.3Q10.8 12.9 12.2 12.9L12.2 12.9Q13.6 12.9 13.6 14.3L13.6 15.3Q13.6 16.7 12.2 16.7L12.2 16.7Q10.8 16.7 10.8 15.3ZM17.4 14.3Q17.4 12.9 18.8 12.9L18.8 12.9Q20.2 12.9 20.2 14.3L20.2 15.3Q20.2 16.7 18.8 16.7L18.8 16.7Q17.4 16.7 17.4 15.3Z"
      fill="currentColor"
    />
  </>,
)
export const CheckCircle2 = icon(
  'CheckCircle2',
  <>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-circle-check-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="var(--color-bg-primary)"
      d="M10.4 12.9L14 16.4L20.6 9.4"
    />
  </>,
)
export const ChevronDown = icon(
  'ChevronDown',
  <>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-chevron-down-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g>
      <path
        d="M7.1 12.5A8.4 8.4 0 1 0 23.9 12.5A8.4 8.4 0 1 0 7.1 12.5Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path d="M7.1 12.5A8.4 8.4 0 1 0 23.9 12.5A8.4 8.4 0 1 0 7.1 12.5Z" fill="none" />
    <path
      d="M-2 -5.4L2.4 0L-2 5.4"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(15.5 12.5) rotate(90)"
      stroke="currentColor"
    />
  </>,
)
export const CircleUser = icon(
  'CircleUser',
  <>
    <clipPath>
      <path d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z" />
    </clipPath>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <g clipPath="url(#av-ki-user)">
      <path
        d="M5 27Q5 27 5 27L5 22Q5 22 5 22L7.7 19.7Q10.4 17.4 14.4 17.4L16.6 17.4Q20.6 17.4 23.3 19.7L26 22Q26 22 26 22L26 27Q26 27 26 27Z"
        fill="var(--color-bg-primary)"
        transform="translate(0 0)"
      />
    </g>
    <circle cx="15.5" cy="10.4" r="4.4" fill="var(--color-bg-primary)" />
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-user-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
  </>,
)
export const ClipboardCheck = icon(
  'ClipboardCheck',
  <>
    <path
      d="M6.3 4.8Q6.3 2.6 8.5 2.6L22.5 2.6Q24.7 2.6 24.7 4.8L24.7 21.6Q24.7 23.8 22.5 23.8L8.5 23.8Q6.3 23.8 6.3 21.6Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M6.3 4.8Q6.3 2.6 8.5 2.6L22.5 2.6Q24.7 2.6 24.7 4.8L24.7 21.6Q24.7 23.8 22.5 23.8L8.5 23.8Q6.3 23.8 6.3 21.6Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M6.3 4.8Q6.3 2.6 8.5 2.6L22.5 2.6Q24.7 2.6 24.7 4.8L24.7 21.6Q24.7 23.8 22.5 23.8L8.5 23.8Q6.3 23.8 6.3 21.6Z"
      mask="url(#ol-ki-clipboard-check-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M8.6 7.8Q8.6 6.6 9.8 6.6L21.2 6.6Q22.4 6.6 22.4 7.8L22.4 20.4Q22.4 21.6 21.2 21.6L9.8 21.6Q8.6 21.6 8.6 20.4Z"
      fill="var(--color-bg-primary)"
    />
    <path
      d="M11 10.2H20"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      stroke="currentColor"
    />
    <path
      d="M12.2 16.2L14.6 18.6L19 14"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="9.8"
      strokeDashoffset="9.8"
      stroke="currentColor"
    />
    <path
      d="M11 2.4Q11 0.8 12.6 0.8L18.4 0.8Q20 0.8 20 2.4L20 4.2Q20 5.4 18.8 5.4L12.2 5.4Q11 5.4 11 4.2Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <path
        d="M11 2.4Q11 0.8 12.6 0.8L18.4 0.8Q20 0.8 20 2.4L20 4.2Q20 5.4 18.8 5.4L12.2 5.4Q11 5.4 11 4.2Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M11 2.4Q11 0.8 12.6 0.8L18.4 0.8Q20 0.8 20 2.4L20 4.2Q20 5.4 18.8 5.4L12.2 5.4Q11 5.4 11 4.2Z"
      mask="url(#ol-ki-clipboard-check-1)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
  </>,
)
export const Cloud = icon(
  'Cloud',
  <>
    <path
      d="M9 21.7A5.7 5.7 0 0 1 8.816 10.303A7.5 7.5 0 1 1 23.771 11.458A5.2 5.2 0 0 1 22.5 21.7Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          fillOpacity={0.22}
          fill="currentColor"
          d="M9 21.7A5.7 5.7 0 0 1 8.816 10.303A7.5 7.5 0 1 1 23.771 11.458A5.2 5.2 0 0 1 22.5 21.7Z"
        />
      </g>
    </g>
    <path
      d="M9 21.7A5.7 5.7 0 0 1 8.816 10.303A7.5 7.5 0 1 1 23.771 11.458A5.2 5.2 0 0 1 22.5 21.7Z"
      mask="url(#ol-ki-cloud-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M6.035 18.8Q4.035 18.8 5.3 20.336A5.7 5.7 0 0 0 9 21.7L22.5 21.7A5.2 5.2 0 0 0 25.96 20.382Q27.164 18.8 25.164 18.8Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <path
        fillOpacity={0.22}
        fill="currentColor"
        d="M6.035 18.8Q4.035 18.8 5.3 20.336A5.7 5.7 0 0 0 9 21.7L22.5 21.7A5.2 5.2 0 0 0 25.96 20.382Q27.164 18.8 25.164 18.8Z"
      />
    </g>
    <path
      d="M6.035 18.8Q4.035 18.8 5.3 20.336A5.7 5.7 0 0 0 9 21.7L22.5 21.7A5.2 5.2 0 0 0 25.96 20.382Q27.164 18.8 25.164 18.8Z"
      mask="url(#ol-ki-cloud-1)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
  </>,
)
export const Code2 = icon(
  'Code2',
  <>
    <path
      d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 19.5Q27 21.7 24.8 21.7L6.2 21.7Q4 21.7 4 19.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 19.5Q27 21.7 24.8 21.7L6.2 21.7Q4 21.7 4 19.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 19.5Q27 21.7 24.8 21.7L6.2 21.7Q4 21.7 4 19.5Z"
      mask="url(#ol-ki-code-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M6 11.1Q6 9.9 7.2 9.9L23.8 9.9Q25 9.9 25 11.1L25 18.5Q25 19.7 23.8 19.7L7.2 19.7Q6 19.7 6 18.5Z"
      fill="var(--color-bg-primary)"
    />
    <path
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.2 12.2L9.5 14.8L12.2 17.4M18.8 12.2L21.5 14.8L18.8 17.4"
      stroke="currentColor"
    />
    <path
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      d="M16.6 12.1L14.4 17.5"
      stroke="currentColor"
    />
    <g>
      <path
        d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 7.9Q27 7.9 27 7.9L4 7.9Q4 7.9 4 7.9Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 7.9Q27 7.9 27 7.9L4 7.9Q4 7.9 4 7.9Z"
      fill="none"
    />
  </>,
)
export const Copy = icon(
  'Copy',
  <>
    <g transform="translate(5.2 2.2)">
      <path
        d="M0 2.2Q0 0 2.2 0L11.4 0Q13.6 0 13.6 2.2L13.6 13.4Q13.6 15.6 11.4 15.6L2.2 15.6Q0 15.6 0 13.4Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M0 2.2Q0 0 2.2 0L11.4 0Q13.6 0 13.6 2.2L13.6 13.4Q13.6 15.6 11.4 15.6L2.2 15.6Q0 15.6 0 13.4Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M0 2.2Q0 0 2.2 0L11.4 0Q13.6 0 13.6 2.2L13.6 13.4Q13.6 15.6 11.4 15.6L2.2 15.6Q0 15.6 0 13.4Z"
        mask="url(#ol-ki-copy-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
    <g transform="translate(12.2 7.2)">
      <path
        d="M0 2.2Q0 0 2.2 0L11.4 0Q13.6 0 13.6 2.2L13.6 13.4Q13.6 15.6 11.4 15.6L2.2 15.6Q0 15.6 0 13.4Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M0 2.2Q0 0 2.2 0L11.4 0Q13.6 0 13.6 2.2L13.6 13.4Q13.6 15.6 11.4 15.6L2.2 15.6Q0 15.6 0 13.4Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M0 2.2Q0 0 2.2 0L11.4 0Q13.6 0 13.6 2.2L13.6 13.4Q13.6 15.6 11.4 15.6L2.2 15.6Q0 15.6 0 13.4Z"
        mask="url(#ol-ki-copy-1)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <path
        d="M2.6 4.2H11M2.6 7.2H8.2"
        strokeOpacity=".55"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        stroke="currentColor"
      />
    </g>
  </>,
)
export const CreditCard = icon(
  'CreditCard',
  <>
    <g transform="translate(6.6 3.3) rotate(0 10.2 6.7)">
      <path
        d="M0 2.2Q0 0 2.2 0L18.2 0Q20.4 0 20.4 2.2L20.4 11.2Q20.4 13.4 18.2 13.4L2.2 13.4Q0 13.4 0 11.2Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M0 2.2Q0 0 2.2 0L18.2 0Q20.4 0 20.4 2.2L20.4 11.2Q20.4 13.4 18.2 13.4L2.2 13.4Q0 13.4 0 11.2Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M0 2.2Q0 0 2.2 0L18.2 0Q20.4 0 20.4 2.2L20.4 11.2Q20.4 13.4 18.2 13.4L2.2 13.4Q0 13.4 0 11.2Z"
        mask="url(#ol-ki-credit-card-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
    <g transform="translate(4 8.3) rotate(0 10.2 6.7)">
      <path
        d="M0 2.2Q0 0 2.2 0L18.2 0Q20.4 0 20.4 2.2L20.4 11.2Q20.4 13.4 18.2 13.4L2.2 13.4Q0 13.4 0 11.2Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M0 2.2Q0 0 2.2 0L18.2 0Q20.4 0 20.4 2.2L20.4 11.2Q20.4 13.4 18.2 13.4L2.2 13.4Q0 13.4 0 11.2Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M0 2.2Q0 0 2.2 0L18.2 0Q20.4 0 20.4 2.2L20.4 11.2Q20.4 13.4 18.2 13.4L2.2 13.4Q0 13.4 0 11.2Z"
        mask="url(#ol-ki-credit-card-1)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <path
        d="M2.8 4.6Q2.8 3.6 3.8 3.6L6.4 3.6Q7.4 3.6 7.4 4.6L7.4 6.2Q7.4 7.2 6.4 7.2L3.8 7.2Q2.8 7.2 2.8 6.2Z"
        fill="var(--color-bg-primary)"
      />
      <path
        d="M2.8 10H10.2"
        stroke="var(--color-bg-primary)"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  </>,
)
export const Crown = icon(
  'Crown',
  <>
    <g transform="translate(0 0) rotate(0 15.5 20)">
      <path
        d="M4.559 7.987Q4.4 7 5.143 7.669L9.508 11.597Q10.4 12.4 11.045 11.388L14.962 5.243Q15.5 4.4 16.038 5.243L19.955 11.388Q20.6 12.4 21.492 11.597L25.857 7.669Q26.6 7 26.441 7.987L24.791 18.215Q24.6 19.4 23.4 19.4L7.6 19.4Q6.4 19.4 6.209 18.215Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M4.559 7.987Q4.4 7 5.143 7.669L9.508 11.597Q10.4 12.4 11.045 11.388L14.962 5.243Q15.5 4.4 16.038 5.243L19.955 11.388Q20.6 12.4 21.492 11.597L25.857 7.669Q26.6 7 26.441 7.987L24.791 18.215Q24.6 19.4 23.4 19.4L7.6 19.4Q6.4 19.4 6.209 18.215Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M4.559 7.987Q4.4 7 5.143 7.669L9.508 11.597Q10.4 12.4 11.045 11.388L14.962 5.243Q15.5 4.4 16.038 5.243L19.955 11.388Q20.6 12.4 21.492 11.597L25.857 7.669Q26.6 7 26.441 7.987L24.791 18.215Q24.6 19.4 23.4 19.4L7.6 19.4Q6.4 19.4 6.209 18.215Z"
        mask="url(#ol-ki-crown-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <path
        d="M2.4 6A2 2 0 1 0 6.4 6A2 2 0 1 0 2.4 6ZM13.5 3.4A2 2 0 1 0 17.5 3.4A2 2 0 1 0 13.5 3.4ZM24.6 6A2 2 0 1 0 28.6 6A2 2 0 1 0 24.6 6Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <path
          d="M2.4 6A2 2 0 1 0 6.4 6A2 2 0 1 0 2.4 6ZM13.5 3.4A2 2 0 1 0 17.5 3.4A2 2 0 1 0 13.5 3.4ZM24.6 6A2 2 0 1 0 28.6 6A2 2 0 1 0 24.6 6Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
      <path
        d="M2.4 6A2 2 0 1 0 6.4 6A2 2 0 1 0 2.4 6ZM13.5 3.4A2 2 0 1 0 17.5 3.4A2 2 0 1 0 13.5 3.4ZM24.6 6A2 2 0 1 0 28.6 6A2 2 0 1 0 24.6 6Z"
        mask="url(#ol-ki-crown-1)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <path
        d="M5.8 18Q5.8 16.4 7.4 16.4L23.6 16.4Q25.2 16.4 25.2 18L25.2 20.8Q25.2 22.8 23.2 22.8L7.8 22.8Q5.8 22.8 5.8 20.8Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <path
          d="M5.8 18Q5.8 16.4 7.4 16.4L23.6 16.4Q25.2 16.4 25.2 18L25.2 20.8Q25.2 22.8 23.2 22.8L7.8 22.8Q5.8 22.8 5.8 20.8Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
      <path
        d="M5.8 18Q5.8 16.4 7.4 16.4L23.6 16.4Q25.2 16.4 25.2 18L25.2 20.8Q25.2 22.8 23.2 22.8L7.8 22.8Q5.8 22.8 5.8 20.8Z"
        mask="url(#ol-ki-crown-2)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
  </>,
)
export const Download = icon(
  'Download',
  <>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-download-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      fill="none"
      stroke="var(--color-bg-primary)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.5 3V12.4M11.9 8.8L15.5 12.4L19.1 8.8"
    />
    <g>
      <path
        fillOpacity={0.22}
        fill="currentColor"
        d="M6.426 15.6Q4.426 15.6 5.129 17.47A11.5 11.5 0 0 0 15.5 24L15.5 24A11.5 11.5 0 0 0 25.871 17.47Q26.574 15.6 24.574 15.6Z"
      />
    </g>
    <path
      d="M6.426 15.6Q4.426 15.6 5.129 17.47A11.5 11.5 0 0 0 15.5 24L15.5 24A11.5 11.5 0 0 0 25.871 17.47Q26.574 15.6 24.574 15.6Z"
      fill="none"
    />
  </>,
)
export const ExternalLink = icon(
  'ExternalLink',
  <>
    <path
      d="M4 7.8Q4 5.6 6.2 5.6L20.2 5.6Q22.4 5.6 22.4 7.8L22.4 21.8Q22.4 24 20.2 24L6.2 24Q4 24 4 21.8Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 7.8Q4 5.6 6.2 5.6L20.2 5.6Q22.4 5.6 22.4 7.8L22.4 21.8Q22.4 24 20.2 24L6.2 24Q4 24 4 21.8Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 7.8Q4 5.6 6.2 5.6L20.2 5.6Q22.4 5.6 22.4 7.8L22.4 21.8Q22.4 24 20.2 24L6.2 24Q4 24 4 21.8Z"
      mask="url(#ol-ki-external-link-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g>
      <path
        d="M7 10.2Q7 8.6 8.6 8.6L17.8 8.6Q19.4 8.6 19.4 10.2L19.4 19.4Q19.4 21 17.8 21L8.6 21Q7 21 7 19.4Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M7 10.2Q7 8.6 8.6 8.6L17.8 8.6Q19.4 8.6 19.4 10.2L19.4 19.4Q19.4 21 17.8 21L8.6 21Q7 21 7 19.4Z"
      fill="none"
    />
    <g transform="translate(0 0)">
      <path
        d="M12.8 14.8L24.137 3.463"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        stroke="currentColor"
      />
      <path
        d="M25.551 5.725Q25.905 6.079 25.955 5.582L26.339 1.797Q26.4 1.2 25.803 1.261L22.018 1.645Q21.521 1.695 21.875 2.049Z"
        fill="currentColor"
      />
    </g>
  </>,
)
export const Eye = icon(
  'Eye',
  <>
    <clipPath>
      <path d="M3.6 12.5C7 6.6 11 4.2 15.5 4.2C20 4.2 24 6.6 27.4 12.5C24 18.4 20 20.8 15.5 20.8C11 20.8 7 18.4 3.6 12.5Z" />
    </clipPath>
    <path
      d="M3.6 12.5C7 6.6 11 4.2 15.5 4.2C20 4.2 24 6.6 27.4 12.5C24 18.4 20 20.8 15.5 20.8C11 20.8 7 18.4 3.6 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M3.6 12.5C7 6.6 11 4.2 15.5 4.2C20 4.2 24 6.6 27.4 12.5C24 18.4 20 20.8 15.5 20.8C11 20.8 7 18.4 3.6 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <g clipPath="url(#eye-ki-eye)">
      <g transform="translate(15.5 12.5)">
        <g>
          <path
            d="M-5.4 0A5.4 5.4 0 1 0 5.4 0A5.4 5.4 0 1 0 -5.4 0Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
        <path d="M-5.4 0A5.4 5.4 0 1 0 5.4 0A5.4 5.4 0 1 0 -5.4 0Z" fill="none" />
        <circle r="2.3" fill="currentColor" />
      </g>
    </g>
    <path
      d="M3.6 12.5C7 6.6 11 4.2 15.5 4.2C20 4.2 24 6.6 27.4 12.5C24 18.4 20 20.8 15.5 20.8C11 20.8 7 18.4 3.6 12.5Z"
      mask="url(#ol-ki-eye-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
  </>,
)
export const FileJson = icon(
  'FileJson',
  <>
    <path
      d="M6.3 3.7Q6.3 1.5 8.5 1.5L18.2 1.5Q18.7 1.5 19.054 1.854L24.346 7.146Q24.7 7.5 24.7 8L24.7 21.3Q24.7 23.5 22.5 23.5L8.5 23.5Q6.3 23.5 6.3 21.3Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M6.3 3.7Q6.3 1.5 8.5 1.5L18.2 1.5Q18.7 1.5 19.054 1.854L24.346 7.146Q24.7 7.5 24.7 8L24.7 21.3Q24.7 23.5 22.5 23.5L8.5 23.5Q6.3 23.5 6.3 21.3Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M6.3 3.7Q6.3 1.5 8.5 1.5L18.2 1.5Q18.7 1.5 19.054 1.854L24.346 7.146Q24.7 7.5 24.7 8L24.7 21.3Q24.7 23.5 22.5 23.5L8.5 23.5Q6.3 23.5 6.3 21.3Z"
      mask="url(#ol-ki-file-code-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      fill="none"
      stroke="var(--color-bg-primary)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.4 11.4L10 15.2L13.4 19"
    />
    <path
      fill="none"
      stroke="var(--color-bg-primary)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.6 11.4L21 15.2L17.6 19"
    />
    <g>
      <path
        d="M18.7 1.9Q18.7 1.5 18.983 1.783L24.417 7.217Q24.7 7.5 24.3 7.5L19.9 7.5Q18.7 7.5 18.7 6.3Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M18.7 1.9Q18.7 1.5 18.983 1.783L24.417 7.217Q24.7 7.5 24.3 7.5L19.9 7.5Q18.7 7.5 18.7 6.3Z"
      fill="none"
    />
  </>,
)
export const FileSpreadsheet = icon(
  'FileSpreadsheet',
  <>
    <path
      d="M6.3 3.7Q6.3 1.5 8.5 1.5L18.2 1.5Q18.7 1.5 19.054 1.854L24.346 7.146Q24.7 7.5 24.7 8L24.7 21.3Q24.7 23.5 22.5 23.5L8.5 23.5Q6.3 23.5 6.3 21.3Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M6.3 3.7Q6.3 1.5 8.5 1.5L18.2 1.5Q18.7 1.5 19.054 1.854L24.346 7.146Q24.7 7.5 24.7 8L24.7 21.3Q24.7 23.5 22.5 23.5L8.5 23.5Q6.3 23.5 6.3 21.3Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M6.3 3.7Q6.3 1.5 8.5 1.5L18.2 1.5Q18.7 1.5 19.054 1.854L24.346 7.146Q24.7 7.5 24.7 8L24.7 21.3Q24.7 23.5 22.5 23.5L8.5 23.5Q6.3 23.5 6.3 21.3Z"
      mask="url(#ol-ki-file-spreadsheet-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M9.2 10.2Q9.2 9.6 9.8 9.6L14.1 9.6Q14.7 9.6 14.7 10.2L14.7 11.6Q14.7 12.2 14.1 12.2L9.8 12.2Q9.2 12.2 9.2 11.6ZM16.3 10.2Q16.3 9.6 16.9 9.6L21.2 9.6Q21.8 9.6 21.8 10.2L21.8 11.6Q21.8 12.2 21.2 12.2L16.9 12.2Q16.3 12.2 16.3 11.6ZM9.2 14.4Q9.2 13.8 9.8 13.8L14.1 13.8Q14.7 13.8 14.7 14.4L14.7 15.8Q14.7 16.4 14.1 16.4L9.8 16.4Q9.2 16.4 9.2 15.8ZM16.3 14.4Q16.3 13.8 16.9 13.8L21.2 13.8Q21.8 13.8 21.8 14.4L21.8 15.8Q21.8 16.4 21.2 16.4L16.9 16.4Q16.3 16.4 16.3 15.8ZM9.2 18.6Q9.2 18 9.8 18L14.1 18Q14.7 18 14.7 18.6L14.7 20Q14.7 20.6 14.1 20.6L9.8 20.6Q9.2 20.6 9.2 20ZM16.3 18.6Q16.3 18 16.9 18L21.2 18Q21.8 18 21.8 18.6L21.8 20Q21.8 20.6 21.2 20.6L16.9 20.6Q16.3 20.6 16.3 20Z"
      fill="var(--color-bg-primary)"
    />
    <path
      d="M9.2 14.4Q9.2 13.8 9.8 13.8L14.1 13.8Q14.7 13.8 14.7 14.4L14.7 15.8Q14.7 16.4 14.1 16.4L9.8 16.4Q9.2 16.4 9.2 15.8Z"
      fillOpacity={0.22}
      fill="currentColor"
      opacity="0"
    />
    <g>
      <path
        d="M18.7 1.9Q18.7 1.5 18.983 1.783L24.417 7.217Q24.7 7.5 24.3 7.5L19.9 7.5Q18.7 7.5 18.7 6.3Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M18.7 1.9Q18.7 1.5 18.983 1.783L24.417 7.217Q24.7 7.5 24.3 7.5L19.9 7.5Q18.7 7.5 18.7 6.3Z"
      fill="none"
    />
  </>,
)
export const FileText = icon(
  'FileText',
  <>
    <path
      d="M6.3 3.7Q6.3 1.5 8.5 1.5L18.2 1.5Q18.7 1.5 19.054 1.854L24.346 7.146Q24.7 7.5 24.7 8L24.7 21.3Q24.7 23.5 22.5 23.5L8.5 23.5Q6.3 23.5 6.3 21.3Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M6.3 3.7Q6.3 1.5 8.5 1.5L18.2 1.5Q18.7 1.5 19.054 1.854L24.346 7.146Q24.7 7.5 24.7 8L24.7 21.3Q24.7 23.5 22.5 23.5L8.5 23.5Q6.3 23.5 6.3 21.3Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M6.3 3.7Q6.3 1.5 8.5 1.5L18.2 1.5Q18.7 1.5 19.054 1.854L24.346 7.146Q24.7 7.5 24.7 8L24.7 21.3Q24.7 23.5 22.5 23.5L8.5 23.5Q6.3 23.5 6.3 21.3Z"
      mask="url(#ol-ki-file-text-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M9.6 5.4H16"
      stroke="var(--color-bg-primary)"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M9 10.6Q9 9.4 10.2 9.4L20.8 9.4Q22 9.4 22 10.6L22 19Q22 20.2 20.8 20.2L10.2 20.2Q9 20.2 9 19Z"
      fill="var(--color-bg-primary)"
    />
    <path
      d="M11.4 12.6H19.6"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      stroke="currentColor"
    />
    <path
      d="M11.4 15.6H16"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      stroke="currentColor"
    />
    <g>
      <path
        d="M18.7 1.9Q18.7 1.5 18.983 1.783L24.417 7.217Q24.7 7.5 24.3 7.5L19.9 7.5Q18.7 7.5 18.7 6.3Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M18.7 1.9Q18.7 1.5 18.983 1.783L24.417 7.217Q24.7 7.5 24.3 7.5L19.9 7.5Q18.7 7.5 18.7 6.3Z"
      fill="none"
    />
  </>,
)
export const GitPullRequest = icon(
  'GitPullRequest',
  <>
    <path
      d="M8.6 4.2V20.6"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      stroke="currentColor"
    />
    <path
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      d="M22.4 18V10.2Q22.4 7.2 19.4 7.2H19.8"
      stroke="currentColor"
    />
    <path
      d="M19.2 4.8Q19.2 4.3 18.82 4.624L16.257 6.811Q15.8 7.2 16.257 7.589L18.82 9.776Q19.2 10.1 19.2 9.6Z"
      fill="currentColor"
    />
    <g>
      <path
        d="M5.6 4.2A3 3 0 1 0 11.6 4.2A3 3 0 1 0 5.6 4.2Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M5.6 4.2A3 3 0 1 0 11.6 4.2A3 3 0 1 0 5.6 4.2Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M5.6 4.2A3 3 0 1 0 11.6 4.2A3 3 0 1 0 5.6 4.2Z"
        mask="url(#ol-ki-git-pull-request-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
    <g>
      <path
        d="M5.6 20.6A3 3 0 1 0 11.6 20.6A3 3 0 1 0 5.6 20.6Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M5.6 20.6A3 3 0 1 0 11.6 20.6A3 3 0 1 0 5.6 20.6Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M5.6 20.6A3 3 0 1 0 11.6 20.6A3 3 0 1 0 5.6 20.6Z"
        mask="url(#ol-ki-git-pull-request-1)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
    <g>
      <path
        d="M19.4 20.6A3 3 0 1 0 25.4 20.6A3 3 0 1 0 19.4 20.6Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M19.4 20.6A3 3 0 1 0 25.4 20.6A3 3 0 1 0 19.4 20.6Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M19.4 20.6A3 3 0 1 0 25.4 20.6A3 3 0 1 0 19.4 20.6Z"
        mask="url(#ol-ki-git-pull-request-2)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
  </>,
)
export const Globe2 = icon(
  'Globe2',
  <>
    <clipPath>
      <path d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z" />
    </clipPath>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <g clipPath="url(#gl-ki-globe)" fill="none" strokeWidth="1.6" stroke="var(--color-bg-primary)">
      <path d="M3 12.5H28" />
      <path d="M10.9 12.5A4.6 11.5 0 1 0 20.1 12.5A4.6 11.5 0 1 0 10.9 12.5Z" />
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-globe-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
  </>,
)
export const GripHorizontal = icon(
  'GripHorizontal',
  <>
    <path
      d="M5.2 4.4Q5.2 2.2 7.4 2.2L23.6 2.2Q25.8 2.2 25.8 4.4L25.8 20.6Q25.8 22.8 23.6 22.8L7.4 22.8Q5.2 22.8 5.2 20.6Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M5.2 4.4Q5.2 2.2 7.4 2.2L23.6 2.2Q25.8 2.2 25.8 4.4L25.8 20.6Q25.8 22.8 23.6 22.8L7.4 22.8Q5.2 22.8 5.2 20.6Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M5.2 4.4Q5.2 2.2 7.4 2.2L23.6 2.2Q25.8 2.2 25.8 4.4L25.8 20.6Q25.8 22.8 23.6 22.8L7.4 22.8Q5.2 22.8 5.2 20.6Z"
      mask="url(#ol-ki-grip-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M10.6 7.4A1.8 1.8 0 1 0 14.2 7.4A1.8 1.8 0 1 0 10.6 7.4Z"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M16.8 7.4A1.8 1.8 0 1 0 20.4 7.4A1.8 1.8 0 1 0 16.8 7.4Z"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M10.6 12.5A1.8 1.8 0 1 0 14.2 12.5A1.8 1.8 0 1 0 10.6 12.5Z"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M16.8 12.5A1.8 1.8 0 1 0 20.4 12.5A1.8 1.8 0 1 0 16.8 12.5Z"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M10.6 17.6A1.8 1.8 0 1 0 14.2 17.6A1.8 1.8 0 1 0 10.6 17.6Z"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M16.8 17.6A1.8 1.8 0 1 0 20.4 17.6A1.8 1.8 0 1 0 16.8 17.6Z"
    />
  </>,
)
export const Headphones = icon(
  'Headphones',
  <>
    <path
      d="M4.4 14.4A11.1 11.1 0 0 1 26.6 14.4H24A8.5 8.5 0 0 0 7 14.4Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4.4 14.4A11.1 11.1 0 0 1 26.6 14.4H24A8.5 8.5 0 0 0 7 14.4Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4.4 14.4A11.1 11.1 0 0 1 26.6 14.4H24A8.5 8.5 0 0 0 7 14.4Z"
      mask="url(#ol-ki-headphones-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g transform="translate(3.6 12.6)">
      <path
        d="M0 3Q0 0 3 0L3.8 0Q6.8 0 6.8 3L6.8 7.6Q6.8 10.6 3.8 10.6L3 10.6Q0 10.6 0 7.6Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M0 3Q0 0 3 0L3.8 0Q6.8 0 6.8 3L6.8 7.6Q6.8 10.6 3.8 10.6L3 10.6Q0 10.6 0 7.6Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M0 3Q0 0 3 0L3.8 0Q6.8 0 6.8 3L6.8 7.6Q6.8 10.6 3.8 10.6L3 10.6Q0 10.6 0 7.6Z"
        mask="url(#ol-ki-headphones-1)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
    <g transform="translate(20.6 12.6)">
      <path
        d="M0 3Q0 0 3 0L3.8 0Q6.8 0 6.8 3L6.8 7.6Q6.8 10.6 3.8 10.6L3 10.6Q0 10.6 0 7.6Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M0 3Q0 0 3 0L3.8 0Q6.8 0 6.8 3L6.8 7.6Q6.8 10.6 3.8 10.6L3 10.6Q0 10.6 0 7.6Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M0 3Q0 0 3 0L3.8 0Q6.8 0 6.8 3L6.8 7.6Q6.8 10.6 3.8 10.6L3 10.6Q0 10.6 0 7.6Z"
        mask="url(#ol-ki-headphones-2)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
  </>,
)
export const History = icon(
  'History',
  <>
    <path
      d="M9.4 13.4A7.4 7.4 0 1 0 24.2 13.4A7.4 7.4 0 1 0 9.4 13.4Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M9.4 13.4A7.4 7.4 0 1 0 24.2 13.4A7.4 7.4 0 1 0 9.4 13.4Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M9.4 13.4A7.4 7.4 0 1 0 24.2 13.4A7.4 7.4 0 1 0 9.4 13.4Z"
      mask="url(#ol-ki-history-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M11.4 13.4A5.4 5.4 0 1 0 22.2 13.4A5.4 5.4 0 1 0 11.4 13.4Z"
      fill="var(--color-bg-primary)"
    />
    <path
      d="M16.8 13.4V11.8"
      transform="rotate(304 16.8 13.4)"
      strokeWidth="2.6"
      strokeLinecap="round"
      stroke="currentColor"
    />
    <path
      d="M16.8 13.4V11"
      transform="rotate(48 16.8 13.4)"
      strokeWidth="2"
      strokeLinecap="round"
      stroke="currentColor"
    />
    <circle cx="16.8" cy="13.4" r="1.4" fill="currentColor" />
    <path
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      d="M22.1 4.22A10.6 10.6 0 0 0 6.663 16.499"
      stroke="currentColor"
    />
    <path
      d="M4.533 16.687Q4.05 16.816 4.414 17.159L6.522 19.146Q6.958 19.557 7.131 18.982L7.963 16.208Q8.107 15.729 7.624 15.859Z"
      fill="currentColor"
    />
  </>,
)
export const Home = icon(
  'Home',
  <>
    <path
      d="M7.4 12.8Q7.4 10.6 9.6 10.6L21.4 10.6Q23.6 10.6 23.6 12.8L23.6 20.8Q23.6 23 21.4 23L9.6 23Q7.4 23 7.4 20.8Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M7.4 12.8Q7.4 10.6 9.6 10.6L21.4 10.6Q23.6 10.6 23.6 12.8L23.6 20.8Q23.6 23 21.4 23L9.6 23Q7.4 23 7.4 20.8Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M7.4 12.8Q7.4 10.6 9.6 10.6L21.4 10.6Q23.6 10.6 23.6 12.8L23.6 20.8Q23.6 23 21.4 23L9.6 23Q7.4 23 7.4 20.8Z"
      mask="url(#ol-ki-home-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M13.2 16.8Q13.2 15.6 14.4 15.6L16.6 15.6Q17.8 15.6 17.8 16.8L17.8 23Q17.8 23 17.8 23L13.2 23Q13.2 23 13.2 23Z"
      fillOpacity={0.22}
      fill="currentColor"
    />
    <g transform="translate(13.2 0) scale(1 1) translate(-13.2 0)">
      <path
        d="M13.2 16.8Q13.2 15.6 14.4 15.6L16.6 15.6Q17.8 15.6 17.8 16.8L17.8 23Q17.8 23 17.8 23L13.2 23Q13.2 23 13.2 23Z"
        fill="var(--color-bg-primary)"
      />
    </g>
    <path
      d="M5 12.6Q3.6 12.6 4.663 11.689L13.83 3.832Q15.5 2.4 17.17 3.832L26.337 11.689Q27.4 12.6 26 12.6Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <path
        d="M5 12.6Q3.6 12.6 4.663 11.689L13.83 3.832Q15.5 2.4 17.17 3.832L26.337 11.689Q27.4 12.6 26 12.6Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M5 12.6Q3.6 12.6 4.663 11.689L13.83 3.832Q15.5 2.4 17.17 3.832L26.337 11.689Q27.4 12.6 26 12.6Z"
      mask="url(#ol-ki-home-1)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
  </>,
)
export const InfinityGlyph = icon(
  'Infinity',
  <>
    <g>
      <path
        d="M15.5 12.5L16.128 11.534L16.753 10.585L17.373 9.668L17.985 8.8L18.586 7.995L19.174 7.267L19.746 6.629L20.3 6.091L20.833 5.663L21.344 5.352L21.83 5.163L22.288 5.1L22.718 5.163L23.116 5.352L23.482 5.663L23.814 6.091L24.11 6.629L24.369 7.267L24.591 7.995L24.773 8.8L24.916 9.668L25.018 10.585L25.079 11.534L25.1 12.5L25.079 13.466L25.018 14.415L24.916 15.332L24.773 16.2L24.591 17.005L24.369 17.733L24.11 18.371L23.814 18.909L23.482 19.337L23.116 19.648L22.718 19.837L22.288 19.9L21.83 19.837L21.344 19.648L20.833 19.337L20.3 18.909L19.746 18.371L19.174 17.733L18.586 17.005L17.985 16.2L17.373 15.332L16.753 14.415L16.128 13.466L15.5 12.5L14.872 11.534L14.247 10.585L13.627 9.668L13.015 8.8L12.414 7.995L11.826 7.267L11.254 6.629L10.7 6.091L10.167 5.663L9.656 5.352L9.17 5.163L8.712 5.1L8.282 5.163L7.884 5.352L7.518 5.663L7.186 6.091L6.89 6.629L6.631 7.267L6.409 7.995L6.227 8.8L6.084 9.668L5.982 10.585L5.921 11.534L5.9 12.5L5.921 13.466L5.982 14.415L6.084 15.332L6.227 16.2L6.409 17.005L6.631 17.733L6.89 18.371L7.186 18.909L7.518 19.337L7.884 19.648L8.282 19.837L8.712 19.9L9.17 19.837L9.656 19.648L10.167 19.337L10.7 18.909L11.254 18.371L11.826 17.733L12.414 17.005L13.015 16.2L13.627 15.332L14.247 14.415L14.872 13.466Z"
        fill="none"
        strokeWidth="5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <g>
        <path
          d="M15.5 12.5L16.128 11.534L16.753 10.585L17.373 9.668L17.985 8.8L18.586 7.995L19.174 7.267L19.746 6.629L20.3 6.091L20.833 5.663L21.344 5.352L21.83 5.163L22.288 5.1L22.718 5.163L23.116 5.352L23.482 5.663L23.814 6.091L24.11 6.629L24.369 7.267L24.591 7.995L24.773 8.8L24.916 9.668L25.018 10.585L25.079 11.534L25.1 12.5L25.079 13.466L25.018 14.415L24.916 15.332L24.773 16.2L24.591 17.005L24.369 17.733L24.11 18.371L23.814 18.909L23.482 19.337L23.116 19.648L22.718 19.837L22.288 19.9L21.83 19.837L21.344 19.648L20.833 19.337L20.3 18.909L19.746 18.371L19.174 17.733L18.586 17.005L17.985 16.2L17.373 15.332L16.753 14.415L16.128 13.466L15.5 12.5L14.872 11.534L14.247 10.585L13.627 9.668L13.015 8.8L12.414 7.995L11.826 7.267L11.254 6.629L10.7 6.091L10.167 5.663L9.656 5.352L9.17 5.163L8.712 5.1L8.282 5.163L7.884 5.352L7.518 5.663L7.186 6.091L6.89 6.629L6.631 7.267L6.409 7.995L6.227 8.8L6.084 9.668L5.982 10.585L5.921 11.534L5.9 12.5L5.921 13.466L5.982 14.415L6.084 15.332L6.227 16.2L6.409 17.005L6.631 17.733L6.89 18.371L7.186 18.909L7.518 19.337L7.884 19.648L8.282 19.837L8.712 19.9L9.17 19.837L9.656 19.648L10.167 19.337L10.7 18.909L11.254 18.371L11.826 17.733L12.414 17.005L13.015 16.2L13.627 15.332L14.247 14.415L14.872 13.466Z"
          fill="none"
          fillOpacity={0.22}
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
    <path
      d="M15.5 12.5L16.128 11.534L16.753 10.585L17.373 9.668L17.985 8.8L18.586 7.995L19.174 7.267L19.746 6.629L20.3 6.091L20.833 5.663L21.344 5.352L21.83 5.163L22.288 5.1L22.718 5.163L23.116 5.352L23.482 5.663L23.814 6.091L24.11 6.629L24.369 7.267L24.591 7.995L24.773 8.8L24.916 9.668L25.018 10.585L25.079 11.534L25.1 12.5L25.079 13.466L25.018 14.415L24.916 15.332L24.773 16.2L24.591 17.005L24.369 17.733L24.11 18.371L23.814 18.909L23.482 19.337L23.116 19.648L22.718 19.837L22.288 19.9L21.83 19.837L21.344 19.648L20.833 19.337L20.3 18.909L19.746 18.371L19.174 17.733L18.586 17.005L17.985 16.2L17.373 15.332L16.753 14.415L16.128 13.466L15.5 12.5L14.872 11.534L14.247 10.585L13.627 9.668L13.015 8.8L12.414 7.995L11.826 7.267L11.254 6.629L10.7 6.091L10.167 5.663L9.656 5.352L9.17 5.163L8.712 5.1L8.282 5.163L7.884 5.352L7.518 5.663L7.186 6.091L6.89 6.629L6.631 7.267L6.409 7.995L6.227 8.8L6.084 9.668L5.982 10.585L5.921 11.534L5.9 12.5L5.921 13.466L5.982 14.415L6.084 15.332L6.227 16.2L6.409 17.005L6.631 17.733L6.89 18.371L7.186 18.909L7.518 19.337L7.884 19.648L8.282 19.837L8.712 19.9L9.17 19.837L9.656 19.648L10.167 19.337L10.7 18.909L11.254 18.371L11.826 17.733L12.414 17.005L13.015 16.2L13.627 15.332L14.247 14.415L14.872 13.466Z"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      stroke="var(--color-bg-primary)"
      strokeDasharray="4 75.191"
      strokeDashoffset="-7.399"
    />
  </>,
)
export const Info = icon(
  'Info',
  <>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-info-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M15.5 11.4V18.2"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="var(--color-bg-primary)"
    />
    <circle cx="15.5" r="1.6" fill="var(--color-bg-primary)" cy="7.2" />
  </>,
)
export const Key = icon(
  'Key',
  <>
    <g>
      <g>
        <g transform="translate(0 12.5) scale(1 1) translate(0 -12.5)">
          <path
            d="M13.6 11.3Q13.6 10.9 14 10.9L27.3 10.9Q28.2 10.9 28.2 11.8L28.2 16.9Q28.2 17.6 27.5 17.6L26.1 17.6Q25.4 17.6 25.4 16.9L25.4 14.4Q25.4 14.1 25.1 14.1L23.9 14.1Q23.6 14.1 23.6 14.4L23.6 17.9Q23.6 18.6 22.9 18.6L21.5 18.6Q20.8 18.6 20.8 17.9L20.8 14.4Q20.8 14.1 20.5 14.1L14 14.1Q13.6 14.1 13.6 13.7Z"
            fill="none"
            strokeWidth="1"
            fillOpacity={0.22}
            stroke="currentColor"
          />
          <path
            d="M13.6 11.3Q13.6 10.9 14 10.9L27.3 10.9Q28.2 10.9 28.2 11.8L28.2 16.9Q28.2 17.6 27.5 17.6L26.1 17.6Q25.4 17.6 25.4 16.9L25.4 14.4Q25.4 14.1 25.1 14.1L23.9 14.1Q23.6 14.1 23.6 14.4L23.6 17.9Q23.6 18.6 22.9 18.6L21.5 18.6Q20.8 18.6 20.8 17.9L20.8 14.4Q20.8 14.1 20.5 14.1L14 14.1Q13.6 14.1 13.6 13.7Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
          <path
            d="M2.4 12.5A7 7 0 1 0 16.4 12.5A7 7 0 1 0 2.4 12.5ZM6.8 12.5A2.6 2.6 0 1 0 12 12.5A2.6 2.6 0 1 0 6.8 12.5Z"
            fill="none"
            strokeWidth="1"
            fillOpacity={0.22}
            stroke="currentColor"
          />
          <path
            d="M2.4 12.5A7 7 0 1 0 16.4 12.5A7 7 0 1 0 2.4 12.5ZM6.8 12.5A2.6 2.6 0 1 0 12 12.5A2.6 2.6 0 1 0 6.8 12.5Z"
            fillRule="evenodd"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
    </g>
    <g transform="translate(0 12.5) scale(1 1) translate(0 -12.5)">
      <path
        d="M13.6 11.3Q13.6 10.9 14 10.9L27.3 10.9Q28.2 10.9 28.2 11.8L28.2 16.9Q28.2 17.6 27.5 17.6L26.1 17.6Q25.4 17.6 25.4 16.9L25.4 14.4Q25.4 14.1 25.1 14.1L23.9 14.1Q23.6 14.1 23.6 14.4L23.6 17.9Q23.6 18.6 22.9 18.6L21.5 18.6Q20.8 18.6 20.8 17.9L20.8 14.4Q20.8 14.1 20.5 14.1L14 14.1Q13.6 14.1 13.6 13.7Z"
        mask="url(#ol-ki-key-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <path
        d="M2.4 12.5A7 7 0 1 0 16.4 12.5A7 7 0 1 0 2.4 12.5ZM6.8 12.5A2.6 2.6 0 1 0 12 12.5A2.6 2.6 0 1 0 6.8 12.5Z"
        fillRule="evenodd"
        mask="url(#ol-ki-key-1)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
  </>,
)
export const KeyRound = icon(
  'KeyRound',
  <>
    <g>
      <g>
        <g transform="translate(0 12.5) scale(1 1) translate(0 -12.5)">
          <path
            d="M13.6 11.3Q13.6 10.9 14 10.9L27.3 10.9Q28.2 10.9 28.2 11.8L28.2 16.9Q28.2 17.6 27.5 17.6L26.1 17.6Q25.4 17.6 25.4 16.9L25.4 14.4Q25.4 14.1 25.1 14.1L23.9 14.1Q23.6 14.1 23.6 14.4L23.6 17.9Q23.6 18.6 22.9 18.6L21.5 18.6Q20.8 18.6 20.8 17.9L20.8 14.4Q20.8 14.1 20.5 14.1L14 14.1Q13.6 14.1 13.6 13.7Z"
            fill="none"
            strokeWidth="1"
            fillOpacity={0.22}
            stroke="currentColor"
          />
          <path
            d="M13.6 11.3Q13.6 10.9 14 10.9L27.3 10.9Q28.2 10.9 28.2 11.8L28.2 16.9Q28.2 17.6 27.5 17.6L26.1 17.6Q25.4 17.6 25.4 16.9L25.4 14.4Q25.4 14.1 25.1 14.1L23.9 14.1Q23.6 14.1 23.6 14.4L23.6 17.9Q23.6 18.6 22.9 18.6L21.5 18.6Q20.8 18.6 20.8 17.9L20.8 14.4Q20.8 14.1 20.5 14.1L14 14.1Q13.6 14.1 13.6 13.7Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
          <path
            d="M2.4 12.5A7 7 0 1 0 16.4 12.5A7 7 0 1 0 2.4 12.5ZM6.8 12.5A2.6 2.6 0 1 0 12 12.5A2.6 2.6 0 1 0 6.8 12.5Z"
            fill="none"
            strokeWidth="1"
            fillOpacity={0.22}
            stroke="currentColor"
          />
          <path
            d="M2.4 12.5A7 7 0 1 0 16.4 12.5A7 7 0 1 0 2.4 12.5ZM6.8 12.5A2.6 2.6 0 1 0 12 12.5A2.6 2.6 0 1 0 6.8 12.5Z"
            fillRule="evenodd"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
    </g>
    <g transform="translate(0 12.5) scale(1 1) translate(0 -12.5)">
      <path
        d="M13.6 11.3Q13.6 10.9 14 10.9L27.3 10.9Q28.2 10.9 28.2 11.8L28.2 16.9Q28.2 17.6 27.5 17.6L26.1 17.6Q25.4 17.6 25.4 16.9L25.4 14.4Q25.4 14.1 25.1 14.1L23.9 14.1Q23.6 14.1 23.6 14.4L23.6 17.9Q23.6 18.6 22.9 18.6L21.5 18.6Q20.8 18.6 20.8 17.9L20.8 14.4Q20.8 14.1 20.5 14.1L14 14.1Q13.6 14.1 13.6 13.7Z"
        mask="url(#ol-ki-key-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <path
        d="M2.4 12.5A7 7 0 1 0 16.4 12.5A7 7 0 1 0 2.4 12.5ZM6.8 12.5A2.6 2.6 0 1 0 12 12.5A2.6 2.6 0 1 0 6.8 12.5Z"
        fillRule="evenodd"
        mask="url(#ol-ki-key-1)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
  </>,
)
export const Keyboard = icon(
  'Keyboard',
  <>
    <path
      d="M4 6.8Q4 4.6 6.2 4.6L24.8 4.6Q27 4.6 27 6.8L27 18.2Q27 20.4 24.8 20.4L6.2 20.4Q4 20.4 4 18.2Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 6.8Q4 4.6 6.2 4.6L24.8 4.6Q27 4.6 27 6.8L27 18.2Q27 20.4 24.8 20.4L6.2 20.4Q4 20.4 4 18.2Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 6.8Q4 4.6 6.2 4.6L24.8 4.6Q27 4.6 27 6.8L27 18.2Q27 20.4 24.8 20.4L6.2 20.4Q4 20.4 4 18.2Z"
      mask="url(#ol-ki-keyboard-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M6 7.4Q6 6.6 6.8 6.6L10.3 6.6Q11.1 6.6 11.1 7.4L11.1 8.8Q11.1 9.6 10.3 9.6L6.8 9.6Q6 9.6 6 8.8ZM12.95 11.8Q12.95 11 13.75 11L17.25 11Q18.05 11 18.05 11.8L18.05 13.2Q18.05 14 17.25 14L13.75 14Q12.95 14 12.95 13.2ZM19.9 7.4Q19.9 6.6 20.7 6.6L24.2 6.6Q25 6.6 25 7.4L25 8.8Q25 9.6 24.2 9.6L20.7 9.6Q19.9 9.6 19.9 8.8Z"
      fill="var(--color-bg-primary)"
    />
    <g>
      <path
        fill="var(--color-bg-primary)"
        d="M6 11.8Q6 11 6.8 11L10.3 11Q11.1 11 11.1 11.8L11.1 13.2Q11.1 14 10.3 14L6.8 14Q6 14 6 13.2Z"
      />
      <path
        fillOpacity={0.22}
        fill="currentColor"
        opacity="0"
        d="M6 11.8Q6 11 6.8 11L10.3 11Q11.1 11 11.1 11.8L11.1 13.2Q11.1 14 10.3 14L6.8 14Q6 14 6 13.2Z"
      />
    </g>
    <g>
      <path
        fill="var(--color-bg-primary)"
        d="M12.95 7.4Q12.95 6.6 13.75 6.6L17.25 6.6Q18.05 6.6 18.05 7.4L18.05 8.8Q18.05 9.6 17.25 9.6L13.75 9.6Q12.95 9.6 12.95 8.8Z"
      />
      <path
        fillOpacity={0.22}
        fill="currentColor"
        opacity="0"
        d="M12.95 7.4Q12.95 6.6 13.75 6.6L17.25 6.6Q18.05 6.6 18.05 7.4L18.05 8.8Q18.05 9.6 17.25 9.6L13.75 9.6Q12.95 9.6 12.95 8.8Z"
      />
    </g>
    <g>
      <path
        fill="var(--color-bg-primary)"
        d="M19.9 11.8Q19.9 11 20.7 11L24.2 11Q25 11 25 11.8L25 13.2Q25 14 24.2 14L20.7 14Q19.9 14 19.9 13.2Z"
      />
      <path
        fillOpacity={0.22}
        fill="currentColor"
        opacity="0"
        d="M19.9 11.8Q19.9 11 20.7 11L24.2 11Q25 11 25 11.8L25 13.2Q25 14 24.2 14L20.7 14Q19.9 14 19.9 13.2Z"
      />
    </g>
    <g>
      <path
        fill="var(--color-bg-primary)"
        d="M9.5 16.2Q9.5 15.4 10.3 15.4L20.7 15.4Q21.5 15.4 21.5 16.2L21.5 17.6Q21.5 18.4 20.7 18.4L10.3 18.4Q9.5 18.4 9.5 17.6Z"
      />
      <path
        fillOpacity={0.22}
        fill="currentColor"
        opacity="0"
        d="M9.5 16.2Q9.5 15.4 10.3 15.4L20.7 15.4Q21.5 15.4 21.5 16.2L21.5 17.6Q21.5 18.4 20.7 18.4L10.3 18.4Q9.5 18.4 9.5 17.6Z"
      />
    </g>
  </>,
)
export const Layers = icon(
  'Layers',
  <>
    <path
      d="M5.448 17.38Q4 16.7 5.448 16.02L13.69 12.15Q15.5 11.3 17.31 12.15L25.552 16.02Q27 16.7 25.552 17.38L17.31 21.25Q15.5 22.1 13.69 21.25Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          fillOpacity={0.22}
          fill="currentColor"
          d="M5.448 17.38Q4 16.7 5.448 16.02L13.69 12.15Q15.5 11.3 17.31 12.15L25.552 16.02Q27 16.7 25.552 17.38L17.31 21.25Q15.5 22.1 13.69 21.25Z"
        />
      </g>
    </g>
    <path
      d="M5.448 17.38Q4 16.7 5.448 16.02L13.69 12.15Q15.5 11.3 17.31 12.15L25.552 16.02Q27 16.7 25.552 17.38L17.31 21.25Q15.5 22.1 13.69 21.25Z"
      mask="url(#ol-ki-layers-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M5.448 13.18Q4 12.5 5.448 11.82L13.69 7.95Q15.5 7.1 17.31 7.95L25.552 11.82Q27 12.5 25.552 13.18L17.31 17.05Q15.5 17.9 13.69 17.05Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          fillOpacity={0.22}
          fill="currentColor"
          d="M5.448 13.18Q4 12.5 5.448 11.82L13.69 7.95Q15.5 7.1 17.31 7.95L25.552 11.82Q27 12.5 25.552 13.18L17.31 17.05Q15.5 17.9 13.69 17.05Z"
        />
      </g>
    </g>
    <path
      d="M5.448 13.18Q4 12.5 5.448 11.82L13.69 7.95Q15.5 7.1 17.31 7.95L25.552 11.82Q27 12.5 25.552 13.18L17.31 17.05Q15.5 17.9 13.69 17.05Z"
      mask="url(#ol-ki-layers-1)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M5.448 8.98Q4 8.3 5.448 7.62L13.69 3.75Q15.5 2.9 17.31 3.75L25.552 7.62Q27 8.3 25.552 8.98L17.31 12.85Q15.5 13.7 13.69 12.85Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          fillOpacity={0.22}
          fill="currentColor"
          d="M5.448 8.98Q4 8.3 5.448 7.62L13.69 3.75Q15.5 2.9 17.31 3.75L25.552 7.62Q27 8.3 25.552 8.98L17.31 12.85Q15.5 13.7 13.69 12.85Z"
        />
      </g>
    </g>
    <path
      d="M5.448 8.98Q4 8.3 5.448 7.62L13.69 3.75Q15.5 2.9 17.31 3.75L25.552 7.62Q27 8.3 25.552 8.98L17.31 12.85Q15.5 13.7 13.69 12.85Z"
      mask="url(#ol-ki-layers-2)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
  </>,
)
export const LayoutGrid = icon(
  'LayoutGrid',
  <>
    <path
      d="M5.2 4.4Q5.2 2.2 7.4 2.2L23.6 2.2Q25.8 2.2 25.8 4.4L25.8 20.6Q25.8 22.8 23.6 22.8L7.4 22.8Q5.2 22.8 5.2 20.6Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M5.2 4.4Q5.2 2.2 7.4 2.2L23.6 2.2Q25.8 2.2 25.8 4.4L25.8 20.6Q25.8 22.8 23.6 22.8L7.4 22.8Q5.2 22.8 5.2 20.6Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M5.2 4.4Q5.2 2.2 7.4 2.2L23.6 2.2Q25.8 2.2 25.8 4.4L25.8 20.6Q25.8 22.8 23.6 22.8L7.4 22.8Q5.2 22.8 5.2 20.6Z"
      mask="url(#ol-ki-grid-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M7.6 5.8Q7.6 4.6 8.8 4.6L10.53 4.6Q11.73 4.6 11.73 5.8L11.73 7.53Q11.73 8.73 10.53 8.73L8.8 8.73Q7.6 8.73 7.6 7.53Z"
      transform="translate(9.665 6.665) scale(1 1) translate(-9.665 -6.665)"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M13.43 5.8Q13.43 4.6 14.63 4.6L16.36 4.6Q17.56 4.6 17.56 5.8L17.56 7.53Q17.56 8.73 16.36 8.73L14.63 8.73Q13.43 8.73 13.43 7.53Z"
      transform="translate(15.495 6.665) scale(1 1) translate(-15.495 -6.665)"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M19.26 5.8Q19.26 4.6 20.46 4.6L22.19 4.6Q23.39 4.6 23.39 5.8L23.39 7.53Q23.39 8.73 22.19 8.73L20.46 8.73Q19.26 8.73 19.26 7.53Z"
      transform="translate(21.325 6.665) scale(1 1) translate(-21.325 -6.665)"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M7.6 11.63Q7.6 10.43 8.8 10.43L10.53 10.43Q11.73 10.43 11.73 11.63L11.73 13.36Q11.73 14.56 10.53 14.56L8.8 14.56Q7.6 14.56 7.6 13.36Z"
      transform="translate(9.665 12.495) scale(1 1) translate(-9.665 -12.495)"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M13.43 11.63Q13.43 10.43 14.63 10.43L16.36 10.43Q17.56 10.43 17.56 11.63L17.56 13.36Q17.56 14.56 16.36 14.56L14.63 14.56Q13.43 14.56 13.43 13.36Z"
      transform="translate(15.495 12.495) scale(1 1) translate(-15.495 -12.495)"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M19.26 11.63Q19.26 10.43 20.46 10.43L22.19 10.43Q23.39 10.43 23.39 11.63L23.39 13.36Q23.39 14.56 22.19 14.56L20.46 14.56Q19.26 14.56 19.26 13.36Z"
      transform="translate(21.325 12.495) scale(1 1) translate(-21.325 -12.495)"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M7.6 17.46Q7.6 16.26 8.8 16.26L10.53 16.26Q11.73 16.26 11.73 17.46L11.73 19.19Q11.73 20.39 10.53 20.39L8.8 20.39Q7.6 20.39 7.6 19.19Z"
      transform="translate(9.665 18.325) scale(1 1) translate(-9.665 -18.325)"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M13.43 17.46Q13.43 16.26 14.63 16.26L16.36 16.26Q17.56 16.26 17.56 17.46L17.56 19.19Q17.56 20.39 16.36 20.39L14.63 20.39Q13.43 20.39 13.43 19.19Z"
      transform="translate(15.495 18.325) scale(1 1) translate(-15.495 -18.325)"
    />
    <path
      fill="var(--color-bg-primary)"
      d="M19.26 17.46Q19.26 16.26 20.46 16.26L22.19 16.26Q23.39 16.26 23.39 17.46L23.39 19.19Q23.39 20.39 22.19 20.39L20.46 20.39Q19.26 20.39 19.26 19.19Z"
      transform="translate(21.325 18.325) scale(1 1) translate(-21.325 -18.325)"
    />
  </>,
)
export const Loader2 = icon(
  'Loader2',
  <>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5ZM8.5 12.5A7 7 0 1 1 22.5 12.5A7 7 0 1 1 8.5 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5ZM8.5 12.5A7 7 0 1 1 22.5 12.5A7 7 0 1 1 8.5 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5ZM8.5 12.5A7 7 0 1 1 22.5 12.5A7 7 0 1 1 8.5 12.5Z"
      fillRule="evenodd"
      mask="url(#ol-ki-loader-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g>
      <g transform="rotate(0 15.5 12.5)">
        <path
          d="M13.503 1.175A11.5 11.5 0 0 1 26.306 16.433A2.25 2.25 0 0 1 22.078 14.894A7 7 0 0 0 14.284 5.606A2.25 2.25 0 0 1 13.503 1.175Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <g transform="rotate(0 15.5 12.5)">
      <path
        d="M13.503 1.175A11.5 11.5 0 0 1 26.306 16.433A2.25 2.25 0 0 1 22.078 14.894A7 7 0 0 0 14.284 5.606A2.25 2.25 0 0 1 13.503 1.175Z"
        fill="none"
      />
    </g>
  </>,
)
export const LoaderCircle = icon(
  'LoaderCircle',
  <>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5ZM8.5 12.5A7 7 0 1 1 22.5 12.5A7 7 0 1 1 8.5 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5ZM8.5 12.5A7 7 0 1 1 22.5 12.5A7 7 0 1 1 8.5 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5ZM8.5 12.5A7 7 0 1 1 22.5 12.5A7 7 0 1 1 8.5 12.5Z"
      fillRule="evenodd"
      mask="url(#ol-ki-loader-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g>
      <g transform="rotate(0 15.5 12.5)">
        <path
          d="M13.503 1.175A11.5 11.5 0 0 1 26.306 16.433A2.25 2.25 0 0 1 22.078 14.894A7 7 0 0 0 14.284 5.606A2.25 2.25 0 0 1 13.503 1.175Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <g transform="rotate(0 15.5 12.5)">
      <path
        d="M13.503 1.175A11.5 11.5 0 0 1 26.306 16.433A2.25 2.25 0 0 1 22.078 14.894A7 7 0 0 0 14.284 5.606A2.25 2.25 0 0 1 13.503 1.175Z"
        fill="none"
      />
    </g>
  </>,
)
export const LogIn = icon(
  'LogIn',
  <>
    <path
      d="M14.8 3.2Q14.8 1 17 1L24.8 1Q27 1 27 3.2L27 21.8Q27 24 24.8 24L17 24Q14.8 24 14.8 21.8Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M14.8 3.2Q14.8 1 17 1L24.8 1Q27 1 27 3.2L27 21.8Q27 24 24.8 24L17 24Q14.8 24 14.8 21.8Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M14.8 3.2Q14.8 1 17 1L24.8 1Q27 1 27 3.2L27 21.8Q27 24 24.8 24L17 24Q14.8 24 14.8 21.8Z"
      mask="url(#ol-ki-log-in-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M17.6 5.6Q17.6 4 19.2 4L22.6 4Q24.2 4 24.2 5.6L24.2 24Q24.2 24 24.2 24L17.6 24Q17.6 24 17.6 24Z"
      fill="var(--color-bg-primary)"
    />
    <g>
      <path
        fillOpacity={0.22}
        fill="currentColor"
        d="M17.6 5.6Q17.6 4 19.2 4L22.6 4Q24.2 4 24.2 5.6L24.2 24Q24.2 24 24.2 24L17.6 24Q17.6 24 17.6 24Z"
      />
    </g>
    <path
      d="M17.6 5.6Q17.6 4 19.2 4L22.6 4Q24.2 4 24.2 5.6L24.2 24Q24.2 24 24.2 24L17.6 24Q17.6 24 17.6 24Z"
      fill="none"
    />
    <circle cy="14" r="1.2" cx="20.9" opacity="1" fill="currentColor" />
    <g transform="translate(0 0)">
      <path
        d="M4.4 12.5H7.4"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        stroke="currentColor"
      />
      <path
        d="M7 10.4Q7 9.9 7.397 10.204L10.003 12.196Q10.4 12.5 10.003 12.804L7.397 14.796Q7 15.1 7 14.6Z"
        fill="currentColor"
      />
    </g>
  </>,
)
export const LogOut = icon(
  'LogOut',
  <>
    <path
      d="M4 3.2Q4 1 6.2 1L14 1Q16.2 1 16.2 3.2L16.2 21.8Q16.2 24 14 24L6.2 24Q4 24 4 21.8Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 3.2Q4 1 6.2 1L14 1Q16.2 1 16.2 3.2L16.2 21.8Q16.2 24 14 24L6.2 24Q4 24 4 21.8Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 3.2Q4 1 6.2 1L14 1Q16.2 1 16.2 3.2L16.2 21.8Q16.2 24 14 24L6.2 24Q4 24 4 21.8Z"
      mask="url(#ol-ki-log-out-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M6.8 5.6Q6.8 4 8.4 4L11.8 4Q13.4 4 13.4 5.6L13.4 24Q13.4 24 13.4 24L6.8 24Q6.8 24 6.8 24Z"
      fill="var(--color-bg-primary)"
    />
    <g>
      <path
        fillOpacity={0.22}
        fill="currentColor"
        d="M6.8 5.6Q6.8 4 8.4 4L11.8 4Q13.4 4 13.4 5.6L13.4 24Q13.4 24 13.4 24L6.8 24Q6.8 24 6.8 24Z"
      />
    </g>
    <path
      d="M6.8 5.6Q6.8 4 8.4 4L11.8 4Q13.4 4 13.4 5.6L13.4 24Q13.4 24 13.4 24L6.8 24Q6.8 24 6.8 24Z"
      fill="none"
    />
    <circle cy="14" r="1.2" cx="10.1" opacity="1" fill="currentColor" />
    <g transform="translate(0 0)">
      <path
        d="M20.3 12.5H24"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        stroke="currentColor"
      />
      <path
        d="M23.6 10.4Q23.6 9.9 23.997 10.204L26.603 12.196Q27 12.5 26.603 12.804L23.997 14.796Q23.6 15.1 23.6 14.6Z"
        fill="currentColor"
      />
    </g>
  </>,
)
export const Mail = icon(
  'Mail',
  <>
    <path
      d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 19.5Q27 21.7 24.8 21.7L6.2 21.7Q4 21.7 4 19.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <path
        d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 19.5Q27 21.7 24.8 21.7L6.2 21.7Q4 21.7 4 19.5Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 19.5Q27 21.7 24.8 21.7L6.2 21.7Q4 21.7 4 19.5Z"
      mask="url(#ol-ki-mail-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g opacity="0">
      <path
        d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 6.5Q27 7.1 26.48 7.399L17.582 12.505Q15.5 13.7 13.418 12.505L4.52 7.399Q4 7.1 4 6.5Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <path
        fillOpacity={0.22}
        fill="currentColor"
        d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 6.5Q27 7.1 26.48 7.399L17.582 12.505Q15.5 13.7 13.418 12.505L4.52 7.399Q4 7.1 4 6.5Z"
      />
      <path
        d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 6.5Q27 7.1 26.48 7.399L17.582 12.505Q15.5 13.7 13.418 12.505L4.52 7.399Q4 7.1 4 6.5Z"
        mask="url(#ol-ki-mail-1)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
    <g transform="translate(0 8.3)">
      <path
        d="M7 1.2Q7 0 8.2 0L22.8 0Q24 0 24 1.2L24 10.8Q24 12 22.8 12L8.2 12Q7 12 7 10.8Z"
        fill="var(--color-bg-primary)"
      />
      <path
        d="M9.8 3.6H16.8"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        stroke="currentColor"
      />
      <path
        d="M9.8 6.8H21.2"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        stroke="currentColor"
      />
    </g>
    <path
      d="M4 7.7Q4 7.1 4.52 7.399L13.418 12.505Q15.5 13.7 17.582 12.505L26.48 7.399Q27 7.1 27 7.7L27 19.5Q27 21.7 24.8 21.7L6.2 21.7Q4 21.7 4 19.5Z"
      fillOpacity={0.22}
      fill="currentColor"
    />
    <g opacity="1">
      <path
        d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 6.5Q27 7.1 26.48 7.399L17.582 12.505Q15.5 13.7 13.418 12.505L4.52 7.399Q4 7.1 4 6.5Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <path
          fillOpacity={0.22}
          fill="currentColor"
          d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 6.5Q27 7.1 26.48 7.399L17.582 12.505Q15.5 13.7 13.418 12.505L4.52 7.399Q4 7.1 4 6.5Z"
        />
      </g>
      <path
        d="M4 5.5Q4 3.3 6.2 3.3L24.8 3.3Q27 3.3 27 5.5L27 6.5Q27 7.1 26.48 7.399L17.582 12.505Q15.5 13.7 13.418 12.505L4.52 7.399Q4 7.1 4 6.5Z"
        mask="url(#ol-ki-mail-2)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
  </>,
)
export const MessageCircle = icon(
  'MessageCircle',
  <>
    <path
      d="M6.257 15.296A10.4 10.4 0 1 1 12.686 21.291L6.4 23Q4.4 23.8 4.9 21.8Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M6.257 15.296A10.4 10.4 0 1 1 12.686 21.291L6.4 23Q4.4 23.8 4.9 21.8Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M6.257 15.296A10.4 10.4 0 1 1 12.686 21.291L6.4 23Q4.4 23.8 4.9 21.8Z"
      mask="url(#ol-ki-message-circle-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g fill="var(--color-bg-primary)">
      <circle cx="11.5" r="1.45" cy="9.8" />
      <circle cx="15.9" r="1.45" cy="9.8" />
      <circle cx="20.3" r="1.45" cy="9.8" />
    </g>
    <path
      d="M8.186 15.6Q6.386 15.6 7.251 17.176A10.4 10.4 0 0 0 15.9 21.8L15.9 21.8A10.4 10.4 0 0 0 24.549 17.176Q25.414 15.6 23.614 15.6Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <path
        d="M8.186 15.6Q6.386 15.6 7.251 17.176A10.4 10.4 0 0 0 15.9 21.8L15.9 21.8A10.4 10.4 0 0 0 24.549 17.176Q25.414 15.6 23.614 15.6Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M8.186 15.6Q6.386 15.6 7.251 17.176A10.4 10.4 0 0 0 15.9 21.8L15.9 21.8A10.4 10.4 0 0 0 24.549 17.176Q25.414 15.6 23.614 15.6Z"
      mask="url(#ol-ki-message-circle-1)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
  </>,
)
export const MessageCircleQuestion = icon(
  'MessageCircleQuestion',
  <>
    <path
      d="M6.257 15.296A10.4 10.4 0 1 1 12.686 21.291L6.4 23Q4.4 23.8 4.9 21.8Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M6.257 15.296A10.4 10.4 0 1 1 12.686 21.291L6.4 23Q4.4 23.8 4.9 21.8Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M6.257 15.296A10.4 10.4 0 1 1 12.686 21.291L6.4 23Q4.4 23.8 4.9 21.8Z"
      mask="url(#ol-ki-message-circle-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g fill="var(--color-bg-primary)">
      <circle cx="11.5" r="1.45" cy="9.8" />
      <circle cx="15.9" r="1.45" cy="9.8" />
      <circle cx="20.3" r="1.45" cy="9.8" />
    </g>
    <path
      d="M8.186 15.6Q6.386 15.6 7.251 17.176A10.4 10.4 0 0 0 15.9 21.8L15.9 21.8A10.4 10.4 0 0 0 24.549 17.176Q25.414 15.6 23.614 15.6Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <path
        d="M8.186 15.6Q6.386 15.6 7.251 17.176A10.4 10.4 0 0 0 15.9 21.8L15.9 21.8A10.4 10.4 0 0 0 24.549 17.176Q25.414 15.6 23.614 15.6Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M8.186 15.6Q6.386 15.6 7.251 17.176A10.4 10.4 0 0 0 15.9 21.8L15.9 21.8A10.4 10.4 0 0 0 24.549 17.176Q25.414 15.6 23.614 15.6Z"
      mask="url(#ol-ki-message-circle-1)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
  </>,
)
export const MessagesSquare = icon(
  'MessagesSquare',
  <>
    <g transform="translate(0 0)">
      <path
        d="M4 5.5Q4 3.3 6.2 3.3L17.8 3.3Q20 3.3 20 5.5L20 12.7Q20 14.9 17.8 14.9L6.2 14.9Q4 14.9 4 12.7Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M4 5.5Q4 3.3 6.2 3.3L17.8 3.3Q20 3.3 20 5.5L20 12.7Q20 14.9 17.8 14.9L6.2 14.9Q4 14.9 4 12.7Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M4 5.5Q4 3.3 6.2 3.3L17.8 3.3Q20 3.3 20 5.5L20 12.7Q20 14.9 17.8 14.9L6.2 14.9Q4 14.9 4 12.7Z"
        mask="url(#ol-ki-messages-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <path
        d="M7 6.8H13.4"
        stroke="var(--color-bg-primary)"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
    <path
      d="M10.2 11Q10.2 8.8 12.4 8.8L24.8 8.8Q27 8.8 27 11L27 16.8Q27 19 24.8 19L17.9 19Q17.4 19 17.046 19.354L14.224 22.176Q13.8 22.6 13.8 22L13.8 19.5Q13.8 19 13.3 19L12 19Q10.2 19 10.2 16.8Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M10.2 11Q10.2 8.8 12.4 8.8L24.8 8.8Q27 8.8 27 11L27 16.8Q27 19 24.8 19L17.9 19Q17.4 19 17.046 19.354L14.224 22.176Q13.8 22.6 13.8 22L13.8 19.5Q13.8 19 13.3 19L12 19Q10.2 19 10.2 16.8Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M10.2 11Q10.2 8.8 12.4 8.8L24.8 8.8Q27 8.8 27 11L27 16.8Q27 19 24.8 19L17.9 19Q17.4 19 17.046 19.354L14.224 22.176Q13.8 22.6 13.8 22L13.8 19.5Q13.8 19 13.3 19L12 19Q10.2 19 10.2 16.8Z"
      mask="url(#ol-ki-messages-1)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <circle cx="14.6" r="1.4" cy="13.9" fill="currentColor" />
    <circle cx="18.6" r="1.4" cy="13.9" fill="currentColor" />
    <circle cx="22.6" r="1.4" cy="13.9" fill="currentColor" />
  </>,
)
export const Mic = icon(
  'Mic',
  <>
    <path
      d="M7.6 11.6C7.6 16.6 11.2 19.8 15.5 19.8C19.8 19.8 23.4 16.6 23.4 11.6M15.5 19.8V22.8M11.4 23.4H19.6"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      stroke="currentColor"
    />
    <path
      d="M10.6 6.1Q10.6 1.2 15.5 1.2L15.5 1.2Q20.4 1.2 20.4 6.1L20.4 10.5Q20.4 15.4 15.5 15.4L15.5 15.4Q10.6 15.4 10.6 10.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M10.6 6.1Q10.6 1.2 15.5 1.2L15.5 1.2Q20.4 1.2 20.4 6.1L20.4 10.5Q20.4 15.4 15.5 15.4L15.5 15.4Q10.6 15.4 10.6 10.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M10.6 6.1Q10.6 1.2 15.5 1.2L15.5 1.2Q20.4 1.2 20.4 6.1L20.4 10.5Q20.4 15.4 15.5 15.4L15.5 15.4Q10.6 15.4 10.6 10.5Z"
      mask="url(#ol-ki-mic-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M4.4 4.4Q1.8 8.6 4.4 12.8M26.6 4.4Q29.2 8.6 26.6 12.8"
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0"
      stroke="currentColor"
    />
  </>,
)
export const Pencil = icon(
  'Pencil',
  <>
    <path
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      d="M6.4 23.6H6.4"
      opacity="0"
      stroke="currentColor"
    />
    <path
      d="M21.1 9.6Q21.1 9.6 21.1 9.6L22.1 9.6Q22.1 9.6 22.1 9.6L27.608 12.573Q28.4 13 27.608 13.427L22.1 16.4Q22.1 16.4 22.1 16.4L21.1 16.4Q21.1 16.4 21.1 16.4Z"
      fill="none"
      strokeWidth="1"
      transform="rotate(135 15.5 13) translate(0 0)"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M21.1 9.6Q21.1 9.6 21.1 9.6L22.1 9.6Q22.1 9.6 22.1 9.6L27.608 12.573Q28.4 13 27.608 13.427L22.1 16.4Q22.1 16.4 22.1 16.4L21.1 16.4Q21.1 16.4 21.1 16.4Z"
          fillOpacity={0.22}
          fill="currentColor"
          transform="rotate(135 15.5 13) translate(0 0)"
        />
      </g>
    </g>
    <path
      d="M21.1 9.6Q21.1 9.6 21.1 9.6L22.1 9.6Q22.1 9.6 22.1 9.6L27.608 12.573Q28.4 13 27.608 13.427L22.1 16.4Q22.1 16.4 22.1 16.4L21.1 16.4Q21.1 16.4 21.1 16.4Z"
      transform="rotate(135 15.5 13) translate(0 0)"
      mask="url(#ol-ki-pencil-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M7.1 10.4Q7.1 9.6 7.9 9.6L22.1 9.6Q22.1 9.6 22.1 9.6L22.1 16.4Q22.1 16.4 22.1 16.4L7.9 16.4Q7.1 16.4 7.1 15.6Z"
      fill="none"
      strokeWidth="1"
      transform="rotate(135 15.5 13) translate(0 0)"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M7.1 10.4Q7.1 9.6 7.9 9.6L22.1 9.6Q22.1 9.6 22.1 9.6L22.1 16.4Q22.1 16.4 22.1 16.4L7.9 16.4Q7.1 16.4 7.1 15.6Z"
          fillOpacity={0.22}
          fill="currentColor"
          transform="rotate(135 15.5 13) translate(0 0)"
        />
      </g>
    </g>
    <path
      d="M7.1 10.4Q7.1 9.6 7.9 9.6L22.1 9.6Q22.1 9.6 22.1 9.6L22.1 16.4Q22.1 16.4 22.1 16.4L7.9 16.4Q7.1 16.4 7.1 15.6Z"
      transform="rotate(135 15.5 13) translate(0 0)"
      mask="url(#ol-ki-pencil-1)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M2.8 11.6Q2.8 9.6 4.8 9.6L5.5 9.6Q7.5 9.6 7.5 11.6L7.5 14.4Q7.5 16.4 5.5 16.4L4.8 16.4Q2.8 16.4 2.8 14.4Z"
      fill="none"
      strokeWidth="1"
      transform="rotate(135 15.5 13) translate(0 0)"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M2.8 11.6Q2.8 9.6 4.8 9.6L5.5 9.6Q7.5 9.6 7.5 11.6L7.5 14.4Q7.5 16.4 5.5 16.4L4.8 16.4Q2.8 16.4 2.8 14.4Z"
          fillOpacity={0.22}
          fill="currentColor"
          transform="rotate(135 15.5 13) translate(0 0)"
        />
      </g>
    </g>
    <path
      d="M2.8 11.6Q2.8 9.6 4.8 9.6L5.5 9.6Q7.5 9.6 7.5 11.6L7.5 14.4Q7.5 16.4 5.5 16.4L4.8 16.4Q2.8 16.4 2.8 14.4Z"
      transform="rotate(135 15.5 13) translate(0 0)"
      mask="url(#ol-ki-pencil-2)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
  </>,
)
export const Search = icon(
  'Search',
  <>
    <path
      d="M4 3.2Q4 1 6.2 1L18.6 1Q20.8 1 20.8 3.2L20.8 19Q20.8 21.2 18.6 21.2L6.2 21.2Q4 21.2 4 19Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 3.2Q4 1 6.2 1L18.6 1Q20.8 1 20.8 3.2L20.8 19Q20.8 21.2 18.6 21.2L6.2 21.2Q4 21.2 4 19Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 3.2Q4 1 6.2 1L18.6 1Q20.8 1 20.8 3.2L20.8 19Q20.8 21.2 18.6 21.2L6.2 21.2Q4 21.2 4 19Z"
      mask="url(#ol-ki-search-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M7.4 4.8H17.4M7.4 7.8H14"
      stroke="var(--color-bg-primary)"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <g>
      <path
        d="M4 12.4Q4 10.8 5.6 10.8L19.2 10.8Q20.8 10.8 20.8 12.4L20.8 19Q20.8 21.2 18.6 21.2L6.2 21.2Q4 21.2 4 19Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
    </g>
    <path
      d="M4 12.4Q4 10.8 5.6 10.8L19.2 10.8Q20.8 10.8 20.8 12.4L20.8 19Q20.8 21.2 18.6 21.2L6.2 21.2Q4 21.2 4 19Z"
      fill="none"
    />
    <g transform="translate(19.8 16.8) scale(1)">
      <circle r="3.6" fill="var(--color-bg-primary)" fillOpacity=".8" />
      <circle r="3.6" fill="currentColor" fillOpacity=".35" />
      <circle r="4.5" fill="none" strokeWidth="1.8" stroke="currentColor" />
      <path d="M3.8 3.8L6.6 6.6" strokeWidth="2.2" strokeLinecap="round" stroke="currentColor" />
    </g>
  </>,
)
export const Settings = icon(
  'Settings',
  <>
    <g>
      <g>
        <g transform="rotate(0 15.5 12.5)">
          <path
            d="M12.026 4.34Q12.719 3.94 12.939 3.171L13.261 2.049Q13.481 1.28 14.281 1.28L16.719 1.28Q17.519 1.28 17.739 2.049L18.061 3.171Q18.281 3.94 18.974 4.34L20.829 5.412Q21.522 5.812 22.298 5.618L23.431 5.335Q24.207 5.142 24.607 5.835L25.826 7.946Q26.226 8.638 25.67 9.214L24.859 10.053Q24.303 10.629 24.303 11.429L24.303 13.571Q24.303 14.371 24.859 14.947L25.67 15.786Q26.226 16.362 25.826 17.054L24.607 19.165Q24.207 19.858 23.431 19.665L22.298 19.382Q21.522 19.188 20.829 19.588L18.974 20.66Q18.281 21.06 18.061 21.829L17.739 22.951Q17.519 23.72 16.719 23.72L14.281 23.72Q13.481 23.72 13.261 22.951L12.939 21.829Q12.719 21.06 12.026 20.66L10.171 19.588Q9.478 19.188 8.702 19.382L7.569 19.665Q6.793 19.858 6.393 19.165L5.174 17.054Q4.774 16.362 5.33 15.786L6.141 14.947Q6.697 14.371 6.697 13.571L6.697 11.429Q6.697 10.629 6.141 10.053L5.33 9.214Q4.774 8.638 5.174 7.946L6.393 5.835Q6.793 5.142 7.569 5.335L8.702 5.618Q9.478 5.812 10.171 5.412Z"
            fill="none"
            strokeWidth="1"
            fillOpacity={0.22}
            stroke="currentColor"
          />
          <path
            d="M12.026 4.34Q12.719 3.94 12.939 3.171L13.261 2.049Q13.481 1.28 14.281 1.28L16.719 1.28Q17.519 1.28 17.739 2.049L18.061 3.171Q18.281 3.94 18.974 4.34L20.829 5.412Q21.522 5.812 22.298 5.618L23.431 5.335Q24.207 5.142 24.607 5.835L25.826 7.946Q26.226 8.638 25.67 9.214L24.859 10.053Q24.303 10.629 24.303 11.429L24.303 13.571Q24.303 14.371 24.859 14.947L25.67 15.786Q26.226 16.362 25.826 17.054L24.607 19.165Q24.207 19.858 23.431 19.665L22.298 19.382Q21.522 19.188 20.829 19.588L18.974 20.66Q18.281 21.06 18.061 21.829L17.739 22.951Q17.519 23.72 16.719 23.72L14.281 23.72Q13.481 23.72 13.261 22.951L12.939 21.829Q12.719 21.06 12.026 20.66L10.171 19.588Q9.478 19.188 8.702 19.382L7.569 19.665Q6.793 19.858 6.393 19.165L5.174 17.054Q4.774 16.362 5.33 15.786L6.141 14.947Q6.697 14.371 6.697 13.571L6.697 11.429Q6.697 10.629 6.141 10.053L5.33 9.214Q4.774 8.638 5.174 7.946L6.393 5.835Q6.793 5.142 7.569 5.335L8.702 5.618Q9.478 5.812 10.171 5.412Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
    </g>
    <g transform="rotate(0 15.5 12.5)">
      <path
        d="M12.026 4.34Q12.719 3.94 12.939 3.171L13.261 2.049Q13.481 1.28 14.281 1.28L16.719 1.28Q17.519 1.28 17.739 2.049L18.061 3.171Q18.281 3.94 18.974 4.34L20.829 5.412Q21.522 5.812 22.298 5.618L23.431 5.335Q24.207 5.142 24.607 5.835L25.826 7.946Q26.226 8.638 25.67 9.214L24.859 10.053Q24.303 10.629 24.303 11.429L24.303 13.571Q24.303 14.371 24.859 14.947L25.67 15.786Q26.226 16.362 25.826 17.054L24.607 19.165Q24.207 19.858 23.431 19.665L22.298 19.382Q21.522 19.188 20.829 19.588L18.974 20.66Q18.281 21.06 18.061 21.829L17.739 22.951Q17.519 23.72 16.719 23.72L14.281 23.72Q13.481 23.72 13.261 22.951L12.939 21.829Q12.719 21.06 12.026 20.66L10.171 19.588Q9.478 19.188 8.702 19.382L7.569 19.665Q6.793 19.858 6.393 19.165L5.174 17.054Q4.774 16.362 5.33 15.786L6.141 14.947Q6.697 14.371 6.697 13.571L6.697 11.429Q6.697 10.629 6.141 10.053L5.33 9.214Q4.774 8.638 5.174 7.946L6.393 5.835Q6.793 5.142 7.569 5.335L8.702 5.618Q9.478 5.812 10.171 5.412Z"
        mask="url(#ol-ki-settings-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
    <path
      d="M9.7 12.5A5.8 5.8 0 1 0 21.3 12.5A5.8 5.8 0 1 0 9.7 12.5Z"
      fill="var(--color-bg-primary)"
    />
    <g>
      <path
        fillOpacity={0.22}
        fill="currentColor"
        d="M12 12.5A3.5 3.5 0 1 0 19 12.5A3.5 3.5 0 1 0 12 12.5Z"
      />
    </g>
    <path d="M12 12.5A3.5 3.5 0 1 0 19 12.5A3.5 3.5 0 1 0 12 12.5Z" fill="none" />
  </>,
)
export const Share2 = icon(
  'Share2',
  <>
    <path
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      d="M9.4 12.5L21.8 6.4M9.4 12.5L21.8 18.6"
      stroke="currentColor"
    />
    <path
      d="M5 12.5A4.4 4.4 0 1 0 13.8 12.5A4.4 4.4 0 1 0 5 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M5 12.5A4.4 4.4 0 1 0 13.8 12.5A4.4 4.4 0 1 0 5 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M5 12.5A4.4 4.4 0 1 0 13.8 12.5A4.4 4.4 0 1 0 5 12.5Z"
      mask="url(#ol-ki-share-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <g transform="translate(21.8 6.4)">
      <path
        d="M-4 0A4 4 0 1 0 4 0A4 4 0 1 0 -4 0Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path d="M-4 0A4 4 0 1 0 4 0A4 4 0 1 0 -4 0Z" fillOpacity={0.22} fill="currentColor" />
        </g>
      </g>
      <path
        d="M-4 0A4 4 0 1 0 4 0A4 4 0 1 0 -4 0Z"
        mask="url(#ol-ki-share-1)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
    <g transform="translate(21.8 18.6)">
      <path
        d="M-4 0A4 4 0 1 0 4 0A4 4 0 1 0 -4 0Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path d="M-4 0A4 4 0 1 0 4 0A4 4 0 1 0 -4 0Z" fillOpacity={0.22} fill="currentColor" />
        </g>
      </g>
      <path
        d="M-4 0A4 4 0 1 0 4 0A4 4 0 1 0 -4 0Z"
        mask="url(#ol-ki-share-2)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
  </>,
)
export const ShieldAlert = icon(
  'ShieldAlert',
  <>
    <g transform="translate(15.5 12.6) scale(1) translate(-15.5 -12.6)">
      <path
        d="M15.5 1.4L24.2 4.8V11.4C24.2 17.2 20.6 21.6 15.5 23.8C10.4 21.6 6.8 17.2 6.8 11.4V4.8Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M15.5 1.4L24.2 4.8V11.4C24.2 17.2 20.6 21.6 15.5 23.8C10.4 21.6 6.8 17.2 6.8 11.4V4.8Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M15.5 1.4L24.2 4.8V11.4C24.2 17.2 20.6 21.6 15.5 23.8C10.4 21.6 6.8 17.2 6.8 11.4V4.8Z"
        mask="url(#ol-ki-shield-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <g>
        <path
          d="M15.5 5.2L20.6 7.2V11.6C20.6 15.4 18.6 18.2 15.5 19.8C12.4 18.2 10.4 15.4 10.4 11.6V7.2Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
      <path
        d="M15.5 5.2L20.6 7.2V11.6C20.6 15.4 18.6 18.2 15.5 19.8C12.4 18.2 10.4 15.4 10.4 11.6V7.2Z"
        fill="none"
      />
    </g>
  </>,
)
export const ShieldCheck = icon(
  'ShieldCheck',
  <>
    <g transform="translate(15.5 12.6) scale(1) translate(-15.5 -12.6)">
      <clipPath>
        <rect x="15.5" y="-2" width="16" height="30" />
      </clipPath>
      <g>
        <g>
          <path
            d="M15.5 1.4L24.2 4.8V11.4C24.2 17.2 20.6 21.6 15.5 23.8C10.4 21.6 6.8 17.2 6.8 11.4V4.8Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <g clipPath="url(#half-ki-shield-check)">
        <path
          d="M15.5 1.4L24.2 4.8V11.4C24.2 17.2 20.6 21.6 15.5 23.8C10.4 21.6 6.8 17.2 6.8 11.4V4.8Z"
          fill="none"
          strokeWidth="1"
          fillOpacity={0.22}
          stroke="currentColor"
        />
        <g>
          <path
            d="M15.5 1.4L24.2 4.8V11.4C24.2 17.2 20.6 21.6 15.5 23.8C10.4 21.6 6.8 17.2 6.8 11.4V4.8Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M15.5 1.4L24.2 4.8V11.4C24.2 17.2 20.6 21.6 15.5 23.8C10.4 21.6 6.8 17.2 6.8 11.4V4.8Z"
        mask="url(#ol-ki-shield-check-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <path
        d="M11.4 12.2L14.4 15.2L19.8 9.6"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </g>
  </>,
)
export const Sparkles = icon(
  'Sparkles',
  <>
    <g>
      <g>
        <g transform="translate(13.2 14.4) rotate(0)">
          <path
            d="M-0.158 -8.926Q0 -9.4 0.158 -8.926L0.78 -7.059Q0.783 -7.05 0.788 -7.041L1.875 -5.022Q1.88 -5.013 1.886 -5.006L3.284 -3.298Q3.29 -3.29 3.298 -3.284L5.006 -1.886Q5.013 -1.88 5.022 -1.875L7.041 -0.788Q7.05 -0.783 7.059 -0.78L8.926 -0.158Q9.4 0 8.926 0.158L7.059 0.78Q7.05 0.783 7.041 0.788L5.022 1.875Q5.013 1.88 5.006 1.886L3.298 3.284Q3.29 3.29 3.284 3.298L1.886 5.006Q1.88 5.013 1.875 5.022L0.788 7.041Q0.783 7.05 0.78 7.059L0.158 8.926Q0 9.4 -0.158 8.926L-0.78 7.059Q-0.783 7.05 -0.788 7.041L-1.875 5.022Q-1.88 5.013 -1.886 5.006L-3.284 3.298Q-3.29 3.29 -3.298 3.284L-5.006 1.886Q-5.013 1.88 -5.022 1.875L-7.041 0.788Q-7.05 0.783 -7.059 0.78L-8.926 0.158Q-9.4 0 -8.926 -0.158L-7.059 -0.78Q-7.05 -0.783 -7.041 -0.788L-5.022 -1.875Q-5.013 -1.88 -5.006 -1.886L-3.298 -3.284Q-3.29 -3.29 -3.284 -3.298L-1.886 -5.006Q-1.88 -5.013 -1.875 -5.022L-0.788 -7.041Q-0.783 -7.05 -0.78 -7.059Z"
            fill="none"
            strokeWidth="1"
            fillOpacity={0.22}
            stroke="currentColor"
          />
          <path
            d="M-0.158 -8.926Q0 -9.4 0.158 -8.926L0.78 -7.059Q0.783 -7.05 0.788 -7.041L1.875 -5.022Q1.88 -5.013 1.886 -5.006L3.284 -3.298Q3.29 -3.29 3.298 -3.284L5.006 -1.886Q5.013 -1.88 5.022 -1.875L7.041 -0.788Q7.05 -0.783 7.059 -0.78L8.926 -0.158Q9.4 0 8.926 0.158L7.059 0.78Q7.05 0.783 7.041 0.788L5.022 1.875Q5.013 1.88 5.006 1.886L3.298 3.284Q3.29 3.29 3.284 3.298L1.886 5.006Q1.88 5.013 1.875 5.022L0.788 7.041Q0.783 7.05 0.78 7.059L0.158 8.926Q0 9.4 -0.158 8.926L-0.78 7.059Q-0.783 7.05 -0.788 7.041L-1.875 5.022Q-1.88 5.013 -1.886 5.006L-3.284 3.298Q-3.29 3.29 -3.298 3.284L-5.006 1.886Q-5.013 1.88 -5.022 1.875L-7.041 0.788Q-7.05 0.783 -7.059 0.78L-8.926 0.158Q-9.4 0 -8.926 -0.158L-7.059 -0.78Q-7.05 -0.783 -7.041 -0.788L-5.022 -1.875Q-5.013 -1.88 -5.006 -1.886L-3.298 -3.284Q-3.29 -3.29 -3.284 -3.298L-1.886 -5.006Q-1.88 -5.013 -1.875 -5.022L-0.788 -7.041Q-0.783 -7.05 -0.78 -7.059Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
    </g>
    <g transform="translate(13.2 14.4) rotate(0)">
      <path
        d="M-0.158 -8.926Q0 -9.4 0.158 -8.926L0.78 -7.059Q0.783 -7.05 0.788 -7.041L1.875 -5.022Q1.88 -5.013 1.886 -5.006L3.284 -3.298Q3.29 -3.29 3.298 -3.284L5.006 -1.886Q5.013 -1.88 5.022 -1.875L7.041 -0.788Q7.05 -0.783 7.059 -0.78L8.926 -0.158Q9.4 0 8.926 0.158L7.059 0.78Q7.05 0.783 7.041 0.788L5.022 1.875Q5.013 1.88 5.006 1.886L3.298 3.284Q3.29 3.29 3.284 3.298L1.886 5.006Q1.88 5.013 1.875 5.022L0.788 7.041Q0.783 7.05 0.78 7.059L0.158 8.926Q0 9.4 -0.158 8.926L-0.78 7.059Q-0.783 7.05 -0.788 7.041L-1.875 5.022Q-1.88 5.013 -1.886 5.006L-3.284 3.298Q-3.29 3.29 -3.298 3.284L-5.006 1.886Q-5.013 1.88 -5.022 1.875L-7.041 0.788Q-7.05 0.783 -7.059 0.78L-8.926 0.158Q-9.4 0 -8.926 -0.158L-7.059 -0.78Q-7.05 -0.783 -7.041 -0.788L-5.022 -1.875Q-5.013 -1.88 -5.006 -1.886L-3.298 -3.284Q-3.29 -3.29 -3.284 -3.298L-1.886 -5.006Q-1.88 -5.013 -1.875 -5.022L-0.788 -7.041Q-0.783 -7.05 -0.78 -7.059Z"
        mask="url(#ol-ki-sparkles-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
    <g>
      <g>
        <g transform="translate(22.6 5.6) scale(1)">
          <path
            d="M-0.158 -4.126Q0 -4.6 0.158 -4.126L0.38 -3.459Q0.383 -3.45 0.388 -3.441L0.915 -2.462Q0.92 -2.453 0.926 -2.446L1.604 -1.618Q1.61 -1.61 1.618 -1.604L2.446 -0.926Q2.453 -0.92 2.462 -0.915L3.441 -0.388Q3.45 -0.383 3.459 -0.38L4.126 -0.158Q4.6 0 4.126 0.158L3.459 0.38Q3.45 0.383 3.441 0.388L2.462 0.915Q2.453 0.92 2.446 0.926L1.618 1.604Q1.61 1.61 1.604 1.618L0.926 2.446Q0.92 2.453 0.915 2.462L0.388 3.441Q0.383 3.45 0.38 3.459L0.158 4.126Q0 4.6 -0.158 4.126L-0.38 3.459Q-0.383 3.45 -0.388 3.441L-0.915 2.462Q-0.92 2.453 -0.926 2.446L-1.604 1.618Q-1.61 1.61 -1.618 1.604L-2.446 0.926Q-2.453 0.92 -2.462 0.915L-3.441 0.388Q-3.45 0.383 -3.459 0.38L-4.126 0.158Q-4.6 0 -4.126 -0.158L-3.459 -0.38Q-3.45 -0.383 -3.441 -0.388L-2.462 -0.915Q-2.453 -0.92 -2.446 -0.926L-1.618 -1.604Q-1.61 -1.61 -1.604 -1.618L-0.926 -2.446Q-0.92 -2.453 -0.915 -2.462L-0.388 -3.441Q-0.383 -3.45 -0.38 -3.459Z"
            fill="none"
            strokeWidth="1"
            fillOpacity={0.22}
            stroke="currentColor"
          />
          <path
            d="M-0.158 -4.126Q0 -4.6 0.158 -4.126L0.38 -3.459Q0.383 -3.45 0.388 -3.441L0.915 -2.462Q0.92 -2.453 0.926 -2.446L1.604 -1.618Q1.61 -1.61 1.618 -1.604L2.446 -0.926Q2.453 -0.92 2.462 -0.915L3.441 -0.388Q3.45 -0.383 3.459 -0.38L4.126 -0.158Q4.6 0 4.126 0.158L3.459 0.38Q3.45 0.383 3.441 0.388L2.462 0.915Q2.453 0.92 2.446 0.926L1.618 1.604Q1.61 1.61 1.604 1.618L0.926 2.446Q0.92 2.453 0.915 2.462L0.388 3.441Q0.383 3.45 0.38 3.459L0.158 4.126Q0 4.6 -0.158 4.126L-0.38 3.459Q-0.383 3.45 -0.388 3.441L-0.915 2.462Q-0.92 2.453 -0.926 2.446L-1.604 1.618Q-1.61 1.61 -1.618 1.604L-2.446 0.926Q-2.453 0.92 -2.462 0.915L-3.441 0.388Q-3.45 0.383 -3.459 0.38L-4.126 0.158Q-4.6 0 -4.126 -0.158L-3.459 -0.38Q-3.45 -0.383 -3.441 -0.388L-2.462 -0.915Q-2.453 -0.92 -2.446 -0.926L-1.618 -1.604Q-1.61 -1.61 -1.604 -1.618L-0.926 -2.446Q-0.92 -2.453 -0.915 -2.462L-0.388 -3.441Q-0.383 -3.45 -0.38 -3.459Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
    </g>
    <g transform="translate(22.6 5.6) scale(1)">
      <path
        d="M-0.158 -4.126Q0 -4.6 0.158 -4.126L0.38 -3.459Q0.383 -3.45 0.388 -3.441L0.915 -2.462Q0.92 -2.453 0.926 -2.446L1.604 -1.618Q1.61 -1.61 1.618 -1.604L2.446 -0.926Q2.453 -0.92 2.462 -0.915L3.441 -0.388Q3.45 -0.383 3.459 -0.38L4.126 -0.158Q4.6 0 4.126 0.158L3.459 0.38Q3.45 0.383 3.441 0.388L2.462 0.915Q2.453 0.92 2.446 0.926L1.618 1.604Q1.61 1.61 1.604 1.618L0.926 2.446Q0.92 2.453 0.915 2.462L0.388 3.441Q0.383 3.45 0.38 3.459L0.158 4.126Q0 4.6 -0.158 4.126L-0.38 3.459Q-0.383 3.45 -0.388 3.441L-0.915 2.462Q-0.92 2.453 -0.926 2.446L-1.604 1.618Q-1.61 1.61 -1.618 1.604L-2.446 0.926Q-2.453 0.92 -2.462 0.915L-3.441 0.388Q-3.45 0.383 -3.459 0.38L-4.126 0.158Q-4.6 0 -4.126 -0.158L-3.459 -0.38Q-3.45 -0.383 -3.441 -0.388L-2.462 -0.915Q-2.453 -0.92 -2.446 -0.926L-1.618 -1.604Q-1.61 -1.61 -1.604 -1.618L-0.926 -2.446Q-0.92 -2.453 -0.915 -2.462L-0.388 -3.441Q-0.383 -3.45 -0.38 -3.459Z"
        mask="url(#ol-ki-sparkles-1)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
  </>,
)
export const Speech = icon(
  'Speech',
  <>
    <path
      d="M11.4 1.8C15.6 1.8 18.4 4.6 18.8 8L21 11.2Q21.6 12.3 20.4 12.6L19 13V14.6Q19 16.6 17 16.8L15 17V19.4H7.6V16C5.4 14.6 4.2 12.2 4.2 9.2C4.2 5 7.4 1.8 11.4 1.8Z"
      fill="none"
      strokeWidth="1"
      strokeLinejoin="round"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M11.4 1.8C15.6 1.8 18.4 4.6 18.8 8L21 11.2Q21.6 12.3 20.4 12.6L19 13V14.6Q19 16.6 17 16.8L15 17V19.4H7.6V16C5.4 14.6 4.2 12.2 4.2 9.2C4.2 5 7.4 1.8 11.4 1.8Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M11.4 1.8C15.6 1.8 18.4 4.6 18.8 8L21 11.2Q21.6 12.3 20.4 12.6L19 13V14.6Q19 16.6 17 16.8L15 17V19.4H7.6V16C5.4 14.6 4.2 12.2 4.2 9.2C4.2 5 7.4 1.8 11.4 1.8Z"
      strokeLinejoin="round"
      mask="url(#ol-ki-speech-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      d="M3.6 20.7Q3.6 17.8 8 17.8L15.2 17.8Q19.6 17.8 19.6 20.7L19.6 21.4Q19.6 23.6 17.4 23.6L5.8 23.6Q3.6 23.6 3.6 21.4Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M3.6 20.7Q3.6 17.8 8 17.8L15.2 17.8Q19.6 17.8 19.6 20.7L19.6 21.4Q19.6 23.6 17.4 23.6L5.8 23.6Q3.6 23.6 3.6 21.4Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M3.6 20.7Q3.6 17.8 8 17.8L15.2 17.8Q19.6 17.8 19.6 20.7L19.6 21.4Q19.6 23.6 17.4 23.6L5.8 23.6Q3.6 23.6 3.6 21.4Z"
      mask="url(#ol-ki-speech-1)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      d="M23.037 8.984A3.6 3.6 0 0 1 23.037 13.416"
      stroke="currentColor"
    />
    <path
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      d="M25.243 7.26A6.4 6.4 0 0 1 25.243 15.14"
      stroke="currentColor"
    />
  </>,
)
export const Square = icon(
  'Square',
  <>
    <g>
      <g>
        <g transform="translate(15.5 12.5) rotate(0)">
          <path
            d="M-10.3 -8.1Q-10.3 -10.3 -8.1 -10.3L8.1 -10.3Q10.3 -10.3 10.3 -8.1L10.3 8.1Q10.3 10.3 8.1 10.3L-8.1 10.3Q-10.3 10.3 -10.3 8.1Z"
            fill="none"
            strokeWidth="1"
            fillOpacity={0.22}
            stroke="currentColor"
          />
          <path
            d="M-10.3 -8.1Q-10.3 -10.3 -8.1 -10.3L8.1 -10.3Q10.3 -10.3 10.3 -8.1L10.3 8.1Q10.3 10.3 8.1 10.3L-8.1 10.3Q-10.3 10.3 -10.3 8.1Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
    </g>
    <g transform="translate(15.5 12.5) rotate(0)">
      <path
        d="M-10.3 -8.1Q-10.3 -10.3 -8.1 -10.3L8.1 -10.3Q10.3 -10.3 10.3 -8.1L10.3 8.1Q10.3 10.3 8.1 10.3L-8.1 10.3Q-10.3 10.3 -10.3 8.1Z"
        mask="url(#ol-ki-square-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
    <g>
      <g transform="translate(15.5 12.5) rotate(0)">
        <path
          d="M-5 -3.4Q-5 -5 -3.4 -5L3.4 -5Q5 -5 5 -3.4L5 3.4Q5 5 3.4 5L-3.4 5Q-5 5 -5 3.4Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <g transform="translate(15.5 12.5) rotate(0)">
      <path
        d="M-5 -3.4Q-5 -5 -3.4 -5L3.4 -5Q5 -5 5 -3.4L5 3.4Q5 5 3.4 5L-3.4 5Q-5 5 -5 3.4Z"
        fill="none"
      />
    </g>
  </>,
)
export const Trash2 = icon(
  'Trash2',
  <>
    <g>
      <path
        fillOpacity={0.22}
        fill="currentColor"
        d="M7.441 6.599Q7.4 6 8 6L23 6Q23.6 6 23.559 6.599L22.593 20.607Q22.4 23.4 19.6 23.4L11.4 23.4Q8.6 23.4 8.407 20.607Z"
      />
    </g>
    <g transform="translate(10.3 12) rotate(0 5.2 3.8)">
      <path
        d="M0 1.2Q0 0 1.2 0L9.2 0Q10.4 0 10.4 1.2L10.4 6.4Q10.4 7.6 9.2 7.6L1.2 7.6Q0 7.6 0 6.4Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <path
        d="M0 1.2Q0 0 1.2 0L9.2 0Q10.4 0 10.4 1.2L10.4 6.4Q10.4 7.6 9.2 7.6L1.2 7.6Q0 7.6 0 6.4Z"
        fillOpacity={0.22}
        fill="currentColor"
      />
      <path
        d="M0 1.2Q0 0 1.2 0L9.2 0Q10.4 0 10.4 1.2L10.4 6.4Q10.4 7.6 9.2 7.6L1.2 7.6Q0 7.6 0 6.4Z"
        mask="url(#ol-ki-trash-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <circle cx="3" cy="3" r="1.4" fill="var(--color-bg-primary)" />
    </g>
    <path
      d="M6.91 7.195Q6.8 6 8 6L23 6Q24.2 6 24.09 7.195L22.856 20.612Q22.6 23.4 19.8 23.4L11.2 23.4Q8.4 23.4 8.144 20.612Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <path
        fillOpacity={0.22}
        fill="currentColor"
        d="M6.91 7.195Q6.8 6 8 6L23 6Q24.2 6 24.09 7.195L22.856 20.612Q22.6 23.4 19.8 23.4L11.2 23.4Q8.4 23.4 8.144 20.612Z"
      />
    </g>
    <path
      d="M6.91 7.195Q6.8 6 8 6L23 6Q24.2 6 24.09 7.195L22.856 20.612Q22.6 23.4 19.8 23.4L11.2 23.4Q8.4 23.4 8.144 20.612Z"
      mask="url(#ol-ki-trash-1)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeOpacity=".6"
      d="M13.064 9.4L13.512 20.2M17.936 9.4L17.488 20.2"
      stroke="currentColor"
    />
    <g transform="translate(0 0) rotate(0 15.5 5.3)">
      <path
        d="M6.4 6.6Q5.4 6.6 5.4 5.6L5.4 5Q5.4 4 6.4 4L11.9 4Q12.4 4 12.4 3.5L12.4 2.4Q12.4 1.6 13.2 1.6L17.8 1.6Q18.6 1.6 18.6 2.4L18.6 3.5Q18.6 4 19.1 4L24.6 4Q25.6 4 25.6 5L25.6 5.6Q25.6 6.6 24.6 6.6Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <path
          d="M6.4 6.6Q5.4 6.6 5.4 5.6L5.4 5Q5.4 4 6.4 4L11.9 4Q12.4 4 12.4 3.5L12.4 2.4Q12.4 1.6 13.2 1.6L17.8 1.6Q18.6 1.6 18.6 2.4L18.6 3.5Q18.6 4 19.1 4L24.6 4Q25.6 4 25.6 5L25.6 5.6Q25.6 6.6 24.6 6.6Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
      <path
        d="M6.4 6.6Q5.4 6.6 5.4 5.6L5.4 5Q5.4 4 6.4 4L11.9 4Q12.4 4 12.4 3.5L12.4 2.4Q12.4 1.6 13.2 1.6L17.8 1.6Q18.6 1.6 18.6 2.4L18.6 3.5Q18.6 4 19.1 4L24.6 4Q25.6 4 25.6 5L25.6 5.6Q25.6 6.6 24.6 6.6Z"
        mask="url(#ol-ki-trash-2)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
    </g>
  </>,
)
export const TriangleAlert = icon(
  'TriangleAlert',
  <>
    <g transform="rotate(0 15.5 22.6)">
      <path
        d="M14.112 3.832Q15.5 1.4 16.888 3.832L26.41 20.516Q27.6 22.6 25.2 22.6L5.8 22.6Q3.4 22.6 4.59 20.516Z"
        fill="none"
        strokeWidth="1"
        fillOpacity={0.22}
        stroke="currentColor"
      />
      <g>
        <g>
          <path
            d="M14.112 3.832Q15.5 1.4 16.888 3.832L26.41 20.516Q27.6 22.6 25.2 22.6L5.8 22.6Q3.4 22.6 4.59 20.516Z"
            fillOpacity={0.22}
            fill="currentColor"
          />
        </g>
      </g>
      <path
        d="M14.112 3.832Q15.5 1.4 16.888 3.832L26.41 20.516Q27.6 22.6 25.2 22.6L5.8 22.6Q3.4 22.6 4.59 20.516Z"
        mask="url(#ol-ki-triangle-alert-0)"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <path
        d="M15.5 9.2V15"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="var(--color-bg-primary)"
      />
      <circle cx="15.5" cy="19" r="1.6" fill="var(--color-bg-primary)" />
    </g>
  </>,
)
export const Type = icon(
  'Type',
  <>
    <path
      d="M5.2 4.4Q5.2 2.2 7.4 2.2L23.6 2.2Q25.8 2.2 25.8 4.4L25.8 20.6Q25.8 22.8 23.6 22.8L7.4 22.8Q5.2 22.8 5.2 20.6Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M5.2 4.4Q5.2 2.2 7.4 2.2L23.6 2.2Q25.8 2.2 25.8 4.4L25.8 20.6Q25.8 22.8 23.6 22.8L7.4 22.8Q5.2 22.8 5.2 20.6Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M5.2 4.4Q5.2 2.2 7.4 2.2L23.6 2.2Q25.8 2.2 25.8 4.4L25.8 20.6Q25.8 22.8 23.6 22.8L7.4 22.8Q5.2 22.8 5.2 20.6Z"
      mask="url(#ol-ki-type-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      fillRule="evenodd"
      fill="var(--color-bg-primary)"
      d="M13.732 5.871Q13.9 5.4 14.4 5.4L16.6 5.4Q17.1 5.4 17.268 5.871L21.965 19.023Q22.1 19.4 21.7 19.4L20.1 19.4Q19.7 19.4 19.57 19.022L18.665 16.389Q18.6 16.2 18.4 16.2L12.6 16.2Q12.4 16.2 12.335 16.389L11.43 19.022Q11.3 19.4 10.9 19.4L9.3 19.4Q8.9 19.4 9.035 19.023ZM15.377 9.874Q15.5 9.6 15.623 9.874L17.177 13.326Q17.3 13.6 17 13.6L14 13.6Q13.7 13.6 13.823 13.326Z"
      transform="translate(15.5 19.4) skewX(0) translate(-15.5 -19.4)"
    />
  </>,
)
export const UserCircle = icon(
  'UserCircle',
  <>
    <clipPath>
      <path d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z" />
    </clipPath>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <g clipPath="url(#av-ki-user)">
      <path
        d="M5 27Q5 27 5 27L5 22Q5 22 5 22L7.7 19.7Q10.4 17.4 14.4 17.4L16.6 17.4Q20.6 17.4 23.3 19.7L26 22Q26 22 26 22L26 27Q26 27 26 27Z"
        fill="var(--color-bg-primary)"
        transform="translate(0 0)"
      />
    </g>
    <circle cx="15.5" cy="10.4" r="4.4" fill="var(--color-bg-primary)" />
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-user-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
  </>,
)
export const XCircle = icon(
  'XCircle',
  <>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      fill="none"
      strokeWidth="1"
      fillOpacity={0.22}
      stroke="currentColor"
    />
    <g>
      <g>
        <path
          d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
          fillOpacity={0.22}
          fill="currentColor"
        />
      </g>
    </g>
    <path
      d="M4 12.5A11.5 11.5 0 1 0 27 12.5A11.5 11.5 0 1 0 4 12.5Z"
      mask="url(#ol-ki-circle-x-0)"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
    />
    <path
      fill="none"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="var(--color-bg-primary)"
      d="M11.8 8.8L19.2 16.2M19.2 8.8L11.8 16.2"
    />
  </>,
)
export { InfinityGlyph as Infinity }
