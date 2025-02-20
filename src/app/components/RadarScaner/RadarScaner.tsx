import { useEffect, useRef, useState } from 'react';
import css from './radarscanner.module.scss';

interface RadarPoint {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  opacity: number;
  detected: boolean;
  rotation: number;
}

const SIZE = 225;

const generateDistributedPoints = (
  count: number,
  centerX: number,
  centerY: number
): RadarPoint[] => {
  const points: RadarPoint[] = [];
  //const angleStep = (2 * Math.PI) / count;
  //const minRadius = SIZE * 0.15; // Radio mínimo para evitar el centro
  //const maxRadius = SIZE * 0.385; // Radio máximo para evitar los bordes
  const minDistance = SIZE * 0.2; // Distancia mínima entre puntos
  const maxAttempts = 50; // Número máximo de intentos para colocar un punto

  const generatePoint = (): { x: number; y: number } => {
    const angle = Math.random() * 2 * Math.PI;
    const minRadius = SIZE * 0.2;
    const maxRadius = SIZE * 0.4;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const isValidPoint = (x: number, y: number): boolean => {
    return points.every(point => {
      const dx = point.x - x;
      const dy = point.y - y;
      return Math.sqrt(dx * dx + dy * dy) >= minDistance;
    });
  };

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let point: { x: number; y: number } | null = null;

    while (attempts < maxAttempts && !point) {
      const candidate = generatePoint();
      if (isValidPoint(candidate.x, candidate.y)) {
        point = candidate;
      }
      attempts++;
    }

    if (point) {
      points.push({
        x: point.x,
        y: point.y,
        originalX: point.x,
        originalY: point.y,
        opacity: 0,
        detected: false,
        rotation: Math.random() * 360,
      });
    } else {
      console.warn(`No se pudo colocar el punto ${i + 1} después de ${maxAttempts} intentos`);
    }
  }

  return points;
};

export function RadarScanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<RadarPoint[]>([]);
  const angle = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = SIZE;
    canvas.height = SIZE;
    const centerX = SIZE / 2;
    const centerY = SIZE / 2;

    setPoints(generateDistributedPoints(3, centerX, centerY));

    const drawGrid = () => {
      const gridSize = 20; // Tamaño de cada cuadro de la grilla
      const gridOpacity = 0.12; // Opacidad base de las líneas

      // Aseguramos líneas nítidas
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(255, 48, 48, ${gridOpacity})`;

      // Dibujamos las líneas verticales
      for (let x = 0; x <= SIZE; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, SIZE);
        ctx.stroke();
      }

      // Dibujamos las líneas horizontales
      for (let y = 0; y <= SIZE; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(SIZE, y);
        ctx.stroke();
      }
    };

    const drawCrosshair = () => {
      const verticalGradient = ctx.createLinearGradient(centerX, 0, centerX, SIZE);
      verticalGradient.addColorStop(0, 'rgba(255, 48, 48, 0)');
      verticalGradient.addColorStop(0.4, 'rgba(255, 48, 48, 0.4)');
      verticalGradient.addColorStop(0.5, 'rgba(255, 48, 48, 0.8)');
      verticalGradient.addColorStop(0.6, 'rgba(255, 48, 48, 0.4)');
      verticalGradient.addColorStop(1, 'rgba(255, 48, 48, 0)');

      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, SIZE);
      ctx.strokeStyle = verticalGradient;
      ctx.lineWidth = 1;
      ctx.stroke();

      const horizontalGradient = ctx.createLinearGradient(0, centerY, SIZE, centerY);
      horizontalGradient.addColorStop(0, 'rgba(255, 48, 48, 0)');
      horizontalGradient.addColorStop(0.4, 'rgba(255, 48, 48, 0.4)');
      horizontalGradient.addColorStop(0.5, 'rgba(255, 48, 48, 0.8)');
      horizontalGradient.addColorStop(0.6, 'rgba(255, 48, 48, 0.4)');
      horizontalGradient.addColorStop(1, 'rgba(255, 48, 48, 0)');

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(SIZE, centerY);
      ctx.strokeStyle = horizontalGradient;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Enhanced center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 48, 48, 0.9)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 48, 48, 0.4)';
      ctx.fill();
    };

    const drawScanningCone = () => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle.current);

      const coneAngle = Math.PI / 8;

      const coneGradient = ctx.createConicGradient(-coneAngle, 0, 0);

      // Enhanced cone colors
      coneGradient.addColorStop(0, 'rgba(255, 48, 48, 0)');
      coneGradient.addColorStop(0.2, 'rgba(255, 48, 48, 0.8)');
      coneGradient.addColorStop(0.5, 'rgba(255, 48, 48, 1)');
      coneGradient.addColorStop(0.8, 'rgba(255, 48, 48, 0.8)');
      coneGradient.addColorStop(1, 'rgba(255, 48, 48, 0)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, SIZE / 2, -coneAngle, coneAngle);
      ctx.lineTo(0, 0);
      ctx.fillStyle = coneGradient;
      ctx.fill();

      const depthGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, SIZE / 2);
      depthGradient.addColorStop(0, 'rgba(255, 48, 48, 0.8)');
      depthGradient.addColorStop(0.2, 'rgba(255, 48, 48, 0.6)');
      depthGradient.addColorStop(1, 'rgba(255, 48, 48, 0)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, SIZE / 2, -coneAngle, coneAngle);
      ctx.lineTo(0, 0);
      ctx.fillStyle = depthGradient;
      ctx.fill();

      // Enhanced center glow
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      const centerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
      centerGlow.addColorStop(0, 'rgba(255, 48, 48, 0.4)');
      centerGlow.addColorStop(1, 'rgba(255, 48, 48, 0)');
      ctx.fillStyle = centerGlow;
      ctx.fill();

      ctx.restore();
    };

    const drawRings = () => {
      // Enhanced radar circles
      const RINGS = [
        { radius: SIZE * 0.11, opacity: 0.6 }, // Círculo interno
        { radius: SIZE * 0.22, opacity: 0.5 }, // Segundo círculo
        { radius: SIZE * 0.31, opacity: 0.4 }, // Tercer círculo
        { radius: SIZE * 0.42, opacity: 0.15 }, // Círculo externo (muy separado)
      ];

      RINGS.forEach(({ radius, opacity }) => {
        // Círculo principal
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 60, 35, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Efecto de brillo más sutil
        const circleGlow = ctx.createRadialGradient(
          centerX,
          centerY,
          radius - 1,
          centerX,
          centerY,
          radius + 1
        );
        circleGlow.addColorStop(0, `rgba(255, 60, 35, ${opacity * 0.6})`);
        circleGlow.addColorStop(1, 'rgba(255, 60, 35, 0)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = circleGlow;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    };

    const drawRadar = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Capa externa muy sutil
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        SIZE * 0.35,
        centerX,
        centerY,
        SIZE / 2
      );
      outerGlow.addColorStop(0, 'rgba(255, 60, 35, 0.06)');
      outerGlow.addColorStop(0.7, 'rgba(255, 60, 35, 0.02)');
      outerGlow.addColorStop(1, 'rgba(255, 60, 35, 0.01)');

      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Capa interna más intensa y grande
      const innerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        SIZE * 0.35
      );
      innerGlow.addColorStop(0, 'rgba(255, 60, 35, 0.5)'); // Más intenso en el centro
      innerGlow.addColorStop(0.5, 'rgba(255, 60, 35, 0.3)'); // Mantiene la intensidad
      innerGlow.addColorStop(0.8, 'rgba(255, 60, 35, 0.15)'); // Transición suave
      innerGlow.addColorStop(1, 'rgba(255, 60, 35, 0.06)');

      ctx.fillStyle = innerGlow;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Se pinta primero la grilla para que este por debajo del resto
      drawGrid();
      // Se dibujan los componentes del radar
      drawRings();
      drawCrosshair();
      drawScanningCone();

      // Genera la posicion, rotacion de los bichos y activa la deteccion si el cono pasar por encima
      setPoints(prevPoints =>
        prevPoints.map(point => {
          const dx = point.x - centerX;
          const dy = point.y - centerY;
          const pointAngle = Math.atan2(dy, dx);

          let normalizedScanAngle = angle.current % (Math.PI * 2);
          if (normalizedScanAngle < 0) normalizedScanAngle += Math.PI * 2;

          let normalizedPointAngle = pointAngle;
          if (normalizedPointAngle < 0) normalizedPointAngle += Math.PI * 2;

          const diff = Math.abs(normalizedScanAngle - normalizedPointAngle);

          if (diff < 0.2 || diff > Math.PI * 2 - 0.2) {
            // Añade un pequeño movimiento cuando el radar pasa por encima
            const moveRange = 2; // Rango de movimiento
            const newX = point.originalX + (Math.random() - 0.5) * moveRange;
            const newY = point.originalY + (Math.random() - 0.5) * moveRange;
            return {
              ...point,
              x: newX,
              y: newY,
              opacity: 1,
              detected: true,
              rotation: point.rotation + (Math.random() - 0.5) * 20,
            };
          }

          if (point.opacity > 0) {
            // Volver gradualmente a la posición original
            const returnSpeed = 0.05; // Velocidad de retorno lenta (para un movimiento más suave)
            const newX = point.x + (point.originalX - point.x) * returnSpeed;
            const newY = point.y + (point.originalY - point.y) * returnSpeed;
            return {
              ...point,
              x: newX,
              y: newY,
              opacity: point.opacity * 0.995,
              detected: point.opacity > 0.1,
            };
          }

          return point;
        })
      );

      angle.current += 0.01;
      return requestAnimationFrame(drawRadar);
    };

    const frameId = drawRadar();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className={css['radar-container']}>
      <div className={css['radar-animation']} />
      <canvas
        ref={canvasRef}
        className={css['radar-canvas']}
        style={{
          width: '225px',
          height: '225px',
          filter: 'blur(0.5px)',
        }}
      />
      <div className={css['radar-bichardos-container']}>
        {points.map((point, index) => (
          <div
            key={index}
            className={`${css['radar-bichardo-content']} ${point.detected ? css['animate-detected'] : ''}`}
            style={{
              left: point.x - 16,
              top: point.y - 16,
              opacity: point.opacity,
              transform: `
                  scale(${point.detected ? 1.05 : 1})
                  rotate(${point.rotation}deg)
                `,
            }}>
            <div className={`${css['radar-bichardo']}`}>
              <div
                className={`
                    ${css['radar-bichardo-common']} ${css['radar-bichardo-blur']}
                    ${point.detected ? css['animate-glow'] : ''}
                  `}
              />
              {/* Efecto de detección */}
              {point.detected && (
                <>
                  {/* Anillo de detección */}
                  <div
                    className={`${css['radar-bichardo-common']} ${css['radar-bichardo-blur']} ${css['animate-ping']}`}
                  />
                  {/* Brillo central */}
                  <div
                    className={`${css['radar-bichardo-common']} ${css['radar-bichardo-blur']} ${css['animate-pulse']}`}
                  />

                  {/* Destellos */}
                  <div className={css['radar-bichardo-common']}>
                    <div
                      className={`${css['radar-details']} ${css['radar-bichardo-blur']} ${css['animate-flash']}`}
                    />
                    <div
                      className={`${css['radar-details']} ${css['radar-bichardo-blur']} ${css['animate-flash-delayed']}`}
                    />
                  </div>
                </>
              )}

              <img
                src={index % 2 === 0 ? '/codefend/Bichardo-3.png' : '/codefend/Bichardo-1.png'}
                alt="Bug"
                className={css['bichardo']}
                width={36}
                height={36}
                style={{
                  filter: point.detected ? 'brightness(1.2)' : 'brightness(1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
