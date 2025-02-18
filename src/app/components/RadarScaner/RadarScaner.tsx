import { useEffect, useRef } from 'react';
import css from './radarscanner.module.scss';

interface RadarPoint {
  x: number;
  y: number;
  opacity: number;
}

export function RadarScanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<RadarPoint[]>([]);
  const angle = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 225;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;

    points.current = Array(3)
      .fill(0)
      .map(() => ({
        x: Math.random() * (size - 100) + 50,
        y: Math.random() * (size - 100) + 50,
        opacity: 0,
      }));

    const drawGrid = () => {
      const gridSize = 20; // Tamaño de cada cuadro de la grilla
      const gridOpacity = 0.12; // Opacidad base de las líneas

      // Aseguramos líneas nítidas
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(255, 48, 48, ${gridOpacity})`;

      // Dibujamos las líneas verticales
      for (let x = 0; x <= size; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
      }

      // Dibujamos las líneas horizontales
      for (let y = 0; y <= size; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
      }
    };

    const drawCrosshair = () => {
      const verticalGradient = ctx.createLinearGradient(centerX, 0, centerX, size);
      verticalGradient.addColorStop(0, 'rgba(255, 48, 48, 0)');
      verticalGradient.addColorStop(0.4, 'rgba(255, 48, 48, 0.4)');
      verticalGradient.addColorStop(0.5, 'rgba(255, 48, 48, 0.8)');
      verticalGradient.addColorStop(0.6, 'rgba(255, 48, 48, 0.4)');
      verticalGradient.addColorStop(1, 'rgba(255, 48, 48, 0)');

      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, size);
      ctx.strokeStyle = verticalGradient;
      ctx.lineWidth = 1;
      ctx.stroke();

      const horizontalGradient = ctx.createLinearGradient(0, centerY, size, centerY);
      horizontalGradient.addColorStop(0, 'rgba(255, 48, 48, 0)');
      horizontalGradient.addColorStop(0.4, 'rgba(255, 48, 48, 0.4)');
      horizontalGradient.addColorStop(0.5, 'rgba(255, 48, 48, 0.8)');
      horizontalGradient.addColorStop(0.6, 'rgba(255, 48, 48, 0.4)');
      horizontalGradient.addColorStop(1, 'rgba(255, 48, 48, 0)');

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(size, centerY);
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
      ctx.arc(0, 0, size / 2, -coneAngle, coneAngle);
      ctx.lineTo(0, 0);
      ctx.fillStyle = coneGradient;
      ctx.fill();

      const depthGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
      depthGradient.addColorStop(0, 'rgba(255, 48, 48, 0.8)');
      depthGradient.addColorStop(0.2, 'rgba(255, 48, 48, 0.6)');
      depthGradient.addColorStop(1, 'rgba(255, 48, 48, 0)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -coneAngle, coneAngle);
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
        { radius: size * 0.11, opacity: 0.6 }, // Círculo interno
        { radius: size * 0.22, opacity: 0.5 }, // Segundo círculo
        { radius: size * 0.31, opacity: 0.4 }, // Tercer círculo
        { radius: size * 0.42, opacity: 0.15 }, // Círculo externo (muy separado)
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
      ctx.clearRect(0, 0, size, size);

      // Capa externa muy sutil
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        size * 0.35,
        centerX,
        centerY,
        size / 2
      );
      outerGlow.addColorStop(0, 'rgba(255, 60, 35, 0.06)');
      outerGlow.addColorStop(0.7, 'rgba(255, 60, 35, 0.02)');
      outerGlow.addColorStop(1, 'rgba(255, 60, 35, 0.01)');

      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, size, size);

      // Capa interna más intensa y grande
      const innerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        size * 0.35
      );
      innerGlow.addColorStop(0, 'rgba(255, 60, 35, 0.5)'); // Más intenso en el centro
      innerGlow.addColorStop(0.5, 'rgba(255, 60, 35, 0.3)'); // Mantiene la intensidad
      innerGlow.addColorStop(0.8, 'rgba(255, 60, 35, 0.15)'); // Transición suave
      innerGlow.addColorStop(1, 'rgba(255, 60, 35, 0.06)');

      ctx.fillStyle = innerGlow;
      ctx.fillRect(0, 0, size, size);

      // Se pinta primero la grilla para que este por debajo del resto
      drawGrid();
      // Se dibujan los componentes del radar
      drawRings();
      drawCrosshair();
      drawScanningCone();

      // Enhanced point rendering
      points.current.forEach((point, index) => {
        const dx = point.x - centerX;
        const dy = point.y - centerY;
        const pointAngle = Math.atan2(dy, dx);

        let normalizedScanAngle = angle.current % (Math.PI * 2);
        if (normalizedScanAngle < 0) normalizedScanAngle += Math.PI * 2;

        let normalizedPointAngle = pointAngle;
        if (normalizedPointAngle < 0) normalizedPointAngle += Math.PI * 2;

        const diff = Math.abs(normalizedScanAngle - normalizedPointAngle);
        if (diff < 0.2 || diff > Math.PI * 2 - 0.2) {
          points.current[index].opacity = 1;
        }

        if (point.opacity > 0) {
          // Enhanced point glow
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

          points.current[index].opacity *= 0.997;
        }
      });

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
    </div>
  );
}
