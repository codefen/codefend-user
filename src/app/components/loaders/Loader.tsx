import React from 'react';
import './loaders.scss';

interface OptimizedLoaderProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
  arcLength?: number; // Controla la longitud del arco
  radius?: number;
}

export default function OptimizedLoader({
  size = 130,
  strokeWidth = 8,
  className = '',
  speed = 'slow',
  arcLength = 85,
  radius,
}: OptimizedLoaderProps) {
  // Velocidad de animacion de giro
  const duration = {
    slow: '2s',
    normal: '1.5s',
    fast: '0.8s',
  }[speed];

  // Calculate dimensions
  const center = size / 2;
  const actualRadius = radius || (size - strokeWidth) / 2;

  // Función para calcular puntos en un círculo dado un ángulo
  const pointOnCircle = (angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    return {
      x: center + actualRadius * Math.cos(angleInRadians),
      y: center + actualRadius * Math.sin(angleInRadians),
    };
  };

  // Calcular puntos para el primer arco (de 315° a 0°)
  const arc1Start = pointOnCircle(315 - arcLength / 2);
  const arc1End = pointOnCircle(315 + arcLength / 2);

  // Calcular puntos para el segundo arco (de 75° a 120°)
  const arc2Start = pointOnCircle(75 - arcLength / 2);
  const arc2End = pointOnCircle(75 + arcLength / 2);

  // Calcular puntos para el tercer arco (de 195° a 240°)
  const arc3Start = pointOnCircle(195 - arcLength / 2);
  const arc3End = pointOnCircle(195 + arcLength / 2);

  return (
    <div className={`${className} big-spinner`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="loader-spin"
        style={{ animationDuration: duration }}>
        <defs>
          {/* Gradient for the first arc - from faded to bright red */}
          <linearGradient id="redGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 0, 0, 0.2)" />
            <stop offset="100%" stopColor="rgba(255, 0, 0, 1)" />
          </linearGradient>

          {/* Gradient for the second arc - from bright to faded red */}
          <linearGradient id="redGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 0, 0, 1)" />
            <stop offset="100%" stopColor="rgba(255, 0, 0, 0.2)" />
          </linearGradient>

          {/* Gradient for the third arc - from faded to bright red, adjusted distribution */}
          <linearGradient id="redGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 0, 0, 0.2)" />
            <stop offset="30%" stopColor="rgba(255, 0, 0, 0.4)" />
            <stop offset="60%" stopColor="rgba(255, 0, 0, 0.8)" />
            <stop offset="80%" stopColor="rgba(255, 0, 0, 1)" />
          </linearGradient>
        </defs>

        <g>
          {/* First segment at 0° (right) */}
          <path
            d={`M ${arc1Start.x} ${arc1Start.y}
                A ${actualRadius} ${actualRadius} 0 0 1 
                ${arc1End.x} ${arc1End.y}`}
            fill="none"
            stroke="url(#redGradient1)"
            strokeWidth={strokeWidth}
            strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${center} ${center}`}
              to={`0 ${center} ${center}`}
              dur="0s"
              repeatCount="1"
            />
          </path>
          {/* Second segment at 75° */}
          <path
            d={`M ${arc2Start.x} ${arc2Start.y}
                A ${actualRadius} ${actualRadius} 0 0 1 
                ${arc2End.x} ${arc2End.y}`}
            fill="none"
            stroke="url(#redGradient2)"
            strokeWidth={strokeWidth}
            strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`120 ${center} ${center}`}
              to={`120 ${center} ${center}`}
              dur="0s"
              repeatCount="1"
            />
          </path>

          {/* Third segment at 195° */}
          <path
            d={`M ${arc3Start.x} ${arc3Start.y}
                A ${actualRadius} ${actualRadius} 0 0 1 
                ${arc3End.x} ${arc3End.y}`}
            fill="none"
            stroke="url(#redGradient3)"
            strokeWidth={strokeWidth}
            strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`230 ${center} ${center}`}
              to={`230 ${center} ${center}`}
              dur="0s"
              repeatCount="1"
            />
          </path>
        </g>
      </svg>
    </div>
  );
}

export const SpinnerV2: React.FC<{ icon: string }> = ({ icon }) => (
  <div className={`dotted-spinner ${icon}`}>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
    <div className="dotted-spinner-dot"></div>
  </div>
);

const OrbitSpinner: React.FC<{ icon: string }> = ({ icon }) => (
  <aside className={`ball-spinner ${icon}`}>
    <div className="ball-spinner-dot"></div>
    <div className="ball-spinner-dot"></div>
  </aside>
);

export const ButtonLoader: React.FC<{ left?: any; right?: any }> = ({
  left = '7%',
  right = 'inherit',
}) => {
  return (
    <div
      className="button-loader"
      style={
        {
          '--pos-left': left!,
          '--pos-right': right!,
        } as any
      }></div>
  );
};

export const Loader = () => {
  return (
    <div className="loader loader-screen">
      <OrbitSpinner icon="icon" />
    </div>
  );
};

export const PageOrbitLoader = () => {
  return (
    <div className="loader loader-full">
      <SpinnerV2 icon="small-icon" />
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="loader loader-full">
      <OrbitSpinner icon="small-icon" />
    </div>
  );
};

export const PageLoaderWhite = () => {
  return (
    <div className="loader loader-full">
      <OrbitSpinner icon="icon" />
    </div>
  );
};

export const PageLoaderOverlay = () => {
  return (
    <div className="loader loader-full overlay">
      <OrbitSpinner icon="small-icon" />
    </div>
  );
};
