import { useTheme } from '@/app/views/ThemeContext';
import { useRef } from 'react';

const getMouseCoordinates = (e: MouseEvent) => {
	return { x: e.clientX, y: e.clientY };
};

const isMouseNearRightPane = (
	x: number,
	rightPaneRect: DOMRect,
	proximityThreshold: number,
) => {
	return (
		x > rightPaneRect.left - proximityThreshold && x < rightPaneRect.right
	);
};

const calculateOffsetX = (
	x: number,
	rightPaneRectLeft: number,
	proximityThreshold: number,
) => {
	// Adjust offsetX to include proximity area
	let offsetX = x - rightPaneRectLeft + proximityThreshold;
	return offsetX < 0 ? 0 : offsetX;
};

export const useFlashLightManager = () => {
    const { theme } = useTheme();
	const flashlightRef = useRef<HTMLDivElement>(null);
	const rightPaneRef = useRef<HTMLDivElement>(null);

	const applyFlashlightEffect = (x: number, y: number, glowRadius: number) => {
		flashlightRef.current!.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(60, 80, 100, 0.25), transparent ${glowRadius}px)`;
	};
	const clearRightPaneEffect = () => {
		rightPaneRef.current!.style.background = 'none';
	};

	const handleFlashlightInRightPane = (
		x: number,
		y: number,
		glowRadius: number,
		proximityThreshold: number,
	) => {
		const rightPaneRect = rightPaneRef.current!.getBoundingClientRect();

		if (isMouseNearRightPane(x, rightPaneRect, proximityThreshold)) {
			const offsetX = calculateOffsetX(
				x,
				rightPaneRect.left,
				proximityThreshold,
			);
			let proximityRatio = (rightPaneRect.left - x) / proximityThreshold;

			//Apply flashlight effect based on mouse position
			if (x < rightPaneRect.left) {
				rightPaneRef.current!.style.background = `radial-gradient(circle at ${offsetX}px ${y}px, rgba(60, 80, 100, ${
					0.25 * (1 - proximityRatio)
				}), transparent ${glowRadius * (1 - proximityRatio)}px)`;
			} else {
				rightPaneRef.current!.style.background = `radial-gradient(circle at ${offsetX}px ${y}px, rgba(60, 80, 100, 0.25), transparent ${glowRadius}px)`;
			}
		} else {
			clearRightPaneEffect();
		}
	};
    const handleFlashLight = (e: any) => {
		if (theme === 'dark') {
			const { x, y } = getMouseCoordinates(e);
			const glowRadius = 350; //Radio del brillo.
			const rightPaneGlowRadius = 400;
			const proximityThreshold = 100; // Tolerance in pixels - Umbral de proximidad.

			if (flashlightRef.current) {
				applyFlashlightEffect(x, y, glowRadius);

				if (rightPaneRef.current) {
					//It runs only if I save a reference to a right panel
					handleFlashlightInRightPane(
						x,
						y,
						rightPaneGlowRadius,
						proximityThreshold,
					);
				}
			}
		}
	};

    const isDisableFlashLight = ()=>theme !== "dark";

	return [
		flashlightRef,
		rightPaneRef,
		{
			handleFlashlightInRightPane,
			handleFlashLight,
            isDisableFlashLight
		},
	] as const;
};
