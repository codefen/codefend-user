import { useEffect, useState } from 'react';

interface AnimatedProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export default function AnimatedProgressCircle({
  progress,
  size = 128,
  strokeWidth = 12,
}: AnimatedProgressCircleProps) {
  const [offset, setOffset] = useState(0);
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = circumference * (1 - progress / 100);
    setOffset(progressOffset);
  }, [progress, circumference]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="progressGradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#ef4444" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="90 0.5 0.5"
              to="450 0.5 0.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Círculo de fondo */}
        <circle
          className="text-muted stroke-current"
          strokeWidth={strokeWidth}
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
        />

        {/* Círculo de progreso animado */}
        <circle
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transformOrigin: 'center',
            transform: 'rotate(-90deg)',
            filter: 'url(#glow)',
          }}>
          {/* Animación de "flujo" a lo largo del círculo */}
          <animate
            attributeName="stroke-dashoffset"
            from={offset + 5}
            to={offset - 5}
            dur="1.5s"
            repeatCount="indefinite"
            values={`${offset + 5}; ${offset}; ${offset - 5}; ${offset}`}
            keyTimes="0; 0.25; 0.75; 1"
          />
        </circle>

        {/* Pequeños puntos que se mueven a lo largo del círculo */}
        <circle r={strokeWidth / 3} fill="#ef4444" filter="url(#glow)">
          <animateMotion
            path={`M ${center + radius} ${center} A ${radius} ${radius} 0 1 1 ${center - radius} ${center} A ${radius} ${radius} 0 1 1 ${center + radius} ${center}`}
            dur="2s"
            repeatCount="indefinite"
            rotate="auto"
          />
        </circle>

        <circle r={strokeWidth / 4} fill="#f87171" filter="url(#glow)">
          <animateMotion
            path={`M ${center + radius} ${center} A ${radius} ${radius} 0 1 1 ${center - radius} ${center} A ${radius} ${radius} 0 1 1 ${center + radius} ${center}`}
            dur="2s"
            begin="0.5s"
            repeatCount="indefinite"
            rotate="auto"
          />
        </circle>

        <circle r={strokeWidth / 5} fill="#fecaca" filter="url(#glow)">
          <animateMotion
            path={`M ${center + radius} ${center} A ${radius} ${radius} 0 1 1 ${center - radius} ${center} A ${radius} ${radius} 0 1 1 ${center + radius} ${center}`}
            dur="2s"
            begin="1s"
            repeatCount="indefinite"
            rotate="auto"
          />
        </circle>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
