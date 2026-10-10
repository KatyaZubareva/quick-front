import React, { useId } from "react";

interface LogoProps {
  className?: string;
  withText?: boolean;
}

export const LOGO_PATH =
  "M20.4162 43.1659C24.8859 41.3033 29.9587 41.5643 34.2141 43.8749L34.6076 44.0887C39.028 46.489 41.9997 50.8955 42.5666 55.8934L43.55 64.5692C44.0687 69.1433 40.4707 73.1417 35.8674 73.1063C31.2102 73.0705 27.6587 68.9271 28.3351 64.3192L29.3723 57.2587C29.5289 56.1916 29.0004 55.1405 28.051 54.6288C27.1803 54.1596 26.1175 54.2329 25.3195 54.8173L18.2922 59.9647C14.8185 62.509 9.91702 61.5869 7.60565 57.954C5.12425 54.0535 6.75839 48.8582 11.0256 47.08L20.4162 43.1659ZM58.509 20.9257C62.0297 18.501 66.8666 19.5494 69.0666 23.2147C71.4333 27.1581 69.6738 32.2823 65.384 33.9403L57.634 36.9364C56.7264 37.2872 56.1273 38.1598 56.1271 39.1327C56.1272 40.1116 56.7332 40.9891 57.6486 41.3358L65.3117 44.2382C69.6352 45.8758 71.4324 51.0201 69.0695 54.994C66.8707 58.6917 62.0024 59.7583 58.4592 57.3182L49.5793 51.203C45.6102 48.4695 43.2395 43.9579 43.2394 39.1385C43.2396 34.3194 45.6103 29.8085 49.5793 27.0751L58.509 20.9257ZM35.799 5.1073C40.4262 5.03602 44.0636 9.0461 43.5422 13.6444L42.5607 22.2938C41.9969 27.2651 39.0424 31.6485 34.6457 34.036L34.2277 34.2626C29.9635 36.578 24.8805 36.8389 20.4016 34.9725L10.9279 31.0253C6.70715 29.2664 5.08446 24.1326 7.52753 20.2675C9.80494 16.6647 14.6517 15.7335 18.1017 18.2362L25.3176 23.4716C26.1168 24.0513 27.1779 24.1216 28.0471 23.6532C28.9986 23.1403 29.528 22.0869 29.3713 21.0175L28.3254 13.8944C27.6523 9.30962 31.1656 5.17894 35.799 5.1073Z";

export const LogoMark: React.FC<{ className?: string }> = ({ className = "h-9 w-auto" }) => {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 80 84" fill="none" className={className} aria-hidden="true">
      <g filter={`url(#${uid}-shadow)`}>
        <path d={LOGO_PATH} fill={`url(#${uid}-fill)`} />
        <path
          d={LOGO_PATH}
          stroke={`url(#${uid}-stroke)`}
          strokeOpacity="0.5"
          strokeWidth="2.55319"
          mask={`url(#${uid}-mask)`}
        />
      </g>
      <defs>
        <mask id={`${uid}-mask`} fill="white">
          <path d={LOGO_PATH} />
        </mask>
        <filter
          id={`${uid}-shadow`}
          x="0"
          y="0"
          width="79.0619"
          height="83.3194"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="1.2766" dy="2.55319" />
          <feGaussianBlur stdDeviation="3.82979" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <linearGradient id={`${uid}-fill`} x1="13.383" y1="13.6064" x2="54.3226" y2="58.515" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="0.935817" stopColor="white" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={`${uid}-stroke`} x1="11.6001" y1="13.0477" x2="20.6478" y2="54.9368" gradientUnits="userSpaceOnUse">
          <stop offset="0.0106023" stopColor="#D0E0F8" stopOpacity="0" />
          <stop offset="1" stopColor="#CDDCF3" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const Logo: React.FC<LogoProps> = ({ className = "h-9 w-auto", withText = true }) => (
  <span className="inline-flex items-center gap-2">
    <LogoMark className={className} />
    {withText && <span className="text-[17px] font-semibold tracking-tight text-white">QuickFront</span>}
  </span>
);

export default Logo;
