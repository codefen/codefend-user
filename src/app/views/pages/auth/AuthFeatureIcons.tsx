const iconProps = {
  viewBox: '0 0 64 64',
  fill: 'none',
  'aria-hidden': true,
  focusable: false,
} as const;

export const HackersIcon = () => (
  <svg {...iconProps}>
    <ellipse className="icon-solid" cx="32" cy="43" rx="23" ry="5.4" />
    <path className="icon-solid" d="M21.5 42.2c.4-9 3.2-16.4 10.5-16.4s10.1 7.4 10.5 16.4H21.5z" />
    <path className="icon-band" d="M23.2 38.2c2.8 1.7 5.6 2.4 8.8 2.4s6-.7 8.8-2.4" />
  </svg>
);

export const LeaksIcon = () => (
  <svg {...iconProps}>
    <path d="M32 8c9 12 18 20 18 30a18 18 0 0 1-36 0c0-10 9-18 18-30Z" />
    <path d="M24 38c2.2 7 7 10 13 9" />
  </svg>
);

export const SurfaceIcon = () => (
  <svg {...iconProps}>
    <g className="icon-limb">
      <path d="M27.2 33c-7-2-13-8-16.5-14" />
      <path d="M26.4 40c-9 .2-15 1.5-19.5 6" />
      <path d="M27.4 47c-7.5 3-13 9-15.5 15" />
      <path d="M36.8 33c7-2 13-8 16.5-14" />
      <path d="M37.6 40c9 .2 15 1.5 19.5 6" />
      <path d="M36.6 47c7.5 3 13 9 15.5 15" />
      <path d="M28.4 21.5c-1.4-5 .2-8.6 3.2-10.4" />
      <path d="M35.6 21.5c1.4-5-.2-8.6-3.2-10.4" />
    </g>
    <circle className="icon-solid" cx="26.6" cy="10.2" r="1.35" />
    <circle className="icon-solid" cx="37.4" cy="10.2" r="1.35" />
    <ellipse className="icon-solid" cx="32" cy="43" rx="8.6" ry="13" />
    <circle className="icon-solid" cx="32" cy="25.4" r="6.1" />
    <path className="icon-mark" d="M32 33.2c1.7 2.4 2.4 5.4 2.4 9.2 0 3.6-.8 6.4-2.4 8.6-1.6-2.2-2.4-5-2.4-8.6 0-3.8.7-6.8 2.4-9.2z" />
  </svg>
);
