import type { FC } from 'react';

interface IconProps {
  half?: boolean;
  percentage?: string;
  empty?: boolean;
  stroke?: number | string;
  isButton?: boolean;
  width?: number | string;
  height?: number | string;
  size?: number | string;
  action?: () => void;
  styles?: string;
  className?: string;
  animatedStyle?: string;
  isVisible?: boolean;
  name?: string;
}

export const RobotIcon: FC<IconProps> = ({ width = '24', height = '24' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ overflow: 'visible' }}>
    <path d="M12 8V4H8"></path>
    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
    <path d="M2 14h2"></path>
    <path d="M20 14h2"></path>
    <path d="M15 13v2"></path>
    <path d="M9 13v2"></path>
  </svg>
);

export const ChatCircleIcon: FC<IconProps> = ({ width = '24', height = '24' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
  </svg>
);

export const ChartIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    viewBox="0 0 448 512"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48h-32c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48v160c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48v288c0 26.5-21.5 48-48 48h-32c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"></path>
  </svg>
);

export const GlobeWebIcon: FC<IconProps> = ({ name }) => (
  <svg
    strokeWidth={1.5}
    height="1.2em"
    width="1.2em"
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    style={{ overflow: 'visible' }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"></path>
  </svg>
);

export const WebSolidIcon: FC<IconProps> = ({ width = '1.2em', height = '1.2em' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M3.6 9h16.8" />
    <path d="M3.6 15h16.8" />
    <path d="M11.5 3a17 17 0 0 0 0 18" />
    <path d="M12.5 3a17 17 0 0 1 0 18" />
  </svg>
);

export const AlertIcons = () => (
  <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#EAC452">
    <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
  </svg>
);

export const CircleTicket = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <path d="m9 11 3 3L22 4"></path>
  </svg>
);

export const FileSearchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
    <path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"></path>
    <path d="m9 18-1.5-1.5"></path>
    <circle cx="5" cy="14" r="3"></circle>
  </svg>
);

export const MobileIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    viewBox="0 0 384 512"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M16 64C16 28.7 44.7 0 80 0h224c35.3 0 64 28.7 64 64v384c0 35.3-28.7 64-64 64H80c-35.3 0-64-28.7-64-64V64zm128 384c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16s-7.2-16-16-16h-64c-8.8 0-16 7.2-16 16zM304 64H80v320h224V64z"></path>
  </svg>
);

export const CLoudIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeWidth={0}
    stroke="currentColor"
    color="currentColor"
    fill="currentColor"
    height="1em"
    width="1em"
    style={{ overflow: 'visible' }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
    />
  </svg>
);

export const LanIcon: FC<IconProps> = ({ width = '1em', height = '1em', className = '' }) => (
  <svg
    strokeWidth={0}
    height={height}
    width={width}
    className={className}
    viewBox="0 0 512 512"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M64 32C28.7 32 0 60.7 0 96v64c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1-48 0zM64 288c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64v-64c0-35.3-28.7-64-64-64H64zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1-48 0z"></path>
  </svg>
);
export const EnpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth={0}
    height="1em"
    width="1em"
    viewBox="0 0 701 491"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M490.5 0.5H0.5V385.5H197.5C195.833 391.333 194.167 397.167 192.5 403C190.833 408.833 189.167 414.667 187.5 420.5H70.5V490.5H420.5V420.5H303.5C301.833 414.667 300.167 408.833 298.5 403C296.833 397.167 295.167 391.333 293.5 385.5H490.5V0.5ZM420.5 70.5H70.5V315.5H420.5V70.5ZM700.5 0.5H525.5V490.5H700.5V0.5ZM647.5 70.5H578.5V105.5H647.5V70.5ZM647.5 140.5H578.5V175.5H647.5V140.5ZM643.5 350.5C642.599 349.71 641.932 348.71 641.5 347.5C636.237 340.521 629.237 336.021 620.5 334C599.179 331.397 585.345 340.23 579 360.5C576.724 375.188 581.224 387.188 592.5 396.5C593.71 396.932 594.71 397.599 595.5 398.5C608.91 404.462 621.91 403.628 634.5 396C648.228 383.024 651.228 367.858 643.5 350.5Z"
    />
  </svg>
);

export const SourceCodeIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    viewBox="0 0 640 512"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3l89.3 89.4-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"></path>
  </svg>
);

export const PeopleGroupIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    viewBox="0 0 640 512"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M72 88a56 56 0 1 1 112 0 56 56 0 1 1-112 0zm-8 157.7c-10 11.2-16 26.1-16 42.3s6 31.1 16 42.3v-84.6zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32v-26.8C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416v-21.5c20-24.7 32-56.2 32-90.5 0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112 0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0 56 56 0 1 1-112 0zm120 157.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm-80 272c0 16.2 6 31 16 42.3v-84.6c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zm64 42.3c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32v-42.8c-37.8-18-64-56.5-64-101.2 0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z"></path>
  </svg>
);

export const BugIcon: FC<IconProps> = ({ isButton, className = '' }) => (
  <svg
    strokeWidth={1.7}
    height="1.3em"
    width="1.3em"
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    className={`${className && className}`}
    style={{
      overflow: 'visible',
      cursor: !isButton ? 'default' : 'pointer',
    }}>
    <path
      style={{ cursor: !isButton ? 'default' : 'pointer' }}
      d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082"></path>
  </svg>
);

export const MessageIcon: FC<IconProps> = ({ width = 1, height = 1, className }) => (
  <svg
    strokeWidth={0}
    height={height + 'rem'}
    width={width + 'rem'}
    viewBox="0 0 512 512"
    color="currentColor"
    fill="currentColor"
    className={`${className && className}`}
    style={{ overflow: 'visible' }}>
    <path d="M64 0C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z"></path>
  </svg>
);
export const PreferenceIcon = ({ width = 1, height = 1 }: { width?: number; height?: number }) => (
  <svg
    strokeWidth={0}
    height={height + 'rem'}
    width={width + 'rem'}
    viewBox="0 0 13 14"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path
      d="M4.72998 2.25L5.15998 1.14C5.2325 0.952064 5.36009 0.790411 5.52603 0.676212C5.69197 0.562014 5.88854 0.500595 6.08998 0.5H6.90998C7.11142 0.500595 7.30799 0.562014 7.47393 0.676212C7.63988 0.790411 7.76746 0.952064 7.83998 1.14L8.26998 2.25L9.72998 3.09L10.91 2.91C11.1065 2.88333 11.3064 2.91567 11.4845 3.00292C11.6626 3.09017 11.8107 3.22838 11.91 3.4L12.31 4.1C12.4125 4.27435 12.4597 4.47568 12.4454 4.67742C12.4311 4.87916 12.356 5.07183 12.23 5.23L11.5 6.16V7.84L12.25 8.77C12.376 8.92817 12.4511 9.12084 12.4654 9.32258C12.4797 9.52432 12.4325 9.72565 12.33 9.9L11.93 10.6C11.8307 10.7716 11.6826 10.9098 11.5045 10.9971C11.3264 11.0843 11.1265 11.1167 10.93 11.09L9.74998 10.91L8.28998 11.75L7.85998 12.86C7.78746 13.0479 7.65988 13.2096 7.49393 13.3238C7.32799 13.438 7.13142 13.4994 6.92998 13.5H6.08998C5.88854 13.4994 5.69197 13.438 5.52603 13.3238C5.36009 13.2096 5.2325 13.0479 5.15998 12.86L4.72998 11.75L3.26998 10.91L2.08998 11.09C1.8935 11.1167 1.69352 11.0843 1.51546 10.9971C1.33741 10.9098 1.1893 10.7716 1.08998 10.6L0.689981 9.9C0.587482 9.72565 0.540258 9.52432 0.554541 9.32258C0.568823 9.12084 0.643941 8.92817 0.769981 8.77L1.49998 7.84V6.16L0.749981 5.23C0.623941 5.07183 0.548823 4.87916 0.534541 4.67742C0.520258 4.47568 0.567482 4.27435 0.669981 4.1L1.06998 3.4C1.1693 3.22838 1.31741 3.09017 1.49546 3.00292C1.67352 2.91567 1.8735 2.88333 2.06998 2.91L3.24998 3.09L4.72998 2.25ZM4.49998 7C4.49998 7.39556 4.61728 7.78224 4.83704 8.11114C5.0568 8.44004 5.36916 8.69638 5.73461 8.84776C6.10007 8.99913 6.5022 9.03874 6.89016 8.96157C7.27812 8.8844 7.63449 8.69392 7.91419 8.41421C8.1939 8.13451 8.38438 7.77814 8.46155 7.39018C8.53872 7.00222 8.49912 6.60009 8.34774 6.23463C8.19636 5.86918 7.94002 5.55682 7.61112 5.33706C7.28222 5.1173 6.89554 5 6.49998 5C5.96955 5 5.46084 5.21071 5.08577 5.58579C4.71069 5.96086 4.49998 6.46957 4.49998 7V7Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const InxIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="m20.079 7.235 3.666 4.097c.34.38.34.956 0 1.336l-7.63 8.528c-.19.213-.462.334-.748.334H7.289l12.79-14.295ZM6.789 21.53H1.005c-.867 0-1.326-1.025-.748-1.671L15.748 2.545c.139.057.265.145.367.259l3.631 4.058a.478.478 0 0 0-.039.039L6.916 21.197a.497.497 0 0 0-.127.333Zm8.356-19.06-8.192 9.155L.257 4.141c-.578-.646-.119-1.671.748-1.671h14.14Z"></path>
  </svg>
);

export const DataIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0s224 35.8 224 80zm-54.8 134.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432v-85.9z"></path>
  </svg>
);

export const SnbIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 608 525"
    color="currentColor"
    style={{ overflow: 'visible' }}
    fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M174 0H420C437.451 2.89472 451.784 11.2281 463 25C451.914 43.5029 441.081 62.1696 430.5 81C428.193 88.2646 428.86 95.2646 432.5 102C446.706 126.584 461.539 150.751 477 174.5C481.021 176.84 485.354 178.174 490 178.5C501.336 178.667 512.672 178.833 524.007 179C535.338 179.167 546.669 179.334 558 179.5C567.215 195.762 576.048 212.262 584.5 229C593.541 251.936 592.874 274.603 582.5 297C543.752 364.164 504.752 431.164 465.5 498C453.388 512.3 438.222 521.3 420 525H173C147.146 518.97 128.313 503.97 116.5 480C116.586 476.798 117.586 473.798 119.5 471C128.753 455.496 137.753 439.83 146.5 424C148.009 416.743 146.675 410.077 142.5 404C132.248 387.165 122.248 370.165 112.5 353C109.225 346.727 104.058 343.227 97 342.5C75.9921 342.333 54.9921 341.833 34 341C25.2991 325.46 16.7991 309.793 8.49997 294C0.102631 270.734 1.43596 248.068 12.5 226L123.5 34C135.739 15.8005 152.572 4.46714 174 0ZM281 91C330.11 86.2117 374.11 98.7117 413 128.5C416.299 131.293 419.299 134.293 422 137.5C409.9 154.605 397.4 171.438 384.5 188C362.991 170.835 338.491 160.668 311 157.5C295.952 155.469 282.452 158.969 270.5 168C262.512 180.49 263.346 192.323 273 203.5C282.488 209.244 292.488 213.91 303 217.5C312.166 220.667 321.333 223.833 330.5 227L345.463 232.169L358 236.5C376.727 243.269 393.227 253.436 407.5 267C418.801 280.95 425.135 296.95 426.5 315C430.307 380.519 400.14 420.019 336 433.5C277.032 443.345 224.699 429.345 179 391.5C174.286 387.122 169.953 382.456 166 377.5C178.779 360.222 192.112 343.388 206 327C225.963 343.319 248.296 355.485 273 363.5C288.945 368.646 304.945 368.979 321 364.5C340.158 355.013 345.324 340.513 336.5 321C327.123 311.557 315.956 305.057 303 301.5C284.199 295.9 265.532 289.9 247 283.5C227.71 275.945 210.876 264.778 196.5 250C184.548 232.971 178.715 213.971 179 193C180.186 142.315 205.186 110.149 254 96.5C263.051 94.2187 272.051 92.3854 281 91ZM608 88V94C598.83 111.049 589.33 128.049 579.5 145C576.948 149.219 573.448 152.386 569 154.5C547 155.167 525 155.167 503 154.5C498.315 153.15 494.815 150.317 492.5 146C484.086 130.837 475.419 115.837 466.5 101C463.635 94.8093 463.301 88.476 465.5 82C475.289 64.5859 485.455 47.4192 496 30.5C498.388 28.6395 501.054 27.3061 504 26.5C525.333 25.8333 546.667 25.8333 568 26.5L574 29.5C586.78 48.237 598.114 67.737 608 88ZM0 411V423C7.47312 435.937 14.9731 448.937 22.5 462C24.8151 466.317 28.3151 469.15 33 470.5C50.6667 471.167 68.3333 471.167 86 470.5C89.4024 469.1 92.2357 466.933 94.5 464C98.1665 457.667 101.833 451.333 105.5 445C109.167 438.667 112.833 432.334 116.5 426C120.073 418.661 119.407 411.661 114.5 405L93.5 369C91.7691 366.883 89.6024 365.383 87 364.5C67.6015 363.538 48.2682 363.871 29 365.5C28.0834 366.417 27.1667 367.333 26.25 368.25C25.3333 369.167 24.4166 370.084 23.5 371C15.8924 384.561 8.05906 397.894 0 411Z"
    />
  </svg>
);

export const VdbIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 445 378"
    color="currentColor"
    style={{ overflow: 'visible' }}
    fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.225098 0.227905H22.4251C33.999 53.8228 26.599 57.5188 0.225098 11.3161V0.227905ZM50.1749 0.227905H66.8249C63.5832 19.5367 68.208 36.169 80.6999 50.125C85.3003 78.0285 84.3757 105.749 77.9249 133.287C66.8327 122.235 58.5077 109.298 52.9499 94.4779C50.1781 63.1154 49.2531 31.6988 50.1749 0.227905ZM122.325 0.227905H100.125C99.2008 59.3942 100.126 118.531 102.9 177.64C109.953 193.898 119.204 208.683 130.65 221.993C134.618 147.173 131.843 73.2517 122.325 0.227905ZM155.625 0.227905H172.275C181.693 102.862 184.468 206.352 180.6 310.698C171.797 298.665 164.396 285.729 158.4 271.89C155.626 181.355 154.7 90.8005 155.625 0.227905ZM238.875 0.227905H222.225C223.149 53.8529 222.224 107.446 219.45 161.007L208.35 172.096C204.65 233.081 204.65 294.066 208.35 355.051C212.742 361.954 215.517 369.346 216.675 377.228H227.775C228.933 369.346 231.708 361.954 236.1 355.051C238.875 236.792 239.8 118.517 238.875 0.227905ZM272.175 0.227905H288.825C289.75 90.8005 288.824 181.355 286.05 271.89C280.054 285.729 272.653 298.665 263.85 310.698C259.982 206.352 262.757 102.862 272.175 0.227905ZM344.325 0.227905H322.125C312.607 73.2517 309.832 147.173 313.8 221.993C325.246 208.683 334.497 193.898 341.55 177.64C344.324 118.531 345.249 59.3942 344.325 0.227905ZM377.625 0.227905H394.275C395.197 31.6988 394.272 63.1154 391.5 94.4779C385.942 109.298 377.617 122.235 366.525 133.287C360.074 105.749 359.15 78.0285 363.75 50.125C376.242 36.169 380.867 19.5367 377.625 0.227905ZM444.225 0.227905H422.025C410.451 53.8228 417.851 57.5188 444.225 11.3161V0.227905Z"
    />
  </svg>
);

export const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="40"
    height="40"
    color="currentColor"
    fill="currentColor">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
  </svg>
);

export const SearchIcon: FC<IconProps> = ({ isButton, className }) => (
  <svg
    strokeWidth={0}
    height="1.3em"
    width="1.3em"
    className={`${className && className}`}
    viewBox="0 0 512 512"
    color="currentColor"
    fill="currentColor"
    style={{
      overflow: 'visible',
      cursor: !isButton ? 'default' : 'pointer',
    }}>
    <path
      style={{ cursor: !isButton ? 'default' : 'pointer' }}
      d="M416 208c0 45.9-14.9 88.3-40 122.7l126.6 126.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
  </svg>
);

export const LogoutIcon: FC<IconProps> = ({ width = 1, height = 1, className }) => (
  <svg
    strokeWidth={0}
    height={height + 'rem'}
    width={width + 'rem'}
    className={`${className && className}`}
    viewBox="0 0 512 512"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32v224c0 17.7 14.3 32 32 32s32-14.3 32-32V32zm-144.5 88.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4 0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"></path>
  </svg>
);

export const CircleIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M464 256a208 208 0 1 0-416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"></path>
  </svg>
);

export const CollaboratorsIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M144 0a80 80 0 1 1 0 160 80 80 0 1 1 0-160zm368 0a80 80 0 1 1 0 160 80 80 0 1 1 0-160zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7-1.3 7.2-1.9 14.7-1.9 22.3 0 38.2 16.8 72.5 43.3 96H21.3C9.6 320 0 310.4 0 298.7zM405.3 320h-.7c26.6-23.5 43.3-57.8 43.3-96 0-7.6-.7-15-1.9-22.3 13.6-6.3 28.7-9.7 44.6-9.7h42.7c58.9 0 106.7 47.8 106.7 106.7 0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1-192 0zm-96 261.3c0-73.6 59.7-133.3 133.3-133.3h117.4c73.6 0 133.3 59.7 133.3 133.3 0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"></path>
  </svg>
);

export const KnifeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 19l15 -15l3 3l-6 6l2 2a14 14 0 0 1 -14 4" />
  </svg>
);

export const TrashIcon: FC<IconProps> = ({ action }) => (
  <svg
    onClick={action}
    strokeWidth="1.7"
    height="1.3em"
    width="1.3em"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    color="currentColor"
    stroke="currentColor"
    fill="none"
    style={{ overflow: 'visible', cursor: 'pointer' }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

export function ScanIcon({ stroke = 1.5, size = '1em' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={stroke}
      stroke="currentColor"
      style={{ overflow: 'visible' }}
      width={size}
      height={size}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

export const StatIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    className="codefend-text-red-200"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    color="currentColor"
    style={{
      overflow: 'visible',
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
    }}>
    <path
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
      strokeWidth={1.5}
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"></path>
  </svg>
);

export const CloseIcon: FC<IconProps> = ({ isButton }): any => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{
      overflow: 'visible',
      width: '1.5rem',
      height: '1.5rem',
      cursor: !isButton ? 'default' : 'pointer',
    }}>
    <path
      style={{ cursor: !isButton ? 'default' : 'pointer' }}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

export const LeftArrowIcon: FC<IconProps> = ({ isButton }) => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    color="currentColor"
    fill="currentColor"
    style={{
      overflow: 'visible',
      cursor: !isButton ? 'default' : 'pointer',
    }}>
    <path
      style={{ cursor: !isButton ? 'default' : 'pointer' }}
      d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path>
  </svg>
);

export const SaveIcon: FC<IconProps> = ({ isButton }) => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    color="currentColor"
    fill="currentColor"
    style={{
      overflow: 'visible',
      cursor: !isButton ? 'default' : 'pointer',
    }}>
    <path
      style={{ cursor: !isButton ? 'default' : 'pointer' }}
      d="M48 96v320c0 8.8 7.2 16 16 16h320c8.8 0 16-7.2 16-16V170.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96c0-35.3 28.7-64 64-64h245.5c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9-74.6-74.4-.8-.8V184c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24V80H64c-8.8 0-16 7.2-16 16zm80-16v80h144V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1-128 0z"></path>
  </svg>
);

export const SendIcon: FC<IconProps> = ({ isButton }) => (
  <svg
    strokeWidth={2}
    height="1em"
    width="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap={'round'}
    strokeLinejoin={'round'}
    viewBox="0 0 24 24"
    color="currentColor"
    style={{
      overflow: 'visible',
      cursor: !isButton ? 'default' : 'pointer',
    }}>
    <path style={{ cursor: !isButton ? 'default' : 'pointer' }} d="M22 2 11 13"></path>
    <path
      style={{ cursor: !isButton ? 'default' : 'pointer' }}
      d="M22 2 15 22 11 13 2 9 22 2z"></path>
  </svg>
);

export const ErrorIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    className="codefend-text-red"
    fill="currentColor"
    viewBox="0 0 16 16"
    color="currentColor"
    style={{ overflow: 'visible', width: '3.5rem', height: '3.5rem' }}>
    <path
      fillRule="evenodd"
      d="M7.56 1h.88l6.54 12.26-.44.74H1.44L1 13.26 7.56 1zM8 2.28 2.28 13H13.7L8 2.28zM8.625 12v-1h-1.25v1h1.25zm-1.25-2V6h1.25v4h-1.25z"
      clipRule="evenodd"></path>
  </svg>
);

export const VdbIcon2 = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    viewBox="0 0 1024 1024"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M688 312v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-392 88c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm144 452H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm445.7 51.5-93.3-93.3C814.7 780.7 828 743.9 828 704c0-97.2-78.8-176-176-176s-176 78.8-176 176 78.8 176 176 176c35.8 0 69-10.7 96.8-29l94.7 94.7c1.6 1.6 3.6 2.3 5.6 2.3s4.1-.8 5.6-2.3l31-31a7.9 7.9 0 0 0 0-11.2zM652 816c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
  </svg>
);

export const PencilIcon: FC<IconProps> = ({ isButton }) => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    color="currentColor"
    fill="currentColor"
    style={{
      overflow: 'visible',
      cursor: !isButton ? 'default' : 'pointer',
    }}>
    <path
      style={{ cursor: !isButton ? 'default' : 'pointer' }}
      d="m410.3 231 11.3-11.3-33.9-33.9-62.1-62.1-33.9-33.9-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2l199.2-199.2 22.6-22.7zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9l-78.2 23 23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7l-14.4 14.5-22.6 22.6-11.4 11.3 33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5l-39.3-39.4c-25-25-65.5-25-90.5 0zm-47.4 168-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
  </svg>
);

export const PreviousMessageIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible', width: '1.5rem', height: '1.5rem' }}>
    <path
      fill="currentColor"
      d="M18.575 13.711a.91.91 0 0 0 .898-.898c0-.498-.399-.898-.898-.898a.894.894 0 0 0-.898.898c0 .5.4.898.898.898Zm-4.425 0a.91.91 0 0 0 .898-.898c0-.498-.4-.898-.898-.898a.894.894 0 0 0-.898.898c0 .5.399.898.898.898Zm6.567 5.04a.347.347 0 0 0-.172.37c0 .048 0 .098.025.147.098.417.294 1.081.294 1.106 0 .073.025.122.025.172a.22.22 0 0 1-.221.22c-.05 0-.074-.024-.123-.048l-1.449-.836a.8.8 0 0 0-.344-.098c-.073 0-.147 0-.196.024-.688.197-1.4.295-2.161.295-3.66 0-6.607-2.457-6.607-5.505 0-3.047 2.947-5.505 6.607-5.505 3.659 0 6.606 2.458 6.606 5.505 0 1.647-.884 3.146-2.284 4.154ZM16.674 8.099a9.112 9.112 0 0 0-.28-.005c-4.174 0-7.606 2.86-7.606 6.505 0 .554.08 1.09.228 1.6h-.089a9.966 9.966 0 0 1-2.584-.368c-.074-.025-.148-.025-.222-.025a.832.832 0 0 0-.419.123l-1.747 1.005a.35.35 0 0 1-.148.05.273.273 0 0 1-.27-.27c0-.074.024-.123.049-.197.024-.024.246-.834.369-1.324 0-.05.024-.123.024-.172a.556.556 0 0 0-.221-.441C2.059 13.376 1 11.585 1 9.598 1.001 5.944 4.571 3 8.951 3c3.765 0 6.93 2.169 7.723 5.098Zm-5.154.418c.573 0 1.026-.477 1.026-1.026 0-.573-.453-1.026-1.026-1.026s-1.026.453-1.026 1.026.453 1.026 1.026 1.026Zm-5.26 0c.573 0 1.027-.477 1.027-1.026 0-.573-.454-1.026-1.027-1.026-.572 0-1.026.453-1.026 1.026s.454 1.026 1.026 1.026Z"></path>
  </svg>
);

export const AdminUser = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    viewBox="0 0 448 512"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M64 80c-8.8 0-16 7.2-16 16v320c0 8.8 7.2 16 16 16h320c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96c0-35.3 28.7-64 64-64h320c35.3 0 64 28.7 64 64v320c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm200 248v-64h-64c-13.3 0-24-10.7-24-24s10.7-24 24-24h64v-64c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24h-64v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
  </svg>
);

export const AdminCompanyIcon = () => (
  <svg
    strokeWidth={0}
    height="1em"
    width="1em"
    viewBox="0 0 384 512"
    color="currentColor"
    fill="currentColor"
    style={{ overflow: 'visible' }}>
    <path d="M64 48c-8.8 0-16 7.2-16 16v384c0 8.8 7.2 16 16 16h80v-64c0-26.5 21.5-48 48-48s48 21.5 48 48v64h80c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64zM0 64C0 28.7 28.7 0 64 0h256c35.3 0 64 28.7 64 64v384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm88 40c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v48c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16v-48zm144-16h48c8.8 0 16 7.2 16 16v48c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16v-48c0-8.8 7.2-16 16-16zM88 232c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v48c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16v-48zm144-16h48c8.8 0 16 7.2 16 16v48c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16v-48c0-8.8 7.2-16 16-16z"></path>
  </svg>
);

export const ScanSearchIcon: FC<IconProps> = ({ isButton }) => (
  <svg
    strokeWidth={0}
    height="1.3em"
    width="1.3em"
    viewBox="0 0 1024 1024"
    color="currentColor"
    fill="currentColor"
    style={{
      overflow: 'visible',
      cursor: !isButton ? 'default' : 'pointer',
    }}>
    <path
      style={{ cursor: !isButton ? 'default' : 'pointer' }}
      d="M688 312v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-392 88c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm144 452H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm445.7 51.5-93.3-93.3C814.7 780.7 828 743.9 828 704c0-97.2-78.8-176-176-176s-176 78.8-176 176 78.8 176 176 176c35.8 0 69-10.7 96.8-29l94.7 94.7c1.6 1.6 3.6 2.3 5.6 2.3s4.1-.8 5.6-2.3l31-31a7.9 7.9 0 0 0 0-11.2zM652 816c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
  </svg>
);

export const EditIcon: FC<IconProps> = ({ width, height }) => (
  <svg
    strokeWidth={0}
    height={height + 'rem'}
    width={width + 'rem'}
    viewBox="0 0 24 24"
    color="currentColor"
    fill="currentColor"
    style={{
      overflow: 'visible',
      cursor: 'pointer',
    }}>
    <path
      style={{ cursor: 'pointer' }}
      d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z"></path>
  </svg>
);

export const NetworkIcon: FC<IconProps> = ({ width, height }) => (
  <svg
    strokeWidth={2}
    height="1em"
    width="1em"
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    color="currentColor"
    strokeLinecap={'round'}
    strokeLinejoin={'round'}
    style={{
      overflow: 'visible',
      cursor: 'pointer',
      width: width + 'rem',
      height: height + 'rem',
    }}>
    <path style={{ cursor: 'pointer' }} stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path style={{ cursor: 'pointer' }} d="M12 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0"></path>
    <path style={{ cursor: 'pointer' }} d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6"></path>
    <path style={{ cursor: 'pointer' }} d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6"></path>
    <path style={{ cursor: 'pointer' }} d="M6 9h12"></path>
    <path style={{ cursor: 'pointer' }} d="M3 19h7"></path>
    <path style={{ cursor: 'pointer' }} d="M14 19h7"></path>
    <path style={{ cursor: 'pointer' }} d="M12 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
    <path d="M12 15v2"></path>
  </svg>
);

export const RobotFaceIcon: FC<IconProps> = ({ width, height }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      overflow: 'visible',
    }}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z" />
    <path d="M9 16c1 .667 2 1 3 1s2 -.333 3 -1" />
    <path d="M9 7l-1 -4" />
    <path d="M15 7l1 -4" />
    <path d="M9 12v-1" />
    <path d="M15 12v-1" />
  </svg>
);

export const CompanyIcon: FC<IconProps> = ({ width = 1, height = 1 }) => (
  <svg
    strokeWidth={0}
    height={width + 'rem'}
    width={height + 'rem'}
    viewBox="0 0 640 512"
    color="currentColor"
    fill="currentColor"
    style={{
      overflow: 'visible',
    }}>
    <path d="M48 0C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h96v-80c0-26.5 21.5-48 48-48s48 21.5 48 48v80h89.9c-6.3-10.2-9.9-22.2-9.9-35.1 0-46.9 25.8-87.8 64-109.2V48c0-26.5-21.5-48-48-48H48zm16 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-32zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-32zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-32zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-32c0-8.8 7.2-16 16-16zm304 176a80 80 0 1 0-160 0 80 80 0 1 0 160 0zM352 477.1c0 19.3 15.6 34.9 34.9 34.9h218.2c19.3 0 34.9-15.6 34.9-34.9 0-51.4-41.7-93.1-93.1-93.1H445.1c-51.4 0-93.1 41.7-93.1 93.1z"></path>
  </svg>
);

export const RigthArrowIcon: FC<IconProps> = ({ width = 1, height = 1 }) => (
  <svg
    strokeWidth={2}
    height={width + 'rem'}
    width={height + 'rem'}
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    strokeLinecap={'round'}
    strokeLinejoin={'round'}
    color="currentColor"
    style={{
      overflow: 'visible',
    }}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M4 9h8v-3.586a1 1 0 0 1 1.707 -.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 1 0 0 1 -1.707 -.707v-3.586h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1z"></path>
  </svg>
);

export const SimpleRightArrowIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

export const CopyIcon: FC<IconProps> = ({ width = 1, height = 1, isButton }) => (
  <svg
    strokeWidth={1}
    height={width + 'rem'}
    width={height + 'rem'}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeLinecap={'round'}
    strokeLinejoin={'round'}
    color="currentColor"
    style={{
      overflow: 'visible',
      cursor: isButton ? 'pointer' : 'default',
    }}
    fill="currentColor">
    <path
      style={{ cursor: isButton ? 'pointer' : 'default' }}
      d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6ZM7 11H13V13H7V11ZM7 15H13V17H7V15Z"></path>
  </svg>
);

export const CopiedIcon: FC<IconProps> = ({ width = 1, height = 1 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    height={width + 'rem'}
    width={height + 'rem'}
    strokeLinecap={'round'}
    strokeLinejoin={'round'}
    color="currentColor">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export const ChevronIcon: FC<IconProps> = ({ width = 1, height = 1 }) => (
  <svg
    id="chevron-icon"
    width={width + 'rem'}
    height={height + 'rem'}
    viewBox="0 0 14 25"
    fill="none"
    style={{
      overflow: 'visible',
    }}>
    <line x1="0.66086" y1="24.6326" x2="13.6609" y2="12.6326" stroke="currentColor" />
    <line x1="13.6464" y1="13.3536" x2="0.646446" y2="0.353553" stroke="currentColor" />
  </svg>
);

export const MoonIcon: FC<IconProps> = ({ width = 1, height = 1 }) => (
  <svg
    width={width + 'rem'}
    height={height + 'rem'}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor">
    <path
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
    />
  </svg>
);

export const SunIcon: FC<IconProps> = ({ width = 1, height = 1 }) => (
  <svg
    width={width + 'rem'}
    height={height + 'rem'}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor">
    <path
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
    />
  </svg>
);

export const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
      clipRule="evenodd"></path>
  </svg>
);

export const CheckSimpleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"></path>
  </svg>
);

export const WindowsIcon: FC<IconProps> = ({ styles }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 448 512"
    className={styles ? `${styles}` : ``}
    height="1em"
    width="1em">
    <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"></path>
  </svg>
);

export const LinuxIcon: FC<IconProps> = ({ styles }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth={0}
    viewBox="0 0 448 512"
    className={styles ? `${styles}` : ``}
    height="1em"
    width="1em">
    <path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6.6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7.8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4.6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1.8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7.4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6.8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1.3-.2.7-.3 1-.5.8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z"></path>
  </svg>
);

export const AppleIcon: FC<IconProps> = ({ styles }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth={0}
    viewBox="0 0 384 512"
    className={styles ? `${styles}` : ``}
    height="1em"
    width="1em">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
  </svg>
);

export const WarningIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth={0}
    viewBox="0 0 576 512"
    height="1em"
    width="1em">
    <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
  </svg>
);

export const CircleAskIcon: FC<IconProps> = ({ styles }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth={0}
    viewBox="0 0 16 16"
    className={styles ? `${styles}` : ``}
    height="1em"
    width="1em">
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
  </svg>
);

export const StarIcon: FC<IconProps> = ({ half, percentage, empty }) => {
  if (empty) {
    return (
      <svg viewBox="0 0 24 24" fill="none" id="star-icon">
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
          clipRule="evenodd"
          fill="#e0e0e0"
        />
      </svg>
    );
  }

  if (half) {
    const percentageValue = Math.min(100, Math.max(0, parseFloat(percentage || '50')));

    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Fondo gris */}
        <svg viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', zIndex: 1 }}>
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
            fill="#e0e0e0"
          />
        </svg>

        {/* Parte naranja */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: `${percentageValue}%`,
            overflow: 'hidden',
            display: 'inline-block',
          }}>
          <svg viewBox="0 0 24 24" fill="none">
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
              fill="#ff9100"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Estrella completa
  return (
    <svg viewBox="0 0 24 24" fill="none" id="star-icon">
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
        fill="#ff9100"
      />
    </svg>
  );
};

export const HalfStarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 21 20" fill="none">
    <g filter="url(#filter0_d_151_890)">
      <path
        d="M15.6475 6.62106L16.6695 9.71034C16.7169 9.85364 16.8508 9.95041 17.0018 9.95041H20.3013C20.35 9.95041 20.37 10.0128 20.3304 10.0411L17.6672 11.9414C17.5423 12.0306 17.49 12.1906 17.5382 12.3363L18.5569 15.4155C18.5721 15.4614 18.5198 15.5 18.4804 15.4719L15.8033 13.5616C15.6817 13.4748 15.5183 13.4748 15.3967 13.5616L12.7196 15.4719C12.6802 15.5 12.6279 15.4614 12.6431 15.4155L13.6618 12.3363C13.71 12.1906 13.6577 12.0306 13.5328 11.9414L10.8696 10.0411C10.83 10.0128 10.85 9.95041 10.8987 9.95041H14.1982C14.3492 9.95041 14.4831 9.85364 14.5305 9.71034L15.5525 6.62106C15.5677 6.57534 15.6323 6.57534 15.6475 6.62106Z"
        stroke="url(#paint0_linear_151_890)"
        strokeWidth="0.3"
        shapeRendering="crispEdges"
      />
    </g>
    <g filter="url(#filter1_d_151_890)">
      <path
        d="M15.4101 6.57395C15.4706 6.39104 15.7294 6.39104 15.7899 6.57395L16.8119 9.66322C16.839 9.74511 16.9155 9.80041 17.0018 9.80041H20.3013C20.4959 9.80041 20.5759 10.0502 20.4175 10.1632L17.7543 12.0635C17.683 12.1145 17.6531 12.2059 17.6806 12.2892L18.6993 15.3684C18.7601 15.552 18.5507 15.7063 18.3933 15.594L15.7162 13.6837C15.6467 13.6341 15.5533 13.6341 15.4838 13.6837L12.8067 15.594C12.6493 15.7063 12.4399 15.552 12.5007 15.3684L13.5194 12.2892C13.5469 12.2059 13.517 12.1145 13.4457 12.0635L10.7825 10.1632C10.6241 10.0502 10.7041 9.80041 10.8987 9.80041H14.1982C14.2845 9.80041 14.361 9.74511 14.3881 9.66322L15.4101 6.57395Z"
        fill="url(#paint1_linear_151_890)"
        shapeRendering="crispEdges"
      />
      <path
        d="M15.7424 6.58966L16.7644 9.67893C16.7983 9.78129 16.894 9.85041 17.0018 9.85041H20.3013C20.4473 9.85041 20.5073 10.0377 20.3884 10.1225L17.7253 12.0228C17.6361 12.0865 17.5987 12.2008 17.6332 12.3049L18.6518 15.3841C18.6974 15.5218 18.5404 15.6376 18.4223 15.5533L15.7452 13.643C15.6583 13.581 15.5417 13.581 15.4548 13.643L12.7777 15.5533C12.6596 15.6376 12.5026 15.5218 12.5482 15.3841L13.5668 12.3049C13.6013 12.2008 13.5639 12.0865 13.4747 12.0228L10.8116 10.1225C10.6927 10.0377 10.7527 9.85041 10.8987 9.85041H14.1982C14.306 9.85041 14.4017 9.78129 14.4356 9.67893L15.4576 6.58966C15.503 6.45247 15.697 6.45247 15.7424 6.58966Z"
        stroke="url(#paint2_linear_151_890)"
        strokeWidth="0.1"
        shapeRendering="crispEdges"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_151_890"
        x="0.698242"
        y="0.436768"
        width="29.8035"
        height="29.1953"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_151_890" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_151_890" result="shape" />
      </filter>
      <filter
        id="filter1_d_151_890"
        x="0.698242"
        y="0.436768"
        width="29.8035"
        height="29.1953"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_151_890" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_151_890" result="shape" />
      </filter>
      <linearGradient
        id="paint0_linear_151_890"
        x1="19"
        y1="10.5"
        x2="14"
        y2="10.5"
        gradientUnits="userSpaceOnUse">
        <stop offset="0.253281" stopColor="#4B4D4E" />
        <stop offset="1" stopColor="#484C50" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_151_890"
        x1="15.5"
        y1="11"
        x2="16.5"
        y2="11"
        gradientUnits="userSpaceOnUse">
        <stop offset="0.0782809" stopColor="#FF9400" />
        <stop offset="0.248281" stopColor="#FF9400" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_151_890"
        x1="12.5"
        y1="10.5"
        x2="15.5"
        y2="10.5"
        gradientUnits="userSpaceOnUse">
        <stop offset="0.528281" stopColor="#FD8B00" />
        <stop offset="1" stopColor="#FD8B00" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const ChipIcon = () => (
  <svg
    className="chip"
    id="chip-icon"
    x="0px"
    y="0px"
    width="50px"
    height="40px"
    viewBox="0 0 50 60">
    <image
      id="image0"
      width="50"
      height="50"
      x="0"
      y="5"
      href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
		  AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOY
		  fEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSW
		  ekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GS
		  e0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOW
		  ekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bf
		  u3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWua
		  fUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1
		  lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrb
		  tnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOh
		  g0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU
		  /f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dE
		  orDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2Ng
		  GAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVg
		  OkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3d
		  I2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6a
		  lKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkI
		  JVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0FqBo
		  KWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM1dzh
		  RZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGmBSkuta
		  VQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCETamhEqJ
		  KM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdCS24ra7
		  Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpjcmVhdGU
		  AMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMD
		  ItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTEzVDA
		  4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg=="></image>
  </svg>
);

export const PrinterIcon: FC<IconProps> = ({ width = 1, height = 1, isButton }) => (
  <svg
    color="currentColor"
    fill="currentColor"
    strokeWidth={1.5}
    width={width + 'rem'}
    height={height + 'rem'}
    stroke="currentColor"
    style={{ cursor: isButton ? 'pointer' : 'default' }}>
    <path
      style={{ cursor: isButton ? 'pointer' : 'default' }}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
    />
  </svg>
);

export const CodefendIcon = ({ className = '' }: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink">
    <rect width="20" height="20" fill="url(#pattern0_23_3)" />
    <defs>
      <pattern id="pattern0_23_3" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_23_3" transform="scale(0.05)" />
      </pattern>
      <image
        id="image0_23_3"
        width="20"
        height="20"
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAA0O2NhQlgAADQ7anVtYgAAAB5qdW1kYzJwYQARABCAAACqADibcQNjMnBhAAAANBVqdW1iAAAAR2p1bWRjMm1hABEAEIAAAKoAOJtxA3Vybjp1dWlkOjU1ODY2MWZjLTEyZGYtNGU4Zi05MTMxLTRlOThkZWNjMzQ4MwAAAAGzanVtYgAAAClqdW1kYzJhcwARABCAAACqADibcQNjMnBhLmFzc2VydGlvbnMAAAAA12p1bWIAAAAmanVtZGNib3IAEQAQgAAAqgA4m3EDYzJwYS5hY3Rpb25zAAAAAKljYm9yoWdhY3Rpb25zgaNmYWN0aW9ua2MycGEuZWRpdGVkbXNvZnR3YXJlQWdlbnRtQWRvYmUgRmlyZWZseXFkaWdpdGFsU291cmNlVHlwZXhTaHR0cDovL2N2LmlwdGMub3JnL25ld3Njb2Rlcy9kaWdpdGFsc291cmNldHlwZS9jb21wb3NpdGVXaXRoVHJhaW5lZEFsZ29yaXRobWljTWVkaWEAAACranVtYgAAAChqdW1kY2JvcgARABCAAACqADibcQNjMnBhLmhhc2guZGF0YQAAAAB7Y2JvcqVqZXhjbHVzaW9uc4GiZXN0YXJ0GCFmbGVuZ3RoGTRHZG5hbWVuanVtYmYgbWFuaWZlc3RjYWxnZnNoYTI1NmRoYXNoWCA8Sp/UKNwfpSaECAps33KwU9HDA4nivc1v6TX2weybhWNwYWRIAAAAAAAAAAAAAAIDanVtYgAAACRqdW1kYzJjbAARABCAAACqADibcQNjMnBhLmNsYWltAAAAAddjYm9yqGhkYzp0aXRsZW9HZW5lcmF0ZWQgaW1hZ2VpZGM6Zm9ybWF0aWltYWdlL3BuZ2ppbnN0YW5jZUlEeCh4bXAuaWlkOjRGRDc0NkM5RUU2RjExRUY4MUVFODM1NUYwMzNDRjUwb2NsYWltX2dlbmVyYXRvcng2QWRvYmVfUGhvdG9zaG9wLzI1LjkuMSBhZG9iZV9jMnBhLzAuOS4zIGMycGEtcnMvMC4zMS4wdGNsYWltX2dlbmVyYXRvcl9pbmZvgb9kbmFtZW9BZG9iZSBQaG90b3Nob3BndmVyc2lvbmYyNS45LjH/aXNpZ25hdHVyZXgZc2VsZiNqdW1iZj1j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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9lkBABrfpMDqQLenG6auxQCgiCxGmdWu46tXP3qKjpiZ9bvQvwACrog/S8+1YqKbl8Xmajch0B4rngmUcN/uz+R0YCtL+D2olT/jFJxcZA01JnLJGlaPzwawGN8PlJCZZU5tVR9sn4Z5xaGzfDysn0nOTI4oFPLUi3mZgFnfnCR0bZ4cCnx4AGOW1X4RgqVss8wz0dlGVMpOZVSmHY1QyI6OeWtqrAFVb/TwtRJZqPRbsOg2ILyMbDwpSzF0SrMOa4AYfm7jWIs1lMD9Hvdr8023y4VwA+loPCIkV0b8GUCaO6/+r+LVcx/61wfqDam4t1P7eNYymSmZqTHpCb4I2HhrEP2smwDIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAyIDc5LmE2YTYzOTY4YSwgMjAyNC8wMy8wNi0xMTo1MjowNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozZDNkN2NjZC1iMGYzLTk0NDAtOTE3OS03ZDVlNTFmMzNlNzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEZENzQ2Q0FFRTZGMTFFRjgxRUU4MzU1RjAzM0NGNTAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEZENzQ2QzlFRTZGMTFFRjgxRUU4MzU1RjAzM0NGNTAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZGY3ZDNlM2ItY2Q0MS1jNzRmLWFmNGItMGM1OWE2ZDljNDc2IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OWZiNzU4MGMtMjcyMS01ZDQ3LTllNGItNjJiN2NkMWY3ZGYwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+uK/DewAAA5ZJREFUeNqUVH0o3HEcvnMOo+HOndcTY7j8IUvKSprsZhNjXnIXddmdMd1YussmktE2Mc3Q0FlN864ZVq5m5SRjyTZD2kLHNdzIa17OuD1fZbV5u33q1+/3+748n+f5vFEpFIoP5RTLzc29qtFo5svLyz+ddtaAood5e3vnBwQEyPQ5S8Njf9xmUFCQTWBgoBOXy43QarVqAwODETDdgO0ed4d6lGR/f3+WSCRKZzKZV9bX14eMjY3ZAJk0NTXl0ul0G5VK9Tw1NbVaL8kpKSneMplMQcAWFhbay8rK7tNoNObOzs5KY2PjHTBVOTk53a6vr38BR4YnAhKJwcHBcvItl8sjwPJBTEzMNUg1Y7FY111cXOzxHzU2NpYPtl41NTUvTpTc1NTUAK/ns7OzgzgcjllSUlI7WYfcL5DKxOO4tbX1PTY2VlBQUBCN2N6bmJh4mp6e/uoQQ6lU6kfAxsfHHw8PD68QsM3Nza/FxcUhAoFAFB0dfaOrq+uWiYmJG6TXZ2RktCAMM66urndtbW1NDgFaWlqyV1dX+8hBSCkha3w+P0GpVGoOzpSWlg61trbGE1CxWOyZnJzMh9MR/P/BoYL6Izs7Oz8E3ggeN7CmYzAYvJmZGblEIqkQCoXu4eHhz7CnAYh4bW1NC4Z1UMNB0t4ZGRlZ4i4d+5u9vb0vDQmYhYXFJZ1O9wumQZz263J5eVlN3g4ODna4wCKPlZWVIQHc3t6eBSt3NpsdDqAfB3eQfeV+UpAA07S0tDBzc3MOYvcEsrpJISP48Ue1Xltb2yBRUFlZWYd7kv7+/jewCTDe3teuVquJVAqCK/D09DTv7OyUgAE3Ly8vhKzn5OQoDsBqa2tLyZuEAzUrBsvIgYEBNQH7q2xAm9bS0jIACbPIaBi8S+GAj5L5PDU11Q4HZ52dnW9CukVHR4ewp6dHVVhY2I1O+hgXF5dyqJf39vZ0Xl5ecwAJ5fF49omJiQ89PDymHB0dI62trS+jcy6SLqmoqEiA48nq6ur3VCqVXlJSIpqent44slMyMzPb5+bmGtAVoc3Nza8Rm1Eklkf2SEkhpnG+vr7uJIYAO9PX15eGzC6cOhyKior4bm5uUvJN+hlVcAHZHUW7nYN0j93d3Z8KhUJWVVU1ote0Iebj48NADUahlLSInRAF/G1xcXEQTOezsrLe/tf4+teIRBI/MhhOO2uoxxCmIpMflpaWRvSZ2L8FGABeOLdehmvDYwAAAABJRU5ErkJggg=="
      />
    </defs>
  </svg>
);

export const DocumentIcon: FC<IconProps> = ({ width = 1, height = 1, isButton }) => (
  <svg
    color="currentColor"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.7"
    width="1.3em"
    height="1.3em"
    stroke="currentColor"
    style={{
      overflow: 'visible',
      cursor: isButton ? 'pointer' : 'default',
    }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);

export const ExecutiveSummaryIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    width="2rem"
    height="2rem"
    strokeWidth="1.5"
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);

export const ShieldIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="1em"
    width="1em">
    <path d="M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z"></path>
  </svg>
);

export const MiniTriangleIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="1em"
    width="1em">
    <path d="M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z"></path>
  </svg>
);

export const AimIcon = () => (
  <svg width="117" height="117" viewBox="0 0 117 117" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M53.5737 28.3263C53.5737 28.6715 53.6092 29.0085 53.6768 29.3337C41.2506 31.3731 31.4331 41.162 29.3508 53.5737H4.92632C2.20559 53.5737 0 55.7793 0 58.5C0 61.2207 2.20559 63.4263 4.92632 63.4263H29.3508C31.4282 75.8092 41.2049 85.5812 53.5902 87.6521C53.5792 87.7857 53.5737 87.9212 53.5737 88.0579V112.074C53.5737 114.794 55.7793 117 58.5 117C61.2207 117 63.4263 114.794 63.4263 112.074V88.0579C63.4263 87.9212 63.4208 87.7857 63.4097 87.6521C75.7951 85.5812 85.5719 75.8092 87.649 63.4263H112.074C114.794 63.4263 117 61.2207 117 58.5C117 55.7793 114.794 53.5737 112.074 53.5737H87.649C85.567 41.162 75.7495 31.3731 63.3235 29.3337C63.3906 29.0085 63.4263 28.6715 63.4263 28.3263V4.92632C63.4263 2.20559 61.2207 0 58.5 0C55.7793 0 53.5737 2.20559 53.5737 4.92632V28.3263ZM58.5 80.0526C70.4032 80.0526 80.0526 70.4032 80.0526 58.5C80.0526 46.5968 70.4032 36.9474 58.5 36.9474C46.5968 36.9474 36.9474 46.5968 36.9474 58.5C36.9474 70.4032 46.5968 80.0526 58.5 80.0526ZM93.9978 46.1842C90.167 35.1413 81.3285 26.4392 70.2 22.7947V13.8107C86.0991 17.9616 98.6599 30.3725 103.024 46.1842H93.9978ZM93.9978 70.8158H103.024C98.7166 86.423 86.423 98.7166 70.8158 103.024V93.9978C81.6543 90.2378 90.2378 81.6543 93.9978 70.8158ZM45.5684 102.849V93.778C35.0212 89.9108 26.6907 81.448 23.0024 70.8158H13.9761C18.2268 86.2167 30.2544 98.3915 45.5684 102.849ZM23.0024 46.1842H13.9761C18.2836 30.5772 30.5772 18.2835 46.1842 13.976V23.0024C35.3458 26.7622 26.7622 35.3458 23.0024 46.1842ZM66.5053 58.5C66.5053 62.9214 62.9214 66.5053 58.5 66.5053C54.0788 66.5053 50.4947 62.9214 50.4947 58.5C50.4947 54.0788 54.0788 50.4947 58.5 50.4947C62.9214 50.4947 66.5053 54.0788 66.5053 58.5Z"
    />
  </svg>
);

export const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
    />
  </svg>
);

export const VerificationIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

export const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      d="m11.54 22.351.07.04.028.016a.76.76 0 0 1 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      clipRule="evenodd"
    />
  </svg>
);

export const ProfileIcon: FC<IconProps> = ({ isButton, isVisible }) => (
  <svg
    width="1rem"
    height="1rem"
    viewBox="0 0 20 20"
    version="1.1"
    style={{
      overflow: isVisible ? 'visible' : 'auto',
      cursor: isButton ? 'pointer' : 'default',
    }}>
    <defs></defs>
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="Dribbble-Light-Preview"
        transform="translate(-140.000000, -2159.000000)"
        fill="currentColor">
        <g id="icons" transform="translate(56.000000, 160.000000)">
          <path
            d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598"
            id="profile_round-[#1342]"></path>
        </g>
      </g>
    </g>
  </svg>
);

export const ProviderOrdersIcon: FC<IconProps> = ({ isButton, isVisible }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{
      overflow: isVisible ? 'visible' : 'auto',
      cursor: isButton ? 'pointer' : 'default',
    }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
    />
  </svg>
);

export const ShieldOnIcon: FC<IconProps> = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const ShieldOffIcon: FC<IconProps> = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="m2 2 20 20" />
    <path d="M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71" />
    <path d="M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264" />
  </svg>
);

export const SpaceInvaders: FC<IconProps> = () => (
  <svg viewBox="0 0 24 24" width="256" height="256" stroke="none">
    <path
      fill="currentColor"
      d="M23.5 12H22v-1.5a.5.5 0 0 0-.5-.5H20V8.5a.5.5 0 0 0-.5-.5H18V6h1.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5V5h-1.5a.5.5 0 0 0-.5.5V8H9V5.5a.5.5 0 0 0-.5-.5H7V3.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5H6v2H4.5a.5.5 0 0 0-.5.5V10H2.5a.5.5 0 0 0-.5.5V12H.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V15h1v3.5a.5.5 0 0 0 .5.5H6v1.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H7v-1h10v1h-3.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V19h1.5a.5.5 0 0 0 .5-.5V15h1v3.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5zM9 12.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2zm9 0a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2z"></path>
  </svg>
);

export const WorksIcon: FC<IconProps> = ({ isVisible }) => (
  <svg
    width="1.2rem"
    height="1.2rem"
    viewBox="0 0 24 24"
    fill="none"
    style={{
      overflow: isVisible ? 'visible' : 'auto',
    }}>
    <path
      d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"></path>
    <path
      d="M16 7V4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4V7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"></path>
    <path
      d="M22 12L12.3922 13.9216C12.1333 13.9733 11.8667 13.9733 11.6078 13.9216L2 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"></path>
  </svg>
);

export const ScopeIcon: FC<IconProps> = ({ isButton }) => (
  <svg
    width="1rem"
    height="1rem"
    viewBox="0 0 24 24"
    fill="none"
    style={{
      cursor: isButton ? 'cursor' : 'default',
    }}>
    <path
      d="M8.93796 4.60665C9.87984 4.21607 10.9134 4 12 4C13.0866 4 14.1202 4.21607 15.062 4.60665C15.5722 4.81821 16.1573 4.57614 16.3688 4.06598C16.5804 3.55582 16.3383 2.97075 15.8281 2.7592C14.6477 2.26968 13.3541 2 12 2C10.6459 2 9.35232 2.26968 8.17186 2.7592C7.6617 2.97075 7.41963 3.55582 7.63118 4.06598C7.84274 4.57614 8.4278 4.81821 8.93796 4.60665Z"
      fill="currentColor"
    />
    <path
      d="M4.60665 8.93796C4.81821 8.4278 4.57614 7.84274 4.06598 7.63118C3.55582 7.41963 2.97075 7.6617 2.7592 8.17186C2.26968 9.35232 2 10.6459 2 12C2 13.3541 2.26968 14.6477 2.7592 15.8281C2.97075 16.3383 3.55582 16.5804 4.06598 16.3688C4.57614 16.1573 4.81821 15.5722 4.60665 15.062C4.21607 14.1202 4 13.0866 4 12C4 10.9134 4.21607 9.87984 4.60665 8.93796Z"
      fill="currentColor"
    />
    <path
      d="M21.2408 8.17186C21.0292 7.6617 20.4442 7.41963 19.934 7.63118C19.4239 7.84274 19.1818 8.4278 19.3933 8.93796C19.7839 9.87984 20 10.9134 20 12C20 13.0866 19.7839 14.1202 19.3933 15.062C19.1818 15.5722 19.4239 16.1573 19.934 16.3688C20.4442 16.5804 21.0292 16.3383 21.2408 15.8281C21.7303 14.6477 22 13.3541 22 12C22 10.6459 21.7303 9.35232 21.2408 8.17186Z"
      fill="currentColor"
    />
    <path
      d="M8.93796 19.3933C8.4278 19.1818 7.84274 19.4239 7.63118 19.934C7.41963 20.4442 7.6617 21.0292 8.17186 21.2408C9.35232 21.7303 10.6459 22 12 22C13.3541 22 14.6477 21.7303 15.8281 21.2408C16.3383 21.0292 16.5804 20.4442 16.3688 19.934C16.1573 19.4239 15.5722 19.1818 15.062 19.3933C14.1202 19.7839 13.0866 20 12 20C10.9134 20 9.87984 19.7839 8.93796 19.3933Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z"
      fill="currentColor"
    />
  </svg>
);

export const CredentialIcon: FC<IconProps> = ({ width = '1.5rem', height = '1.5rem' }) => (
  <svg height={height} width={width} viewBox="0 0 32 32" fill="currentColor">
    <path d="m16 22a4 4 0 1 0 -4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1 -2 2 2 2 0 0 1 2-2z" />
    <path d="m14 6h4v2h-4z" />
    <path d="m24 2h-16a2.002 2.002 0 0 0 -2 2v24a2.0023 2.0023 0 0 0 2 2h16a2.0027 2.0027 0 0 0 2-2v-24a2.0023 2.0023 0 0 0 -2-2zm-4 26h-8v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1zm2 0v-2a3 3 0 0 0 -3-3h-6a3 3 0 0 0 -3 3v2h-2v-24h16v24z" />
    <path d="m0 0h32v32h-32z" fill="none" />
  </svg>
);

export const LeadIcon: FC<IconProps> = ({ isVisible }) => (
  <svg
    height="1.25rem"
    width="1.25rem"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{
      overflow: isVisible ? 'visible' : 'auto',
    }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
    />
  </svg>
);
export const UsersIcon: FC<IconProps> = ({ isVisible }) => (
  <svg
    height="1.25rem"
    width="1.25rem"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{
      overflow: isVisible ? 'visible' : 'auto',
    }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
    />
  </svg>
);

export const ImportantIcon: FC<IconProps> = ({ isVisible, className }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    height="1.75rem"
    width="1.75rem"
    className={className}
    strokeWidth={1.5}
    stroke="currentColor"
    style={{
      overflow: isVisible ? 'visible' : 'auto',
    }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
    />
  </svg>
);

export const DocumentTextIcon: FC<IconProps> = ({ isVisible }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    height="1.75rem"
    width="1.75rem"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{
      overflow: isVisible ? 'visible' : 'auto',
    }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);

export const ExitIcon: FC<IconProps> = ({ isVisible }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    height="1.5rem"
    width="1.5rem"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{
      overflow: isVisible ? 'visible' : 'auto',
    }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
    />
  </svg>
);

export const XCircleIcon: FC<IconProps> = ({
  isVisible,
  width = '1.75rem',
  height = '1.75rem',
}) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    height={height}
    width={width}
    strokeWidth={1.5}
    stroke="currentColor"
    style={{
      overflow: isVisible ? 'visible' : 'auto',
    }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

export const CheckCircleIcon: FC<IconProps> = ({ isVisible }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    height="1.75rem"
    width="1.75rem"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{
      overflow: isVisible ? 'visible' : 'auto',
    }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

export const EyeIcon: FC<IconProps> = ({ className }) => (
  <svg
    fill="none"
    height="1.5rem"
    width="1.5rem"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const LockClosedIcon: FC<IconProps> = ({ className }) => (
  <svg
    fill="none"
    height="1.5rem"
    width="1.5rem"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);

export const MagnifyingGlassIcon: FC<IconProps> = () => (
  <svg
    fill="none"
    height="1.25rem"
    width="1.25rem"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

export const CodefendLogo = () => (
  <svg width="1.25rem" height="1.25rem" viewBox="0 0 190 190" fill="none">
    <path
      d="M114 37.0171C132.072 42.9354 146.425 57.0671 152.646 75H167.304C160.217 49.3229 139.819 29.1685 114 22.4276V37.0171Z"
      fill="currentColor"
    />
    <path
      d="M167.304 115H152.646C146.54 132.601 132.601 146.54 115 152.646V167.304C140.345 160.309 160.309 140.345 167.304 115Z"
      fill="currentColor"
    />
    <path
      d="M74 167.02V152.289C56.872 146.009 43.3439 132.266 37.3543 115H22.6962C29.599 140.01 49.131 159.781 74 167.02Z"
      fill="currentColor"
    />
    <path
      d="M22.6962 75H37.3543C43.46 57.3992 57.3992 43.46 75 37.3543V22.6961C49.6553 29.6912 29.6913 49.6553 22.6962 75Z"
      fill="currentColor"
    />
    <path
      d="M108 95C108 102.18 102.18 108 95 108C87.8203 108 82 102.18 82 95C82 87.8203 87.8203 82 95 82C102.18 82 108 87.8203 108 95Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M87.1674 47.6359C87.0577 47.1078 87 46.5606 87 46V8C87 3.58172 90.5817 0 95 0C99.4183 0 103 3.58172 103 8V46C103 46.5606 102.942 47.1078 102.833 47.6359C123.012 50.9478 138.955 66.8442 142.336 87H182C186.418 87 190 90.5817 190 95C190 99.4183 186.418 103 182 103H142.336C138.963 123.109 123.086 138.978 102.973 142.341C102.991 142.558 103 142.778 103 143V182C103 186.418 99.4183 190 95 190C90.5817 190 87 186.418 87 182V143C87 142.778 87.009 142.558 87.0268 142.341C66.914 138.978 51.0373 123.109 47.6637 103H8C3.58172 103 0 99.4183 0 95C0 90.5817 3.58172 87 8 87H47.6637C51.0452 66.8442 66.9881 50.9478 87.1674 47.6359ZM130 95C130 114.33 114.33 130 95 130C75.67 130 60 114.33 60 95C60 75.67 75.67 60 95 60C114.33 60 130 75.67 130 95Z"
      fill="currentColor"
    />
  </svg>
);

export const CubeIcon: FC<IconProps> = ({ className }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    height="1.5rem"
    width="1.5rem"
    style={{ overflow: 'visible' } as any}
    className={className}>
    <path
      fill="white"
      stroke="black"
      stroke-width="30"
      d="M256 64L64 170.7v170.6L256 448l192-106.7V170.7L256 64z"
    />
    <path
      fill="none"
      stroke="black"
      stroke-width="30"
      d="M256 64v384M256 448L64 341.3M256 448l192-106.7"
    />
  </svg>
);

export const ThreeDotsIcon: FC<IconProps> = ({
  className = '',
  width = '1.5rem',
  height = '1.5rem',
}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ThreeDotsVerticalIcon: FC<IconProps> = ({
  className = '',
  width = '1.5rem',
  height = '1.5rem',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

export const LocationOutlineIcon: FC<IconProps> = ({
  className,
  width = '1.2em',
  height = '1.2em',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export const PlusIcon: FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="1.3rem"
    height="1.3rem"
    className={className}>
    <path
      fillRule="evenodd"
      d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

export const FilterIcon: FC<IconProps> = ({ className, width = '1.5rem', height = '1.5rem' }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
    />
  </svg>
);

export const PeopleIcon: FC<IconProps> = ({ className, width = '1.5rem', height = '1.5rem' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
      clipRule="evenodd"
    />
  </svg>
);

export const PeopleIconOutline: FC<IconProps> = ({
  className,
  width = '1.2em',
  height = '1.2em',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

export const UsersGroupOutline: FC<IconProps> = ({
  className,
  width = '1.2em',
  height = '1.2em',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
    <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M17 10h2a2 2 0 0 1 2 2v1" />
    <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
  </svg>
);

export const CreditCardIcon: FC<IconProps> = ({ className, width = '1.2em', height = '1.2em' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
    <path d="M3 10l18 0" />
    <path d="M7 15l.01 0" />
    <path d="M11 15l2 0" />
  </svg>
);

export const GridOutlineIcon: FC<IconProps> = ({
  className,
  width = '1.2em',
  height = '1.2em',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
    <path d="M3 10h18" />
    <path d="M10 3v18" />
  </svg>
);

export const SocialOutlineIcons: FC<IconProps> = ({
  className,
  width = '1.2em',
  height = '1.2em',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M19 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M12 14m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M12 7l0 4" />
    <path d="M6.7 17.8l2.8 -2" />
    <path d="M17.3 17.8l-2.8 -2" />
  </svg>
);

export const DataleakSearchIcon: FC<IconProps> = ({
  className,
  width = '1.2em',
  height = '1.2em',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3" />
    <path d="M4 6v6c0 1.657 3.582 3 8 3m8 -3.5v-5.5" />
    <path d="M4 12v6c0 1.657 3.582 3 8 3" />
    <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M20.2 20.2l1.8 1.8" />
  </svg>
);

export const AskQuestionOutlineIcon: FC<IconProps> = ({
  className,
  width = '1.2em',
  height = '1.2em',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 9h8" />
    <path d="M8 13h6" />
    <path d="M14 18h-1l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" />
    <path d="M19 22v.01" />
    <path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
  </svg>
);

export const DeviceSearchIcon: FC<IconProps> = ({
  className,
  width = '1.2em',
  height = '1.2em',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M11 17h-7a1 1 0 0 1 -1 -1v-12a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v8" />
    <path d="M3 13h10" />
    <path d="M8 21h4" />
    <path d="M10 17l-.5 4" />
    <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M20.2 20.2l1.8 1.8" />
  </svg>
);

export const NetworkOutlineIcon: FC<IconProps> = ({
  className,
  width = '1.2em',
  height = '1.2em',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
    <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
    <line x1="6" x2="6.01" y1="6" y2="6"></line>
    <line x1="6" x2="6.01" y1="18" y2="18"></line>
  </svg>
);

export const NetOutlineIcon: FC<IconProps> = ({ className, width = '1.2em', height = '1.2em' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5.931 6.936l1.275 4.249m5.607 5.609l4.251 1.275" />
    <path d="M11.683 12.317l5.759 -5.759" />
    <path d="M5.5 5.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
    <path d="M18.5 5.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
    <path d="M18.5 18.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
    <path d="M8.5 15.5m-4.5 0a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0" />
  </svg>
);

export const LayoutGridOutlineIcon: FC<IconProps> = ({
  className,
  width = '1.2em',
  height = '1.2em',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
    <path d="M4 13m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
    <path d="M14 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
    <path d="M14 15m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
  </svg>
);

export const OutlineLinkIcon: FC<IconProps> = ({
  className,
  width = '1.2em',
  height = '1.2em',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

export const SparklesIcon: FC<IconProps> = ({ className, width = '1.5rem', height = '1.5rem' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width={width}
    height={height}
    style={{ overflow: 'visible' } as any}>
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
      clipRule="evenodd"
    />
  </svg>
);

export const LinkedinV2Icon: FC<IconProps> = ({ width = '1.2em', height = '1.2em', className }) => (
  <svg
    height={height}
    width={width}
    className={className}
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 382 382">
    <path
      style={{ fill: '#0077B7' }}
      d="M347.445,0H0.555C-18.529,0-34,15.471-34,34.555v312.889C-34,366.529-18.529,382-0.555,382h312.889
	C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056
	H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806
	c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1
	s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73
	c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079
	c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426
	c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472
	L341.91,330.654L341.91,330.654z"
    />
  </svg>
);

export const EmailIcon: FC<IconProps> = ({ width = '1.2em', height = '1.2em', className }) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
