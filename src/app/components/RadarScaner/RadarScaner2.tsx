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

    const size = 250;
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
      const gridSize = 20;
      const gridOpacity = 0.12;

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(255, 48, 48, ${gridOpacity})`;

      for (let x = 0; x <= size; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
      }

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

      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      const centerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
      centerGlow.addColorStop(0, 'rgba(255, 48, 48, 0.4)');
      centerGlow.addColorStop(1, 'rgba(255, 48, 48, 0)');
      ctx.fillStyle = centerGlow;
      ctx.fill();

      ctx.restore();
    };

    const drawRadar = () => {
      ctx.clearRect(0, 0, size, size);

      // Capa externa muy sutil
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        size * 0.28,
        centerX,
        centerY,
        size / 2
      );
      outerGlow.addColorStop(0, 'rgba(255, 48, 48, 0.08)');
      outerGlow.addColorStop(0.7, 'rgba(255, 48, 48, 0.03)');
      outerGlow.addColorStop(1, 'rgba(255, 48, 48, 0.01)');

      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, size, size);

      // Capa interna más intensa
      const innerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        size * 0.28
      );
      innerGlow.addColorStop(0, 'rgba(255, 48, 48, 0.3)');
      innerGlow.addColorStop(0.7, 'rgba(255, 48, 48, 0.15)');
      innerGlow.addColorStop(1, 'rgba(255, 48, 48, 0.08)');

      ctx.fillStyle = innerGlow;
      ctx.fillRect(0, 0, size, size);

      drawGrid();

      // Círculos concéntricos con espaciado mejorado
      const circles = [
        { radius: size * 0.12, opacity: 0.5 }, // Círculo interno
        { radius: size * 0.2, opacity: 0.45 }, // Segundo círculo
        { radius: size * 0.28, opacity: 0.35 }, // Tercer círculo
        { radius: size * 0.43, opacity: 0.15 }, // Círculo externo (muy separado)
      ];

      circles.forEach(({ radius, opacity }) => {
        // Círculo principal
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 48, 48, ${opacity})`;
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
        circleGlow.addColorStop(0, `rgba(255, 48, 48, ${opacity * 0.6})`);
        circleGlow.addColorStop(1, 'rgba(255, 48, 48, 0)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = circleGlow;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      drawCrosshair();
      drawScanningCone();

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
      requestAnimationFrame(drawRadar);
    };

    drawRadar();
  }, []);

  return (
    <div className={css['radar-container']}>
      <div className={css['radar-animation']} />
      <canvas
        ref={canvasRef}
        className={css['radar-canvas']}
        style={{
          width: '250px',
          height: '250px',
          filter: 'blur(0.5px)',
        }}
      />
    </div>
  );
}
