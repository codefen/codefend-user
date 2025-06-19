import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import css from './radarscanner.module.scss';
import Show from '@/app/views/components/Show/Show';

interface RadarPoint {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  opacity: number;
  detected: boolean;
  rotation: number;
}

const SIZE = 200;
const GRID_SIZE = 20;
const GRID_OPACITY = 0.12;
const CONE_ANGLE = Math.PI / 8;
const SCAN_SPEED = 0.0085;
const MIN_RADIUS_FACTOR = 0.2;
const MAX_RADIUS_FACTOR = 0.4;
const MIN_DISTANCE_FACTOR = 0.2;
const MAX_ATTEMPTS = 100;

const RINGS = [
  { radius: SIZE * 0.11, opacity: 0.6 },
  { radius: SIZE * 0.22, opacity: 0.5 },
  { radius: SIZE * 0.31, opacity: 0.4 },
  { radius: SIZE * 0.42, opacity: 0.15 },
] as const;

const generatePoissonPoint = (
  centerX: number,
  centerY: number,
  maxRadius: number,
  minRadius: number
): { x: number; y: number } => {
  // Comenzar con una posición aleatoria en un anillo
  const angle = Math.random() * Math.PI * 2,
    radius = minRadius + Math.random() * (maxRadius - minRadius);
  return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
};

const generateDistributedPoints = (count: number, centerX: number, centerY: number) => {
  const points: RadarPoint[] = [];
  const minRadius = SIZE * 0.2;
  const maxRadius = SIZE * 0.4;
  const maxAttempts = 100; // Número máximo de intentos para colocar un punto
  const minDistance = SIZE * 0.2; // Distancia mínima entre puntos

  const isValidPoint = (x: number, y: number): boolean => {
    const minDistanceSquared = minDistance * minDistance;
    return points.every(point => {
      const dx = point.x - x;
      const dy = point.y - y;
      return dx * dx + dy * dy >= minDistanceSquared;
    });
  };

  // Estrategia de retroceso adaptativo
  let globalAttempts = 0;
  const maxGlobalAttempts = count * maxAttempts * 2;

  for (let i = 0; i < count; i++) {
    let attempts = 0,
      point;

    while (attempts < maxAttempts && !point) {
      const candidate = generatePoissonPoint(centerX, centerY, maxRadius, minRadius);
      if (isValidPoint(candidate.x, candidate.y)) {
        point = candidate;
      }
      attempts++;
      globalAttempts++;

      // Si estamos teniendo problemas para colocar puntos, reducir temporalmente
      // la distancia mínima para los últimos intentos
      if (attempts > maxAttempts * 0.8 && i > count * 0.5) {
        const relaxedDistance = minDistance * 0.85;
        const relaxedDistanceSquared = relaxedDistance * relaxedDistance;

        if (
          points.every(p => {
            const dx = p.x - candidate.x;
            const dy = p.y - candidate.y;
            return dx * dx + dy * dy >= relaxedDistanceSquared;
          })
        ) {
          point = candidate;
        }
      }
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
      // En lugar de mostrar una advertencia, intentemos con otro punto
      i--; // Reintentamos este índice

      // Pero no lo hacemos indefinidamente para evitar bucles infinitos
      if (globalAttempts > maxGlobalAttempts * 0.9) {
        console.warn(
          `No se pudieron colocar todos los puntos. Generados: ${points.length} de ${count}`
        );
        break;
      }
    }
  }

  return points;
};

export function RadarScanner({ notBichardos = false }: { notBichardos?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<RadarPoint[]>([]);
  const angleRef = useRef(0);
  const animationIdRef = useRef<number | null>(null);
  const isDestroyedRef = useRef(false);

  // Valores calculados una sola vez
  const centerX = useMemo(() => SIZE / 2, []);
  const centerY = useMemo(() => SIZE / 2, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = `rgba(255, 48, 48, ${GRID_OPACITY})`;

    // Dibujar líneas verticales y horizontales en un solo loop
    ctx.beginPath();
    for (let i = 0; i <= SIZE; i += GRID_SIZE) {
      // Líneas verticales
      ctx.moveTo(i, 0);
      ctx.lineTo(i, SIZE);
      // Líneas horizontales
      ctx.moveTo(0, i);
      ctx.lineTo(SIZE, i);
    }
    ctx.stroke();
  }, []);

  const drawCrosshair = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Gradiente vertical
      const verticalGradient = ctx.createLinearGradient(centerX, 0, centerX, SIZE);
      verticalGradient.addColorStop(0, 'rgba(255, 48, 48, 0)');
      verticalGradient.addColorStop(0.4, 'rgba(255, 48, 48, 0.4)');
      verticalGradient.addColorStop(0.5, 'rgba(255, 48, 48, 0.8)');
      verticalGradient.addColorStop(0.6, 'rgba(255, 48, 48, 0.4)');
      verticalGradient.addColorStop(1, 'rgba(255, 48, 48, 0)');

      // Gradiente horizontal
      const horizontalGradient = ctx.createLinearGradient(0, centerY, SIZE, centerY);
      horizontalGradient.addColorStop(0, 'rgba(255, 48, 48, 0)');
      horizontalGradient.addColorStop(0.4, 'rgba(255, 48, 48, 0.4)');
      horizontalGradient.addColorStop(0.5, 'rgba(255, 48, 48, 0.8)');
      horizontalGradient.addColorStop(0.6, 'rgba(255, 48, 48, 0.4)');
      horizontalGradient.addColorStop(1, 'rgba(255, 48, 48, 0)');

      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, SIZE);
      ctx.strokeStyle = verticalGradient;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(SIZE, centerY);
      ctx.strokeStyle = horizontalGradient;
      ctx.stroke();

      // Centro
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 48, 48, 0.4)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 48, 48, 0.9)';
      ctx.fill();
    },
    [centerX, centerY]
  );

  const drawScanningCone = useCallback(
    (ctx: CanvasRenderingContext2D, angle: number) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      const coneGradient = ctx.createConicGradient(-CONE_ANGLE, 0, 0);
      coneGradient.addColorStop(0, 'rgba(255, 48, 48, 0)');
      coneGradient.addColorStop(0.2, 'rgba(255, 48, 48, 0.8)');
      coneGradient.addColorStop(0.5, 'rgba(255, 48, 48, 1)');
      coneGradient.addColorStop(0.8, 'rgba(255, 48, 48, 0.8)');
      coneGradient.addColorStop(1, 'rgba(255, 48, 48, 0)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, SIZE / 2, -CONE_ANGLE, CONE_ANGLE);
      ctx.closePath();
      ctx.fillStyle = coneGradient;
      ctx.fill();

      const depthGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, SIZE / 2);
      depthGradient.addColorStop(0, 'rgba(255, 48, 48, 0.8)');
      depthGradient.addColorStop(0.2, 'rgba(255, 48, 48, 0.6)');
      depthGradient.addColorStop(1, 'rgba(255, 48, 48, 0)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, SIZE / 2, -CONE_ANGLE, CONE_ANGLE);
      ctx.closePath();
      ctx.fillStyle = depthGradient;
      ctx.fill();

      // Centro brillante
      const centerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
      centerGlow.addColorStop(0, 'rgba(255, 48, 48, 0.4)');
      centerGlow.addColorStop(1, 'rgba(255, 48, 48, 0)');

      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow;
      ctx.fill();

      ctx.restore();
    },
    [centerX, centerY]
  );

  const drawRings = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      RINGS.forEach(({ radius, opacity }) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 60, 35, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

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
    },
    [centerX, centerY]
  );

  const drawPoints = useCallback((ctx: CanvasRenderingContext2D, points: RadarPoint[]) => {
    points.forEach(point => {
      if (point.opacity > 0) {
        const pointGlow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 20);
        pointGlow.addColorStop(0, `rgba(255, 48, 48, ${point.opacity * 0.8})`);
        pointGlow.addColorStop(1, 'rgba(255, 48, 48, 0)');

        ctx.beginPath();
        ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = pointGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 48, 48, ${point.opacity * 0.9})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 48, 48, ${point.opacity})`;
        ctx.fill();
      }
    });
  }, []);

  const animate = useCallback(() => {
    if (isDestroyedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Dibujar capas de fondo
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

    const innerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, SIZE * 0.35);
    innerGlow.addColorStop(0, 'rgba(255, 60, 35, 0.5)');
    innerGlow.addColorStop(0.5, 'rgba(255, 60, 35, 0.3)');
    innerGlow.addColorStop(0.8, 'rgba(255, 60, 35, 0.15)');
    innerGlow.addColorStop(1, 'rgba(255, 60, 35, 0.06)');
    ctx.fillStyle = innerGlow;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Dibujar elementos del radar
    drawGrid(ctx);
    drawRings(ctx);
    if (notBichardos) drawPoints(ctx, pointsRef.current);
    drawCrosshair(ctx);
    drawScanningCone(ctx, angleRef.current);

    // Actualizar puntos - optimizado para evitar copias innecesarias
    const currentAngle = angleRef.current;
    const normalizedScanAngle = ((currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    pointsRef.current.forEach(point => {
      const dx = point.x - centerX;
      const dy = point.y - centerY;
      const pointAngle = Math.atan2(dy, dx);
      const normalizedPointAngle = ((pointAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

      const diff = Math.abs(normalizedScanAngle - normalizedPointAngle);
      const isInScanRange = diff < 0.2 || diff > Math.PI * 2 - 0.2;

      if (isInScanRange) {
        const moveRange = notBichardos ? 0 : 2;
        point.x = point.originalX + (Math.random() - 0.5) * moveRange;
        point.y = point.originalY + (Math.random() - 0.5) * moveRange;
        point.opacity = 1;
        point.detected = true;
        point.rotation += (Math.random() - 0.5) * 20;
      } else if (point.opacity > 0) {
        const returnSpeed = notBichardos ? 0 : 0.05;
        point.x += (point.originalX - point.x) * returnSpeed;
        point.y += (point.originalY - point.y) * returnSpeed;
        point.opacity = Math.max(point.opacity * 0.98, 0.1);
        point.detected = point.opacity > 0.5;
      }
    });

    angleRef.current += SCAN_SPEED;

    // Continuar animación solo si el componente no ha sido destruido
    if (!isDestroyedRef.current) {
      animationIdRef.current = requestAnimationFrame(animate);
    }
  }, [
    centerX,
    centerY,
    notBichardos,
    drawGrid,
    drawRings,
    drawPoints,
    drawCrosshair,
    drawScanningCone,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Configurar canvas
    canvas.width = SIZE;
    canvas.height = SIZE;

    // Generar puntos una sola vez
    pointsRef.current = generateDistributedPoints(3, centerX, centerY);

    // Iniciar animación
    isDestroyedRef.current = false;
    animate();

    // Cleanup
    return () => {
      isDestroyedRef.current = true;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [centerX, centerY, animate]);

  return (
    <div className={`radar-scanner ${css['radar-container']}`}>
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
      <Show when={!notBichardos}>
        <div className={css['radar-bichardos-container']}>
          {pointsRef.current.map((point, index) => (
            <div
              key={index}
              className={`${css['radar-bichardo-content']} ${point.detected ? css['animate-detected'] : ''}`}
              style={{
                left: `${(point.x / SIZE) * 100}%`,
                top: `${(point.y / SIZE) * 100}%`,
                opacity: point.opacity,
                transform: `translate(-50%, -50%) scale(${point.detected ? 1.05 : 1}) rotate(${point.rotation}deg)`,
              }}>
              <div className={`${css['radar-bichardo']}`}>
                <div
                  className={`${css['radar-bichardo-glow']} ${point.detected ? css['animate-detected'] : ''}`}
                  style={{
                    opacity: point.opacity * 0.7,
                  }}
                />
                <img
                  src={index % 2 === 0 ? '/codefend/Bichardo-3.png' : '/codefend/Bichardo-1.png'}
                  alt="Bug"
                  className={css['bichardo']}
                  width={36}
                  height={36}
                  style={{
                    filter: `brightness(${1 + point.opacity * 0.3})`,
                    transform: `scale(${1 + point.opacity * 0.1})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Show>
    </div>
  );
}
