import { type FC } from 'react';

interface WindowsIconProps {
  size?: string;
  color?: string;
  className?: string;
  title?: string;
}

export const WindowsIcon: FC<WindowsIconProps> = ({
  size = '14px',
  color = '#00ADEF',
  className = '',
  title,
}) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      style={{ width: size, height: size }}
      className={className}>
      {title && <title>{title}</title>}
      <g>
        <g>
          <path
            fill={color}
            d="M30,15H17c-0.6,0-1-0.4-1-1V3.3c0-0.5,0.4-0.9,0.8-1l13-2.3c0.3,0,0.6,0,0.8,0.2C30.9,0.4,31,0.7,31,1v13 C31,14.6,30.6,15,30,15z"
          />
          <path
            fill={color}
            d="M13,15H1c-0.6,0-1-0.4-1-1V6c0-0.5,0.4-0.9,0.8-1l12-2c0.3,0,0.6,0,0.8,0.2C13.9,3.4,14,3.7,14,4v10 C14,14.6,13.6,15,13,15z"
          />
          <path
            fill={color}
            d="M30,32c-0.1,0-0.1,0-0.2,0l-13-2.3c-0.5-0.1-0.8-0.5-0.8-1V18c0-0.6,0.4-1,1-1h13c0.6,0,1,0.4,1,1v13 c0,0.3-0.1,0.6-0.4,0.8C30.5,31.9,30.2,32,30,32z"
          />
          <path
            fill={color}
            d="M13,29c-0.1,0-0.1,0-0.2,0l-12-2C0.4,26.9,0,26.5,0,26v-8c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v10 c0,0.3-0.1,0.6-0.4,0.8C13.5,28.9,13.2,29,13,29z"
          />
        </g>
      </g>
    </svg>
  );
};
